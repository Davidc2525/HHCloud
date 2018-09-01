import ListOperation from "./operations/ListOperation.js"
import GetStatusOperation from "./operations/GetStatusOperation.js"
import RenameOperation from "./operations/RenameOperation.js"
import MkDirOperation from "./operations/MkDirOperation.js"
import DeleteOperation from "./operations/DeleteOperation.js"
import DownloadOperation from "./operations/DownloadOperation.js"
//import {auth} from "../../auth/index.js";
import {move,copy} from "./operations/MoveOrCopyOperation.js"

import { ChangePasswordByRecoverOperation } from "./user/ChangePasswordByRecoverOperation";
import { SendRecoveryEmailOperation } from "./user/SendRecoveryEmailOperation";
import { SendVerifyEmailOperation } from "./user/SendVerifyEmailOperation";
import { GetAccountStatusOperation } from "./user/GetAccountStatusOperation";
import { CreateUserOperation } from "./user/CreateUserOperation";
import { ChangePasswordOperation } from "./user/ChangePasswordOperation";
import { GetUserOperation } from "./user/GetUserOperation";
import { UpdateUserOperation } from "./user/UpdateUserOperation";
import {
	store
} from "../../../redux/index.js";

const API_DEFAULT = "fs";
class Api {


	constructor() {

		//store.subscribe(x=>this.getUserId())

		this.hostService = SERVICE_URL;//"http://orchi";
		this.portService = SERVICE_PORT; //8080;
		this.versionService = "v1"
		this.pathService = "/api/"

		this.urlService = new URL(this.hostService);
		this.urlService.pathname = this.pathService
		this.urlService.port = this.portService

		this.operations = {}
		//this.getUserId();
		this.registerOperation("list", ListOperation)
		this.registerOperation("status", GetStatusOperation)
		this.registerOperation("rename", RenameOperation)
		this.registerOperation("mkdir", MkDirOperation)
		this.registerOperation("copy", copy())
		this.registerOperation("move", move())
		this.registerOperation("delete", DeleteOperation)
		this.registerOperation("download", DownloadOperation)
		this.registerOperation("accountstatus", GetAccountStatusOperation)
		this.registerOperation("getuser", GetUserOperation)
		this.registerOperation("createuser", CreateUserOperation)
		this.registerOperation("updateuser", UpdateUserOperation)
		this.registerOperation("sendrecoveryemail", SendRecoveryEmailOperation)
		this.registerOperation("sendverifyemail", SendVerifyEmailOperation)
		this.registerOperation("changepassword", ChangePasswordOperation)
		this.registerOperation("changepasswordbyrecover", ChangePasswordByRecoverOperation)
	}

	getUserId() {
		//console.warn("API",store)
		//return
		const auth = store.getState().get("auth");

		const dataUser = auth.get("dataUser", null);
		var displayName = "";
		if (dataUser != null) {
			this.userid = dataUser.get("id")
		}

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

     fetch({apiArg},api = API_DEFAULT){

        return new Promise((resolve,reject)=>{

                var arg = { ...apiArg,uid:this.userid}
		        var fd = new FormData();

		        fd.append("args", JSON.stringify(arg,null,2))
		        fd.append("op", arg.op)


		        var xhr = new XMLHttpRequest();

		        xhr.open('POST', this.urlService+api/*+`?args=${btoa(JSON.stringify(arg))}`*/, true);
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
						msg: "Error al tratar de conectar, revisa tu conexion."
					})
				}

				xhr.onload = event => {
					const auth = require("../../auth/index.js").auth
					//resolve(xhr.response)
					//return
					var response = xhr.response;
					console.warn(response)
					if (response.status === "error") {
						if (response.error == "session") {
							reject(response)
							auth.Auth.setStateNoLogin();
							return;
						}

						reject(response)

					} else {
						resolve(response)
					}
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
