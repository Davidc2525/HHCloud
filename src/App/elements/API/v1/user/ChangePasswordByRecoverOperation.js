import apiUserInstance from "./index";
class ChangePasswordByRecoverOperation {
	constructor({ email, token, password, thenCB = response => { }, catchCB = response => { } }) {
		apiUserInstance
			.instance
			.changePasswordByRecover(email, token, password)
			.then(response => {
				thenCB(response);
			})
			.catch(response => {
				catchCB(response);
			});
	}
}

export {ChangePasswordByRecoverOperation}