import ApiInstance from "../Api.js"
import User from "./User.js";
import AccountStatus from "./AccountStatus.js"
import { AuthObject } from "../../../auth/AuthObject.js";

const API = "user";
class ApiUser {

	constructor() {
		window.au = this;
	}

	signOut() {
		return ApiInstance.instance.fetch({
			apiArg: {
				op: "logout",
			}
		}, "auth","GET")
			.then(x => {

				return new Promise((res, rej) => {
					if (x.status=="ok") {
						
						res(x)
					} else {
						rej(x)
					}

				})

			});
	}

	signIn(email: string = "", password: string = "", remember: boolean = false): Promise<AuthObject> {
		return ApiInstance.instance.fetch({
			apiArg: {
				username: email,
				password,
				remember,
				op: "login",
			}
		}, "auth","GET")
			.then(x => new AuthObject(x)).then(x => {

				return new Promise((res, rej) => {
					if ((x.auth || x.exist)) {
						res(x)
					} else {
						rej(x)
					}

				})

			});
	}

	sendVerifyEmail(email = "") {
		return ApiInstance.instance.fetch({
			apiArg: {
				email,
				op: "sendverifyemail"
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

	sendRecoveryEmail(email = "") {
		return ApiInstance.instance.fetch({
			apiArg: {
				email,
				op: "sendrecoveryemail"
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
	changePassword(id = "", currentPassword = "", password = "") {
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

	searchUser(query) {
		return ApiInstance.instance.fetch({
			apiArg: {
				query,
				op: "search"
			}
		}, API)
			.then(x => {
				if (x.status == "ok") {
					return Promise.resolve((x.payload))
				} else {
					return Promise.reject(x)
				}
			});
	}

	getUser(user, by = "id") {
		return ApiInstance.instance.fetch({
			apiArg: {
				id: user.getId(),
				by: by,
				op: "get"
			}
		}, API)
			.then(x => {
				if (x.status == "ok") {
					return Promise.resolve(new User(x.payload))
				} else {
					return Promise.reject(x)
				}
			});
	}

	getAccountStatus() {
		return ApiInstance.instance.fetch({
			apiArg: {
				op: "accountstatus"
			}
		}, API)
			.then(x => {
				if (x.status == "ok") {
					return Promise.resolve(new AccountStatus(x.payload.user, x.payload.storageSummary))
				} else {
					return Promise.reject(x)
				}
			});
	}

	createUser(user) {
		const email = user.getEmail();
		const username = user.getUserName();
		const firstname = user.getFirstName();
		const lastname = user.getLastName();
		const password = user.getPassWord();

		return ApiInstance.instance.fetch({
			apiArg: {
				email,
				username,
				firstname,
				lastname,
				password,
				op: "create"
			}
		}, API)
			.then(x => {
				if (x.status == "ok") {
					return Promise.resolve(new User(x.payload))
				} else {
					return Promise.reject(x)
				}
			});
	}

	updateUser(user) {
		const id = user.getId();
		const email = user.getEmail();
		const username = user.getUserName();
		const firstname = user.getFirstName();
		const lastname = user.getLastName();
		const gender = user.getGender();

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
		}, API)
			.then(x => {
				if (x.status == "ok") {
					return Promise.resolve(new User(x.payload))
				} else {
					return Promise.reject(x)
				}
			});
	}

}

export const apiUserInstance = {
	instance: new ApiUser()
}

export default apiUserInstance;

