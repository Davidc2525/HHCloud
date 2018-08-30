import apiUserInstance from "./index";
class GetAccountStatusOperation {
	constructor({ thenCB = accountstatus => { }, catchCB = x => { } }) {
		apiUserInstance
			.instance
			.getAccountStatus()
			.then(accountstatus => {
				thenCB(accountstatus);
			})
			.catch(x => {
				catchCB(x);
			});
	}
}
export {GetAccountStatusOperation}