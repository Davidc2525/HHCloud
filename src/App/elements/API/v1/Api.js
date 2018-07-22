import ListOperation from "./operations/ListOperation.js"
import GetStatusOperation from "./operations/GetStatusOperation.js"
import RenameOperation from "./operations/RenameOperation.js"
import MkDirOperation from "./operations/MkDirOperation.js"
import DeleteOperation from "./operations/DeleteOperation.js"
import DownloadOperation from "./operations/DownloadOperation.js"

import {move,copy} from "./operations/MoveOrCopyOperation.js"

class Api {


	constructor() {
		this.hostService = "http://orchi2";
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

		const op = this.operations[name]
		if (op == null) {
			throw `operaion no ${name} existe`
		} else {
			return new op(args);
		}

	}

	registerOperation(name, Operation) {
		this.operations[name] = Operation;
	}

     fetch({apiArg}){

        return new Promise((resolve,reject)=>{

                var arg = { ...apiArg}
		        var fd = new FormData();

		        fd.append("args", JSON.stringify(arg))


		        var xhr = new XMLHttpRequest();

		        xhr.open('POST', this.urlService/*+`?args=${btoa(JSON.stringify(arg))}`*/, true);
		         //xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
                //xhr.setRequestHeader('Content-type', 'application/json');
                //xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
		        xhr.withCredentials = true;
		        xhr.responseType = 'json';


		        xhr.onprogress = (event) => {

		        };
 
				xhr.onerror = (event) => {

					console.warn(xhr)
					reject({
						error: "connection_error",
						errorMsg: "Error al tratar de conectar, revisa tu conexion."
					})
				}

		        xhr.onload = event => {
			        resolve(xhr.response)
		        };

		        xhr.send((fd));

        })


     }

	fetch2({
		apiArg
	}) {
		//console.warn("nuevo fetch",apiArg)
		var arg = {...apiArg}
		var fd = new FormData();

		fd.append("args", JSON.stringify(arg))

		var options = {
			method: 'POST',
			//mode: 'cors',
			headers: {
				'Accept': 'application/json',
			},
			//credentials: 'include', mode: 'no-cors',
			body: (fd)
		}
		return fetch(this.urlService+"?args="+btoa(JSON.stringify(arg)), options)
			.then(x => x.json())
			.catch(x => {console.warn(x); return Promise.reject({
				error: x
			})})

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
