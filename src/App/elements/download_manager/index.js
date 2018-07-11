import {store} from "../../redux/index.js"
import {Download} from "./Download.js"

class DownloadManager {
	downloads = {}
	constructor(){
		console.warn("DownloadManager",this)
	}


	addDownload(path){		
		var download = new Download(path,this);

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
			type: "REMOVE_DOWNLOAD",
			middle:"DOWNLOAD_MANAGER",
			dlId: dl.id,
			path: dl.path,
			//dl: dl
		})
	}

	onError(dl,event){
		console.warn(dl)
		
		store.dispatch({
			type: "ERROR_DOWNLOAD",
			middle:"DOWNLOAD_MANAGER",
			dlId: dl.id,
			path: dl.path,
			dl: dl
		})
	}

	onProgress(dl,event){
		store.dispatch({
			type: "PROGRESS_DOWNLOAD",
			middle:"DOWNLOAD_MANAGER",
			dlId: dl.id,
			path: dl.path,
			dl: dl
		})
	}

}


 const DownloadManagerInstance = {
 	instance : (new DownloadManager())
 }

 export {DownloadManagerInstance}