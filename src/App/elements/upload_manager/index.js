//index.js
//@ts-check
import { store } from "../../redux/index.js";
import { addUpload,endUpload,updateUpload } from "./action.js";
import { ItemUpload } from "./ItemUpload.js";
import { Upload } from "./Upload.js";

class UploadManager {
	uploads: { [x: string]: Upload } = {};

	constructor(){
		console.warn("UploadManager",this)
	}

	getUploadsCount():number{return Object.keys(this.uploads).length}

	/**Total de archivos a subir*/
	getElementsUploadsCount():number{
		return Object.keys(this.uploads)
		.map((key:string)=>this.uploads[key])
		.map((item:Upload)=>item.getFiles().length)
		.reduce((acumulator:number,current:number)=>{return acumulator+current},0)
	}
	/**total de archivos subidos */
	getElementsUploadedCount():number{
		return Object.keys(this.uploads)
		.map((key:string)=>this.uploads[key])
		.map((item:Upload)=>item.getUploaded().length)
		.reduce((acumulator:number,current:number)=>{return acumulator+current},0)
	}

	getUploads(): { [x: string]: Upload } {
		return this.uploads;
	}
	getUpload(id:string):Upload{
		if(this.getUploads().hasOwnProperty(id)){
			return this.getUploads()[id];
		}else{
			return null;
		}
	}

	/**Agregar subida de archivos*/
	addUpload(item: ItemUpload = null) {
		if (item == null) {
			throw "Item no puede ser null";
		}
		let upload = new Upload(item);
		store.dispatch(addUpload(upload));

		this.uploads[upload.id] = upload;
		upload.processUpload();
	}
	
	updateUpload(item: Upload = null){
		store.dispatch(updateUpload(item));
	}

	endUpload(item: Upload = null){
		delete this.uploads[item.getId()];
		store.dispatch(endUpload(item));		
	}
}


const UploadManagerInstance = {
	instance: (new UploadManager())
}

export { UploadManagerInstance };
