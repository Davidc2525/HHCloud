import ApiInstance from "../Api.js";

import {Mode} from "./Mode";

const API = "share";

class ApiShare {


	constructor() {
		window.as = this;
	}
	//{spath:"/Documentos/",subpath:"f1/red%20neuronal%20darknet%20.png",owner:"1539366533225"}
	/*Fs*/
	fsStatus({ spath, subpath, owner, thenCB = _ => { }, catchCB = x => { } } = {}) {
		return ApiInstance.instance.fetch({
			apiArg: {
				op: "fs::status",
				spath,
				subpath,
				owner,
			}
		}, API, "POST")
			.then(x => {

				return new Promise((res, rej) => {
					if (x.status == "ok") {

						res(x)
					} else {
						rej(x)
					}

				})

			});
	}

	fsList({ spath, subpath, owner, thenCB = _ => { }, catchCB = x => { } } = {}) {

		return ApiInstance.instance.fetch({
			apiArg: {
				op: "fs::ls",
				spath,
				subpath,
				owner,
			}
		}, API, "POST")
			.then(x => {

				return new Promise((res, rej) => {
					if (x.status == "ok") {

						res(x)
					} else {
						rej(x)
					}

				})

			});
	}

	fsDownload({ spath, subpath, owner, thenCB = _ => { }, catchCB = x => { } } = {}) {

		return ApiInstance.instance.fetch({
			apiArg: {
				op: "fs::download",
				spath,
				subpath,
				owner,
			}
		}, API, "POST")
			.then(x => {

				return new Promise((res, rej) => {
					if (x.status == "ok") {

						res(x)
					} else {
						rej(x)
					}

				})

			});
	}
	/*Owner*/
	ownerCreateShare({ mode = Mode.P, users = [], path, thenCB = _ => { }, catchCB = x => { } } = {}) {
		if (path == null) {
			throw "debe espesificar una rruta"
		}
		return ApiInstance.instance.fetch({
			apiArg: {
				op: "own::share",
				path,
				mode,
				users,
			}
		}, API, "POST")
			.then(x => {

				return new Promise((res, rej) => {
					if (x.status == "ok") {
						res(x)
					} else {
						rej(x)
					}

				})

			});
	}

	ownerDelete({ path, thenCB = _ => { }, catchCB = x => { } } = {}) {
		if (path == null) {
			throw "debe espesificar una rruta"
		}
		return ApiInstance.instance.fetch({
			apiArg: {
				op: "own::delete",
				path
			}
		}, API, "POST")
			.then(x => {

				return new Promise((res, rej) => {
					if (x.status == "ok") {
						res(x)
					} else {
						rej(x)
					}

				})

			});
	}

	ownerGet({ wusers = false, path, thenCB = _ => { }, catchCB = x => { } } = {}) {
		if (path == null) {
			throw "debe espesificar una rruta"
		}
		return ApiInstance.instance.fetch({
			apiArg: {
				op: "own::get",
				path,
				wusers
			}
		}, API, "POST")
			.then(x => {

				return new Promise((res, rej) => {
					if (x.status == "ok") {
						res(x)
					} else {
						rej(x)
					}

				})

			});
	}

	ownerSetUsersPath({ users = [], path, mode = null, thenCB = _ => { }, catchCB = x => { } } = {}) {
		if (path == null) {
			throw "debe espesificar una rruta"
		}

		let args = {
			op: "own::set_users_path",
			path,
			users
		};

		if (mode != null) {
			args = { ...args, mode };
		}

		return ApiInstance.instance.fetch({
			apiArg: args
		}, API, "POST")
			.then(x => {

				return new Promise((res, rej) => {
					if (x.status == "ok") {
						res(x)
					} else {
						rej(x)
					}

				})

			});
	}

	ownerSetMode({ mode = Mode.P, path, thenCB = _ => { }, catchCB = x => { } } = {}) {
		if (path == null) {
			throw "debe espesificar una rruta"
		}
		return ApiInstance.instance.fetch({
			apiArg: {
				op: "own::set_mode",
				path,
				mode
			}
		}, API, "POST")
			.then(x => {

				return new Promise((res, rej) => {
					if (x.status == "ok") {
						res(x)
					} else {
						rej(x)
					}

				})

			});
	}


	/*User */
	userList() {

		return ApiInstance.instance.fetch({
			apiArg: { op: "user::list" }
		}, API, "POST")
			.then(x => {

				return new Promise((res, rej) => {
					if (x.status == "ok") {
						res(x)
					} else {
						rej(x)
					}

				})

			});
	}

	userDelete({ owner, path, thenCB = _ => { }, catchCB = x => { } } = {}) {
		if (path == null) {
			throw "debe espesificar una rruta"
		}
		if (owner == null) {
			throw "debe espesificar owner"
		}
		return ApiInstance.instance.fetch({
			apiArg: {
				op: "user::delete",
				owner,
				path
			}
		}, API, "POST")
			.then(x => {

				return new Promise((res, rej) => {
					if (x.status == "ok") {
						res(x)
					} else {
						rej(x)
					}

				})

			});
	}

	userCopy({ owner, spath, srcpath, dstpath } = {}) {
		if (spath == null) {
			throw "debe espesificar una rruta"
		}
		if (srcpath == null) {
			throw "debe espesificar una srcpath"
		}
		if (dstpath == null) {
			throw "debe espesificar una dstpath"
		}
		if (owner == null) {
			throw "debe espesificar owner"
		}
		return ApiInstance.instance.fetch({
			apiArg: {
				op: "user::copy",
				owner,
				spath,
				srcpath,
				dstpath
			}
		}, API, "POST")
			.then(x => {

				return new Promise((res, rej) => {
					if (x.status == "ok") {
						res(x)
					} else {
						rej(x)
					}

				})

			});
	}
}



export const apiShareInstance = {
	instance: new ApiShare()
}

export default apiShareInstance;