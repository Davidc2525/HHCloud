import ApiInstance from "../Api.js"

class DownloadOperation {
	constructor({
		path = "/",
		thenCB = _ => {},
		catchCB = _ => {},
		/*funciones de eventos de XMLHttpRequest*/
		preStart = payload => {},
		onLoad = (XMLHttpRequest,payload) => {},
		onError = (XMLHttpRequest,payload) => {},
		onProgress = (XMLHttpRequest,payload) => {},

	}) {
		

		ApiInstance.instance.callOperation("status", {
				path: path,
				thenCB: (payload) => {
					preStart(payload);

					var args = {
						path: path,
						op: "download"
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

			})
	}

}


export default DownloadOperation;