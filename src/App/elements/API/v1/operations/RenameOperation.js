import ApiInstance from "../Api.js"
class RenameOperation {
	constructor({
			path = "/",
			dstPath = "/",
			thenCB = () => {},
			catchCB = () => {}
		}) {

		let timestart = new Date().getTime()

		this.path = path;
		this.thenCB = thenCB;
		this.catchCB = catchCB;

		ApiInstance.instance.fetch({
				apiArg: {
					path: this.path,
					srcPath: this.path,
					dstPath:dstPath,
					op: "rename"
				}
			})
			.then(x => {
				let timeend = new Date().getTime()
				if (x.status === "ok") {
					this.thenCB({...x,time:timeend-timestart})
				} else if (x.status === "error") {
					this.catchCB({...x,time:timeend-timestart})
				}
			})
			.catch(x => {

				this.catchCB({
					status: "error",
					...x
				})
			})


	}

}

export default RenameOperation;