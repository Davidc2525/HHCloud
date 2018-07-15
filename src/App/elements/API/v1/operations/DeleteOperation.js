import ApiInstance from "../Api.js"

class DeleteOperation {
	constructor({
		path = "/",
		thenCB = () => {},
		catchCB = () => {},
		confirmFun = (path) => {
			return confirm("esta apunto de eliminar "+path+", desea continuar")
		}
	}) {

		let timestart = new Date().getTime()

		this.path = path;
		this.thenCB = thenCB;
		this.catchCB = catchCB;

		if (confirmFun(this.path)) {
			ApiInstance.instance.fetch({
					apiArg: {
						path: this.path,
						op: "delete"
					}
				})
				.then(x => {
					let timeend = new Date().getTime()
					if (x.status == "ok") {
						this.thenCB({ ...x,
							time: timeend - timestart
						})
					} else if (x.status == "error") {
						this.catchCB({ ...x,
							time: timeend - timestart
						})
					}
				})
				.catch(x => {

					catchCB({
						status: "error",
						error: "connection_error",
						errorMsg: "error de coneccion"
					})

				})


		}
	}



}

export default DeleteOperation;