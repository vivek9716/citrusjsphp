<html>
	<head>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" >
		<link rel="stylesheet" href="css/style.css" />
		<script src="js/jquery-1.11.1.min.js"></script>
		<script src="js/citrus.min.js"></script>
		<script src="js/citrus_user.js"></script>		
	</head>
	<body>
	<!--Transcational Details-->
	<?php 
		$txnID = uniqid();
		$access_key = 'XXXX';
		$secret_key = 'XXX';
		$vanityUrl = 'XXX';
		$notifyUrl = $returnUrl = 'http://localhost/citrus/response.php';	
		$amount = '1.00';
		$data = "merchantAccessKey=" . $access_key . "&transactionId="  . $txnID . "&amount=" . $amount;
		$signature = hash_hmac('sha1', $data, $secret_key);
	?>
		<div class="container">
			<div class="cardDetails">
				<div class="page-header">
					<h3>Personal Details</h3>
				</div>
				<div class="row">
					<div class="form-group col-lg-3">
						<input type="text" class="form-control" id="firstName" placeholder="First Name" />
					</div>
					<div class="form-group col-lg-3">
						<input type="text" class="form-control" id="lastName" placeholder="Last Name" />
					</div>
					<div class="form-group col-lg-3">
						<input type="text" class="form-control" id="email" placeholder="Email" />
					</div>
					<div class="form-group col-lg-3">
						<input type="text" class="form-control" id="street1" placeholder="Address 1" />
					</div>
				</div>
				<div class="row">
					<div class="form-group col-lg-3">
						<input type="text" class="form-control" id="street2" placeholder="Address 2" />
					</div>
					<div class="form-group col-lg-3">
						<input type="text" class="form-control" id="city" placeholder="City" />
					</div>
					<div class="form-group col-lg-3">
						<input type="text" id="state" class="form-control" placeholder="State" />
					</div>
					<div class="form-group col-lg-3">
						<input type="text" id="mobileNo" class="form-control" placeholder="Mobile Number" />
					</div>
					
				</div>
				
				<div class="row">
					<div class="form-group col-lg-3">
						<input type="text" id="zip" class="form-control" placeholder="Pin Code" />
					</div>
					<div class="form-group col-lg-3">
						<input type="hidden" id="mode" value="dropIn" />
					</div>
					<div class="form-group col-lg-3">
						<input type="hidden" id="country" value="India" />
					</div>
				</div>									
				<input type="hidden" readonly id="merchantTxnId" value="<?php echo $txnID; ?>" />
				<input type="hidden" readonly id="requestSignature" value="<?php echo $signature; ?>" />
				<input type="hidden" id="amount" value="<?php echo $amount; ?>" />
				
				
				<input type="hidden" readonly id="merchantAccessKey" value="<?php echo $access_key; ?>" />
				<input type="hidden" readonly id="vanityUrl" value="<?php echo $vanityUrl; ?>" />
				<input type="hidden" id="returnUrl" value="<?php echo $returnUrl; ?>" />
				<input type="hidden" id="notifyUrl" value="<?php echo $notifyUrl; ?>" />
				<div class="page-header">
					<h3>Pay Credit/Debit Card</h3>
				</div>
				<div id="card">
					<div class="row">
						<div class="form-group col-lg-3">
							<div id="cardNumber"></div>
						</div>
						<div class="form-group col-lg-3">
							<div id="expiry"></div>
						</div>
						<div class="form-group col-lg-3">
							<div id="cvv"></div>
						</div>
						<div class="form-group col-lg-3">
							<input type="text" id="cardHolderName" class="form-control" placeholder="Card Holder Name" />
						</div>
					</div>
					<div class="row">
						<div class="form-group col-lg-3">
							<button id="cardPayButton" class="btn btn-orange" type="button">Pay Now</button>
						</div>						
					</div>					
				</div>
				<div class="page-header">
					<h3>Pay Net Banking</h3>
				</div>
				<div class="row">
					<div class="form-group col-lg-3">
						<select class="form-control select-another" id="netbankingBanks">
							<option value="">Select Another Bank</option>
						</select>
					</div>						
				</div>
				
				<div class="row">
					<div class="form-group col-lg-3">
						<button type="button" class="btn btn-orange" id="netbankingButton" >Pay Now</button>
					</div>						
				</div>
			</div>						
		</div>
	</body>
</html>