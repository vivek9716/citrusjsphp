var citrusUser = {
	staticElementIds : function () {
		return [
				'firstName','lastName','email','street1','street2','city','state','mobileNo','zip','cardHolderName'
			];
	},
	isValidForm : function (ids) {									
		this.validateData(ids);
		return $('.errorUser').length;
	},
	validateData : function (elementIds) {					
		var error = {};
		var self = this;
		$.each(elementIds, function(key, elementID) {
			var element = $('#' + elementID);
			var elementValue = element.val();
			if (elementValue == '') {
				self.isError(element, true);
			} else {
				switch (elementID) {
					case 'mobileNo' : 
								var pattern = new RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/);
								self.isError(element, !pattern.test(elementValue));																							
								break;
					case 'email' : 
								var pattern = new RegExp(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);
								self.isError(element, !pattern.test(elementValue));																																
								break;			
					default :
							self.isError(element, false);
							break;
				}
				
			}
		});
	},
	isError : function (element, isTrue) {
		if (!isTrue) 
			element.addClass('successUser').removeClass('errorUser');
		else 
			element.addClass('errorUser').removeClass('successUser');
	},
	getPaymentData : function () {
		var data = {
				"merchantTxnId": $('#merchantTxnId').val(),
				"currency": "INR",
				"amount": $('#amount').val(),
				"userDetails": {
					"email": $('#email').val(),
					"firstName": $('#firstName').val(),
					"lastName": $('#lastName').val(),
					"address": {
						"street1": $('#street1').val(),
						"street2": $('#street2').val(),
						"city": $('#city').val(),
						"state": $('#state').val(),
						"country": $('#country').val(),
						"zip": $('#zip').val()
					},
					"mobileNo": $('#mobileNo').val()
				},
				"returnUrl": $('#returnUrl').val(),
				"notifyUrl": $('#notifyUrl').val(),
				"requestSignature": $("#requestSignature").val(),
				"customParameters": {
						
				},
				"mode": $("#mode").val()
			};
		return data;
	}
};

var ids = citrusUser.staticElementIds();
$(document).on('keyup', 'input', function() {
	var ids = [$(this).attr('id')];
	citrusUser.isValidForm(ids);
});


/*Citrus Payment Gateway*/
$(document).ready(function(){
	citrus.setConfig({
		merchantAccessKey : $('#merchantAccessKey').val(),
		vanityUrl : $('#vanityUrl').val(),
		env : 'sandbox' // prod/sandbox
	});
	
	citrus.registerHandlers("errorHandler", function (error) {
	   console.log(error);
	   $('#cardPayButton').prop('disabled', false);
	   $('#netbankingButton').prop('disabled', false);
	});
	
	citrus.registerHandlers("serverErrorHandler", function (error) {
	   console.log("Error from server");
	   console.log(JSON.stringify(error));
	   $('#cardPayButton').prop('disabled', false);
	   $('#netbankingButton').prop('disabled', false);
	});
	
	citrus.registerHandlers("transactionHandler", function(resp) {	   
	   $('#cardPayButton').prop('disabled', false);
	   $('#netbankingButton').prop('disabled', false);
	   console.log(JSON.stringify(resp));
	});	
	
	citrus.registerHandlers("validationHandler", function (hostedField, cardValidationResult) {
		if(cardValidationResult.isValid)
			console.log('field type '+hostedField.fieldType + ' is valid.');
		else
			console.log('field type '+hostedField.fieldType + ' is invalid, message '+cardValidationResult.txMsg);
	});
	
	
	citrus.cards.getPaymentDetails({

		vanityUrl: $('#vanityUrl').val()

	}, function (err, pgSettingData) {

		if(err){

			console.log('got error while calling getPaymentDetails',err);

			return;

		}

		/*code block specific to netBanking starts.

		This code should be used to populate the banks supported*/

		pgSettingData.netBanking.forEach(function (bank) {

			$('#netbankingBanks').append($("<option />").val(bank.issuerCode).text(bank.bankName));

		});

		/*code block specific to netBanking ends*/

	});
	
	citrus.hostedFields.create({
		setupType : "card",
		hostedFields: [{
			fieldType:'cvv',
			selector:'#cvv',
			placeholder:'CVV'
		},{
			fieldType:'expiry',
			selector:'#expiry',
			placeholder:'MM/YY'
		},{
			fieldType:'number',
			selector:'#cardNumber',
			placeholder:'Card Number'
		}],
		style : {
			'input.valid': {
				color:'green'
			},
			'input.invalid': {
				color:'red'
			}
		}
	});	
	
	$("#cardPayButton").on('click', function () {					
		if (citrusUser.isValidForm(ids) != 0) 
			return false;
		//call the method described in step 4
		var data = citrusUser.getPaymentData();
		$(this).prop('disabled', false);
		$("#netbankingButton").prop('disabled', false);
		data.paymentDetails = {
			paymentMode: "card",
			holder: $('#cardHolderName').val(),
			type:'credit'
		};
		citrus.payment.makePayment(data);
	});
	
	$("#netbankingButton").on("click", function () {					
		if (citrusUser.isValidForm(ids) != 0) 
				return false;
		//disable the payment button to accidently sending
		//multiple payment request for the same transaction.
		$(this).prop('disabled', true);
		$("#cardPayButton").prop('disabled', true);
		//call the method described in step 4	
		var data = citrusUser.getPaymentData();
		//fill bank related details in basic payment object.
		data.paymentDetails = {
			"paymentMode" : "netBanking",
			"bankCode" : $('#netbankingBanks').val()
		};
		citrus.payment.makePayment(data);            
	});
	
	
		
});
/*Citrus Payment Gateway*/


