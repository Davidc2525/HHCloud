import {store} from "../../redux/index.js"
import {Download} from "./Download.js"

class DownloadManager {

	constructor(){
		console.warn("DownloadManager",this)
	}


	addDownload(path){

		
		store.dispatch({type:"ADD_DOWNLOAD",path:path,dl:new Download(path,this.endDownload.bind(this))})
	}

	endDownload(dl){
		console.warn(dl)
		store.dispatch({type:"REMOVE_DOWNLOAD",path:dl.path,dl:dl})
	}


}


 const DownloadManagerInstance = {
 	instance : (new DownloadManager())
 }

 export {DownloadManagerInstance}