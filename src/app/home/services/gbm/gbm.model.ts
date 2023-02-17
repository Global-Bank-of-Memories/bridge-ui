export const GBM_NETWORK_PASSPHRASE = 'BankOfMemories.org; November 2020';
export const GBM_DESTINATION_PUBLIC_WALLET_ID = 'GCP2WI2EYG2YCAD6IGFN4EHRPZQSPR33BVCTOYLJQTACSDEVO32LQR3S';
export const WGBM_MATIC_TOKEN_ADDRESS = '0x35aF0399523635635790940A9DFACAa139053cfB';

// const account = await server.loadAccount(sourcePublicKey);
// const fee = await server.fetchBaseFee();

// this.transaction = new TransactionBuilder(account, {
// 	fee: String(fee),
// 	networkPassphrase: 'BankOfMemories.org; November 2020'
// })
// 	.addOperation(
// 		Operation.payment({
// 			destination: 'GCP2WI2EYG2YCAD6IGFN4EHRPZQSPR33BVCTOYLJQTACSDEVO32LQR3S',
// 			asset: Asset.native(),
// 			amount: fromValue.toString()
// 		})
// 	)
// 	.addMemo(new StellarSdk.Memo.hash(Buffer.from(keyArray)))
// 	.setTimeout(0)
// 	.build();

// return this.transaction.toEnvelope().toXDR('base64');
