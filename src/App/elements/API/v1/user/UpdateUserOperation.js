import  apiUserInstance  from "./index";
/**
 * operation para actualizar usuario
*/
class UpdateUserOperation {
	constructor({ user, thenCB = user => { }, catchCB = x => { } } = {}) {
		apiUserInstance
			.instance
			.updateUser(user)
			.then(user => {
				thenCB(user);
			})
			.catch(x => {
				catchCB(x);
			});
	}
}

export {UpdateUserOperation};