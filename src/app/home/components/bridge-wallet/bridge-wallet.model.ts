// this.loading = true;
// WalletBaseService.logger('Starting withdraw...');
// const interval = setInterval(() => {
// 	this.gbmService
// 		.withdraw(this.transactionHash)
// 		.pipe(
// 			catchError(err => {
// 				clearInterval(interval);
// 				WalletBaseService.logger('Error while withdraw', LOGGER_TYPES.ERROR);
// 				this.loading = false;
// 				return err;
// 			})
// 		)
// 		.subscribe(res => {
// 			if (res) {
// 				this.withdrawEthereumResponse = res;
// 				clearInterval(interval);

// 				void this.polygonService
// 					.getWallet()
// 					.toPromise()
// 					.then(res => {
// 						const web3Instance = new (window as any).Web3((window as any).ethereum);

// 						let withdrawERC20Request = null as any;

// 						if (this.withdrawEthereumResponse) {
// 							withdrawERC20Request = {
// 								id: `0x${this.withdrawEthereumResponse.deposit_id}`,
// 								expiration: BigNumber.from(this.withdrawEthereumResponse.expiration),
// 								recipient: this.walletsToExchange.to?.walletId || '',
// 								amount: this.withdrawEthereumResponse.amount,
// 								token: this.withdrawEthereumResponse.token
// 							};
// 						}

// 						void this.polygonService
// 							.getBridgeAbi()
// 							.toPromise()
// 							.then(async res => {
// 								console.log(res);
// 								WalletBaseService.logger('Getting bridge abi...');
// 								const bridgeContract = this.polygonService.getContract(
// 									res.abi,
// 									'0x18b11A6E4213e5b9B94c97c2A165F889faa3D7C4'
// 								);

// 								const indexes: number[] = [];
// 								const signatures: Buffer[] = [];

// 								for (let i = 0; i < validatorUrls.length; i++) {
// 									const addressSigner = await bridgeContract.methods.signers(i).call();
// 									indexes.push(i);
// 									signatures.push(
// 										Buffer.from(
// 											addressSigner === this.withdrawEthereumResponse['address']
// 												? this.withdrawEthereumResponse['signature']
// 												: '',
// 											'hex'
// 										)
// 									);
// 								}

// 								WalletBaseService.logger('Please confirm the transaction in metamask', LOGGER_TYPES.WARNING);

// 								const rs = bridgeContract.methods
// 									.withdrawERC20(withdrawERC20Request, signatures, indexes)
// 									.send({ from: this.walletsToExchange.to?.walletId || '' })
// 									.then(() => {
// 										this.loading = false;
// 										this.submitState = SubmitState.SEND_TRANSFER;
// 										WalletBaseService.logger('Withdraw completed successfully', LOGGER_TYPES.SUCCESS);
// 									})
// 									.catch(() => {
// 										this.loading = false;
// 										WalletBaseService.logger(
// 											'User refused transaction or something went wrong',
// 											LOGGER_TYPES.ERROR
// 										);
// 									});

// 								return rs;
// 							})
// 							.catch(() => {
// 								this.loading = false;
// 								WalletBaseService.logger('Getting abi failed or contract refused it', LOGGER_TYPES.ERROR);
// 							});
// 					})
// 					.catch(() => {
// 						this.loading = false;
// 						WalletBaseService.logger('Error while withdraw', LOGGER_TYPES.ERROR);
// 					});
// 			}
// 		});
// }, 1000);
