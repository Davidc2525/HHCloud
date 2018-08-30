//Upload.js
//@ts-check
import 'babel-polyfill';
import uniqid from "uniqid";
import { ItemUpload } from "./ItemUpload"
import { UploadManagerInstance } from "./index"
var up = (path, f) => {
	var fd = new FormData()
	fd.append("args", JSON.stringify({ path, op: "put" }))
	fd.append("op", "put")
	fd.append("f", (f))
	var options = {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		headers: {

			'Accept': 'application/json',
			//'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: (fd)
	}

	return fetch("http://orchi:8080/api/uploader", options)

}
class Upload {
	constructor(item: ItemUpload) {
		this.id = uniqid();
		this.path = item.getPath();
		this.files = item.getListItems();
		this.type = item.getType()
		this.filesUploades = 0;

	}

	async processUpload() {
		for (let x = 0; x < this.files.length; x++) {
			await up(this.path, this.files[x])
			this.incrementUploades();
		}
		UploadManagerInstance.instance.endUpload(this);

	}

	getId(): string { return this.id; };
	getPath(): string { return this.path; };
	getFiles(): Array<File> { return this.files; };
	getType(): string { return this.type; }
	getUploades(): number { return this.filesUploades; }
	incrementUploades() {
		this.filesUploades++;
		UploadManagerInstance.instance.updateUpload(this);
	}

	toObject(): Object {
		return JSON.parse(JSON.stringify(this))
	}
}

export { Upload }