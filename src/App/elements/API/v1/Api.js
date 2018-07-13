import ListOperation from "./operations/ListOperation.js"
import GetStatusOperation from "./operations/GetStatusOperation.js"
import RenameOperation from "./operations/RenameOperation.js"
import MkDirOperation from "./operations/MkDirOperation.js"
import DeleteOperation from "./operations/DeleteOperation.js"
import DownloadOperation from "./operations/DownloadOperation.js"

import {move,copy} from "./operations/MoveOrCopyOperation.js"

class Api {


	constructor() {
		this.hostService = "http://orchi";
		this.portService = 8080;
		this.versionService = "v1"
		this.pathService = "/api/"

		this.urlService = new URL(this.hostService);
		this.urlService.pathname = this.pathService
		this.urlService.port = this.portService

		this.operations = {}

		this.registerOperation("list", ListOperation)
		this.registerOperation("status", GetStatusOperation)
		this.registerOperation("rename", RenameOperation)
		this.registerOperation("mkdir", MkDirOperation)
		this.registerOperation("copy", copy())
		this.registerOperation("move", move())
		this.registerOperation("delete", DeleteOperation)
		this.registerOperation("download", DownloadOperation)



	}

	callOperation(name, args) {

		let op = this.operations[name]
		if (op == null) {
			throw `operaion no ${name} existe`
		} else {
			new op(args);
			op = null;
		}
	}

	registerOperation(name, Operation) {
		this.operations[name] = Operation;
	}

	fetch({
		apiArg
	}) {
		//console.warn("nuevo fetch",apiArg)
		var arg = { ...apiArg
		}
		var fd = new FormData();

		fd.append("args", JSON.stringify(arg))

		var options = {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Accept': 'application/json',
			},
			body: (fd)
		}
		return fetch(this.urlService, options)
			.then(x => x.json())
			.catch(x => Promise.reject({
				error: x
			}))

	}

	xmlHttpRequestFetch({apiArg}) {


	}
}


const ApiInstance = {
	instance: new Api()
}

window.api = ApiInstance.instance
export default ApiInstance;

//calls
/*try {
	ApiInstance.instance.callOperation("list", {
		path: "/music",
		thenCB: (x) => console.warn(x),
		catchCB: (x) => console.error(x)
	})
} catch (e) {
	console.error(e)
}*/