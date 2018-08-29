import ApiInstance from "../Api.js"
import User from "./User.js";
import AccountStatus from "./AccountStatus.js"

const API = "user";
class ApiUser {

	constructor() {
		window.au = this;
	}

	sendVerifyEmail(email=""){
		return ApiInstance.instance.fetch({
			apiArg: {
				email,
				op: "sendverifyemail"
			}
		},API)
		.then(x=>{
			if(x.status=="ok"){
				return Promise.resolve(x.payload)
			}else{
				return Promise.reject(x)
			}
		});
	}

	sendRecoveryEmail(email=""){
		return ApiInstance.instance.fetch({
			apiArg: {
				email,
				op: "sendrecoveryemail"
			}
		},API)
		.then(x=>{
			if(x.status=="ok"){
				return Promise.resolve(x.payload)
			}else{
				return Promise.reject(x)
			}
		});
	}

	changePasswordByRecover(email = "", token = "", password = "") {
		return ApiInstance.instance.fetch({
				apiArg: {
					email,
					token,
					password,
					op: "changepasswordbyrecover"
				}
			}, API)
			.then(x => {
				if (x.status == "ok") {
					return Promise.resolve(x.payload)
				} else {
					return Promise.reject(x)
				}
			});
	}
	changePassword(id = "",currentPassword = "", password = "") {
		return ApiInstance.instance.fetch({
				apiArg: {
					id,
					currentPassword,
					password,
					op: "changepassword"
				}
			}, API)
			.then(x => {
				if (x.status == "ok") {
					return Promise.resolve(x.payload)
				} else {
					return Promise.reject(x)
				}
			});
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

	getAccountStatus() {
		return ApiInstance.instance.fetch({
			apiArg: {
				op: "accountstatus"
			}
		},API)
		.then(x=>{
			if(x.status=="ok"){
				return Promise.resolve(new AccountStatus(x.payload.user,x.payload.storageSummary))
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

	updateUser(user) {
		const id = user.getId();
		const email 	= user.getEmail();
		const username 	= user.getUserName();
		const firstname	= user.getFirstName();
		const lastname 	= user.getLastName();
		const gender 	= user.getGender();

		return ApiInstance.instance.fetch({
			apiArg: {
				id,
				email,
				username,
				firstname,
				lastname,
				gender,
				op: "update"
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

}

const apiUserInstance = {
	instance: new ApiUser()
}

export default apiUserInstance;

class ChangePasswordOperation {
	constructor({
		id,
		currentPassword,
		password,
		thenCB = response => {},
		catchCB = response => {}
	}) {
		apiUserInstance
			.instance
			.changePassword(
				id,
				currentPassword,
				password)
			.then(response => {
				thenCB(response)
			})
			.catch(response => {
				catchCB(response)
			});
	}
}

class ChangePasswordByRecoverOperation {
	constructor({
		email,
		token,
		password,
		thenCB = response => {},
		catchCB = response => {}
	}) {
		apiUserInstance
			.instance
			.changePasswordByRecover(
				email,
				token,
				password)
			.then(response => {
				thenCB(response)
			})
			.catch(response => {
				catchCB(response)
			});
	}
}

class SendRecoveryEmailOperation {
	constructor({
		email,
		thenCB = response => {},
		catchCB = response => {}
	}) {
		apiUserInstance
		.instance
		.sendRecoveryEmail(email)
		.then(response=>{
			thenCB(response)
		})
		.catch(response=>{
			catchCB(response)
		});
	}
}

class SendVerifyEmailOperation {
	constructor({
		email,
		thenCB = response => {},
		catchCB = response => {}
	}) {
		apiUserInstance
		.instance
		.sendVerifyEmail(email)
		.then(response=>{
			thenCB(response)
		})
		.catch(response=>{
			catchCB(response)
		});
	}
}

class GetAccountStatusOperation {
	constructor({
		thenCB = accountstatus=>{},
		catchCB = x => {}
	}) {
		apiUserInstance
		.instance
		.getAccountStatus()
		.then(accountstatus=>{
			thenCB(accountstatus)
		})
		.catch(x=>{
			catchCB(x)
		});
	}
}

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

class UpdateUserOperation {
	constructor({
		user,
		thenCB = user=>{},
		catchCB = x => {}
	}) {
		apiUserInstance
		.instance
		.updateUser(user)
		.then(user=>{
			thenCB(user)
		})
		.catch(x=>{
			catchCB(x)
		});
	}
}
export {
	GetAccountStatusOperation,
	GetUserOperation,
	UpdateUserOperation,
	CreateUserOperation,
	SendVerifyEmailOperation,
	SendRecoveryEmailOperation,
	ChangePasswordOperation,
	ChangePasswordByRecoverOperation
}
