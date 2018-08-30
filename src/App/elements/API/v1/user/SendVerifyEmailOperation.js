import apiUserInstance from "./index";
class SendVerifyEmailOperation {
	constructor({ email, thenCB = response => { }, catchCB = response => { } }) {
		apiUserInstance
			.instance
			.sendVerifyEmail(email)
			.then(response => {
				thenCB(response);
			})
			.catch(response => {
				catchCB(response);
			});
	}
}

export {SendVerifyEmailOperation}