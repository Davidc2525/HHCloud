import ApiInstance from "../Api.js"
import {List} from "immutable"
class DeleteOperation {
	constructor({
		path = "/",
		paths = null,
		thenCB = () => {},
		catchCB = () => {},
		confirmFun = (path) => {
			return confirm("esta apunto de eliminar "+path+", desea continuar")
		}
	}) {

		var multiPath = null;
		if(paths!=null){
			if(List.isList(paths)){
				multiPath = paths.toJS();
			}
		}
		let timestart = new Date().getTime()

		this.path = path;
		this.thenCB = thenCB;
		this.catchCB = catchCB;

		if (confirmFun(this.path)) {
			ApiInstance.instance.fetch({
					apiArg: {
						path: this.path,
						paths:multiPath,
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

					this.catchCB({
						status: "error",
						...x
					})

				})


		}
	}



}

export default DeleteOperation;