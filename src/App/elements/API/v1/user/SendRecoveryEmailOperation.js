import apiUserInstance from "./index";

class SendRecoveryEmailOperation {
	constructor({ email, thenCB = response => { }, catchCB = response => { } }) {
		apiUserInstance
			.instance
			.sendRecoveryEmail(email)
			.then(response => {
				thenCB(response);
			})
			.catch(response => {
				catchCB(response);
			});
	}
}

export {SendRecoveryEmailOperation}