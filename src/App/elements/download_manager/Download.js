import download from "downloadjs"
import filesize from "filesize"

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

const dl = (p,callback)=>{
    get(p, "getstatus").then(x=>{
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
            console.log('progress '+filesize(pe.loaded));
            if (pe.lengthComputable) {
                console.log((pe.loaded / pe.total) * 100);
            }
        }
        ;

        xhr.onload = function(e) {
            if (this.status == 200) {
                var blob = this.response;
                console.log(x, this)
                callback(x)
                if (x.file) {
                    download(blob, x.data.name, x.mime)
                } else {
                    download(blob, ""+x.data.name + ".zip","application/zip")
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


	constructor(path,endDownload){
		this.path = path;
		dl(this.path,this.endDownload.bind(this,endDownload))
	}
	endDownload(edl){
		//alert("termino")
		edl(this)
	}

	
}


export {Download}