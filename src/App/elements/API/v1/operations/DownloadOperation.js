import ApiInstance from "../Api.js"
import * as immutable from "immutable"
import {encodePathsInArg} from "../Api.js"
window.imm = immutable

class DownloadOperation {
	constructor({
		path = "/", // string or Immutable.List
		thenCB = _ => {},
		catchCB = _ => {},
		/*funciones de eventos de XMLHttpRequest*/
		preStart = payload => {},
		onLoad = (XMLHttpRequest, payload) => {},
		onError = (XMLHttpRequest, payload) => {},
		onProgress = (XMLHttpRequest, payload) => {},
		...rest

	}) {


		var args = {
			path: path,
			op: "download",
			...rest,
			uid:ApiInstance.instance.userid
		}

		var fd = new FormData()
		args = encodePathsInArg(args);
		fd.append("args", JSON.stringify(args,null,2))
		fd.append("op", args.op)

		this.xhr = new XMLHttpRequest();
		this.xhr.open('POST', ApiInstance.instance.urlService+"fs?op=download&save=true" /*+ `?args=${btoa(JSON.stringify(args))}`*/, true);
		this.xhr.withCredentials = true;
		this.xhr.responseType = 'blob';


		this.xhr.onprogress = (event) => {
			onProgress(event)
		};

		this.xhr.onerror = (event) => {
			onError(event)
		}
		this.xhr.onload = event => {
			onLoad(this.xhr)
		};

		this.xhr.send((fd));

		/*ApiInstance.instance.callOperation("status", {
				path: path,
				catchCB:catchCB,
				thenCB: (payload) => {
					preStart(payload);

					var args = {
						path: path,
						op: "download",
						...rest
					}
					
					var fd = new FormData()
					fd.append("args", JSON.stringify(args))

					var xhr = new XMLHttpRequest();
					xhr.open('POST', ApiInstance.instance.urlService, true);
					xhr.responseType = 'blob';
					xhr.send((fd));

					xhr.onprogress = (event) => {
						onProgress(event,payload)
					};
					
					xhr.onerror = (event) => {
						onError(event, payload)
					}
					xhr.onload = event => {
						onLoad(xhr, payload)
					};

					xhr.send((fd));
				}

			});*/
	}

	cancelDownload(){
		console.warn("cancelando operacion de descarga ",this);
		this.xhr.abort();
	}


}


export default DownloadOperation;