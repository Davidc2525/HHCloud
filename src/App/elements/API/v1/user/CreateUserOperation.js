import  apiUserInstance  from "./index";
class CreateUserOperation {
	constructor({ user, thenCB = user => { }, catchCB = x => { } } = {}) {
		apiUserInstance
			.instance
			.createUser(user)
			.then(user => {
				thenCB(user);
			})
			.catch(x => {
				catchCB(x);
			});
	}
}

export {CreateUserOperation};