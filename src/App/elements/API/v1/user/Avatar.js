import apiUserInstance from "./index";
class SetAvatarOperation {
	constructor({ data,original = null, thenCB = response => { }, catchCB = response => { } } = {}) {
		apiUserInstance
			.instance
			.setAvatar(data,original)
			.then(response => {
				thenCB(response);
			})
			.catch(response => {
				catchCB(response);
			});
	}
}

class DeleteAvatarOperation {
	constructor({ thenCB = response => { }, catchCB = response => { } } = {}) {
		apiUserInstance
			.instance
			.deleteAvatar()
			.then(response => {
				thenCB(response);
			})
			.catch(response => {
				catchCB(response);
			});
	}
}

class SetAvatarByPath {
	constructor({ path, thenCB = response => { }, catchCB = response => { } } = {}) {
		apiUserInstance
			.instance
			.setAvatarByPath(path)
			.then(response => {
				thenCB(response);
			})
			.catch(response => {
				catchCB(response);
			});
	}
}



export {SetAvatarOperation,DeleteAvatarOperation,SetAvatarByPath}
