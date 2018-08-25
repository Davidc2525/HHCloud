//index.js
import {store} from "../../redux/index.js"
import {Map,List} from "immutable";


class UploadManager {

}


const UploadManagerInstance = {
	instance: (new UploadManager())
}

export {
	UploadManagerInstance
}