//Upload.js
//@ts-check

import 'babel-polyfill';
import _ from "lodash"
import uniqid from "uniqid";
import { ItemUpload } from "./ItemUpload"
import { UploadManagerInstance } from "./index"
import ApiInstance from "../API/v1/Api.js"


const up2 = (path, f,onprogress=_=>{}) => {
	return new Promise((resolve, reject) => {

		var fd = new FormData();
		try {
			//path = encodeURIComponent(decodeURIComponent(path))
		} catch (e) {
			console.error(e)
		}
		fd.append("args", JSON.stringify({
			path,
			op: "put"
		}));
		fd.append("op", "put");
		fd.append("f", (f));

		const xhr = new XMLHttpRequest();
		xhr.upload.onprogress = _ => {onprogress(_,f)};
		xhr.withCredentials = true;
		xhr.responseType = 'json';
		xhr.open('POST', ApiInstance.instance.urlService + "uploader", true);
		xhr.setRequestHeader('X-PINGOTHER', 'pingpong');
		xhr.onload = event => {
			console.log(xhr.response)
			resolve(xhr.response)	
		}

		xhr.onerror =  event => {
			reject(xhr.response)	
		}
		
		xhr.send(fd);


	});
}


/** 
 * Upload, contiene informacion de una instancia de subida, 
 * id, archivos, cantidad subidos,
 * la rruta donde se comenzo a subir.
 */
class Upload {
	id: string;
	path: string;
	files: Array<File>;
	type: string;
	filesUploaded:Array<File>;
	currentFile: File;
	filesUploadeError:Array<File>;
	name: string;
	canceled: boolean;

	constructor(item: ItemUpload) {
		this.id = uniqid();
		this.path = item.getPath();
		this.files = item.getListItems();
		this.type = item.getType()
		this.filesUploaded = [];
		this.filesUploadeError = [];
		this.currentFile = null;
		this.canceled = false;


		if (this.files.length > 0) {
			let name: string;
			let file: File = this.files[0];

			if (this.getType() == "folder") {
				if (file.webkitRelativePath != null && file.webkitRelativePath != "") {
					name = file.webkitRelativePath.split("/")[0];
				} else {
					name = `Subir ${this.files.length} archivos`
				}
			} else {
				name = `Subir ${this.files.length} archivos`
			}

			this.name = name;

		}

	}

	async processUpload() {
		for (let x = 0; x < this.files.length; x++) {
			if(this.canceled){
				UploadManagerInstance.instance.endUpload(this);
				return;
			}
			let file = this.files[x];
			this.setCurrentFile(file);
			await up2(this.path, file,this.onProgressDebounce)
				//.then(response => response.json())
				.then(rJson => {
					if(rJson.status!="ok"){
						if(rJson.error == "quota_exceeded"){
							alert(rJson.msg)
							this.cancelUpload();
							return;
						}
						console.error(rJson.msg)
						this.incrementUploadedWithError(file)
					}else{
						this.incrementUploaded(file);
					}
				})
				.catch(x => {
					this.incrementUploadedWithError(file);
				})

		}
		UploadManagerInstance.instance.endUpload(this);
	}

	onProgressDebounce = _.debounce((event, f) => {
		this.onProgress(event, f)
	}, 300, {
		'maxWait': 300
	})

	onProgress(event, f) {
		if (event.lengthComputable) {
			//console.warn(f.name, (event.loaded / event.total) * 100)
			f.progress = (event.loaded / event.total) * 100;
			this.setCurrentFile(f)
			//UploadManagerInstance.instance.updateUpload(this);
		}

	}

	/**
	 * obtener id de la instancia de subida.
	 */
	getId(): string { return this.id; };
	/**
	 * Obtener nombre de la subida
	 */
	getName(): string { return this.name; }
	/**
	 * obtener rruta donde se subiran los archivos de esta instancia de subida.
	 */
	getPath(): string { return this.path; };
	/**
	 * obtener archivos a subir por esta instancia de subida
	 */
	getFiles(): Array<File> { return this.files; };
	/**
	 * obtener tipo de subida.
	 */
	getType(): string { return this.type; }
	/**
	 * obtener cantidad de archivos ya subidos.
	 */
	getUploaded(): Array<File> { return this.filesUploaded; }

	/**
	 * incrementar la cantidad de archivos subidos.
	 */
	incrementUploaded(file: File) {
		this.filesUploaded.push(file);
		UploadManagerInstance.instance.incrementFileUploaded(this,file);
		UploadManagerInstance.instance.updateUpload(this);
	}
	/**
	 * Obtener archivo actual subiendo
	 */
	getCurrentFile(): File { return this.currentFile; }

	/**
	 * setear archivo actual a subir
	 */
	setCurrentFile(file: File) {
		this.currentFile = file;
		UploadManagerInstance.instance.updateUpload(this);
	}

	/**
	 * Incrementar archivos con error al subir
	 */
	incrementUploadedWithError(file: File) {
		this.filesUploadeError.push(file);
		UploadManagerInstance.instance.updateUpload(this);
	}

	/**
	 * Obtener archivos con error al subir 
	 */
	getUploadedFilesWithError(): Array<File> {
		return this.filesUploadeError;
	}
	/**
	 * Cancelar operacion de subida
	 */
	cancelUpload(){
		this.canceled = true;
	}

	/**
	 * crea una representacion JSON del objeto
	 */
	toObject(): Object {
		return JSON.parse(JSON.stringify(this))
	}
}

export { Upload }