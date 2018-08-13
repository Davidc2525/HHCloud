import ApiInstance from "../Api.js"
import User from "./User.js";

const API = "user";
class ApiUser {

	constructor() {
		window.au = this;
	}

	getUser(user,by="id") {
		return ApiInstance.instance.fetch({
			apiArg: {
				id: user.getId(),
				by: by,
				op: "get"
			}
		},API)
		.then(x=>{
			if(x.status=="ok"){
				return Promise.resolve(new User(x.payload))
			}else{
				return Promise.reject(x)
			}
		});
	}

	createUser(user) {
		const email 	= user.getEmail();
		const username 	= user.getUserName();
		const firstname	= user.getFirstName();
		const lastname 	= user.getLastName();
		const password 	= user.getPassWord();

		return ApiInstance.instance.fetch({
			apiArg: {
				email,
				username,
				firstname,
				lastname,
				password,
				op: "create"
			}
		},API)
		.then(x=>{
			if(x.status=="ok"){
				return Promise.resolve(new User(x.payload))
			}else{
				return Promise.reject(x)
			}
		});
	}

	userExist() {

	}

}

const apiUserInstance = {
	instance: new ApiUser()
}

export default apiUserInstance;

class GetUserOperation {
	constructor({
		user,
		by = "id",
		thenCB = user=>{},
		catchCB = x => {}
	}) {
		apiUserInstance
		.instance
		.getUser(user, by)
		.then(user=>{
			thenCB(user)
		})
		.catch(x=>{
			catchCB(x)
		});
	}
}

class CreateUserOperation {
	constructor({
		user,
		thenCB = user=>{},
		catchCB = x => {}
	}) {
		apiUserInstance
		.instance
		.createUser(user)
		.then(user=>{
			thenCB(user)
		})
		.catch(x=>{
			catchCB(x)
		});
	}
}
export {GetUserOperation,CreateUserOperation}