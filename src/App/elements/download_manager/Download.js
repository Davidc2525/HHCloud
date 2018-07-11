import download from "downloadjs"
import filesize from "filesize"
import uniqid from "uniqid"
import _ from "lodash"
import {DownloadManagerInstance as dlm} from "./index.js"

const get = (p, op) => {

	var args = {
		path: p,
		op: op
	}
	var fd = new FormData()
	fd.append("args", JSON.stringify(args))
	var options = {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: urlencodeFormData(fd)
	}
	return fetch(`http://orchi:8080/api/`, options).then(x => (console.log(x),
		x.json())).then(x => x)

}
const ls = (p) => {
	get(p, "list").then(x => {
		//console.warn(x)
		if (x.file) {
			console.log(x.data.name)
			console.log(filesize(x.data.size))
		} else {
			x.data.forEach(i => {
				console.log(i.name + " " + filesize(i.size))
			})
		}
	})
}

const dl = (p,downloadBind)=>{
    get(p, "getstatus").then(x=>{
    	downloadBind.bind(x)
        var url = `http://orchi:8080/api/`
        var args = {
            path: p,
            op: "download"
        }
        var fd = new FormData()
        fd.append("args", JSON.stringify(args))
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.responseType = 'blob';
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
        xhr.onprogress = function(pe) {
        	downloadBind.debounceProgress(pe,x)
            //console.log('progress '+filesize(pe.loaded));
            if (pe.lengthComputable) {
                console.log((pe.loaded / pe.total) * 100);
            }
        }
        ;
        xhr.onerror = (event)=>{downloadBind.onErrorDownload(event,x)}
        xhr.onload = function(e) {
            if (this.status == 200) {
                var blob = this.response;
                console.log(x, this)
                downloadBind.onEndDonwload(e,x)
                if (x.file) {
                    //download(blob, x.data.name, x.mime)
                } else {
                    //download(blob, ""+x.data.name + ".zip","application/zip")
                }

            }
        }
        ;

        xhr.send(urlencodeFormData(fd));
    }
    );

}

function urlencodeFormData(fd) {
	var s = '';

	function encode(s) {
		return encodeURI(s);
	}
	for (var pair of fd.entries()) {
		if (typeof pair[1] == 'string') {
			s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1]);
		}
	}
	return s;
}




class Download {


	constructor(path,downloadManager){
		this.id = uniqid();
		this.error = false;
		this.path = path;
		this.progress = 0;
		this.payload = {size:0,loaded:0}
		//this.downloadManager = downloadManager;
		dl(this.path,this)
	}
	debounceProgress = _.debounce((event, data) => {
		this.onprogress(event, data)
	}, 800, {
		'maxWait': 800
	})
	toObject(){
		return JSON.parse(JSON.stringify(this))
	}

	bind(payload){
		this.payload = payload.data
	}

	onEndDonwload(event,data){	
		console.warn("onEndDonwload",event,data)
		dlm.instance.endDownload(this,event)
	}

	onErrorDownload(event,data){
		//console.error(event)
		this.error=true;
		dlm.instance.onError(this,event)
	}

	onprogress(event,data){
		if(data.file){
			this.payload.loaded = event.loaded
			//console.warn("onprogress progress "+this.id,(event.loaded / data.data.size) * 100)
			this.progress = (event.loaded / data.data.size) * 100
		}else{			
			this.payload.loaded = event.loaded
			//console.warn("onprogress "+this.id,event,data)
			this.progress = (event.loaded / data.data.size) * 100
		}
		dlm.instance.onProgress(this,event)
	}	

	
}


export {Download}