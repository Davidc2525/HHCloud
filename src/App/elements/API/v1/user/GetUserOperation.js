import {apiUserInstance} from "./index";

class GetUserOperation {
	constructor({ user, by = "id", thenCB = user => { }, catchCB = x => { } }) {
		apiUserInstance
			.instance
			.getUser(user, by)
			.then(user => {
				thenCB(user);
			})
			.catch(x => {
				catchCB(x);
			});
	}
}

export  {GetUserOperation};