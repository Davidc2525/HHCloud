import {store} from "../../redux/index.js"
import {Download} from "./Download.js"
import {Map,List} from "immutable";

class DownloadManager {
	downloads = {}
	constructor(){
		console.warn("DownloadManager",this)
	}


	cancelDownload(id){
		const download = this.downloads[id];
		if(download == null){
			throw "Esa descarga no existe";
		}
		download.cancelDownload();
		store.dispatch({
			type: "REMOVE_DOWNLOAD",
			middle:"DOWNLOAD_MANAGER",
			
			path: download.path,
			dl: download
		})
	}

	addDownload(item=null){
		var path = null;
		var multiple = false;
		if(item==null){
			throw new Error("error al descargar, null no es permitido como parametro");
		}
		if(Map.isMap(item)){
			path = item.get("path");
		}else if(List.isList(item)){
			multiple = true;
		}else if(typeof item == "string"){
			path = item;
		}

		var download = new Download(item,this);

		this.downloads[download.id]=download;
		store.dispatch({
			type: "ADD_DOWNLOAD",
			middle:"DOWNLOAD_MANAGER",
			dlId: download.id,
			path: path,
			dl: download
		})
	}

	endDownload(dl,event){
		console.warn(dl)
		delete this.downloads[dl.id]
		
		store.dispatch({
			type: "END_DOWNLOAD",
			middle:"DOWNLOAD_MANAGER",
			
			path: dl.path,
			dl: dl
		})
	}

	onError(dl,event){
		console.warn(dl)
		delete this.downloads[dl.id]
		store.dispatch({
			type: "ERROR_DOWNLOAD",
			middle:"DOWNLOAD_MANAGER",
			//dlId: dl.id,
			path: dl.path,
			dl: dl
		})
	}

	onProgress(dl,event){
		store.dispatch({
			type: "PROGRESS_DOWNLOAD",
			middle:"DOWNLOAD_MANAGER",
			//dlId: dl.id,
			path: dl.path,
			dl: dl
		})
	}

}


 const DownloadManagerInstance = {
 	instance : (new DownloadManager())
 }

 export {DownloadManagerInstance}