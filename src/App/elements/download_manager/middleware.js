
import {markDownload} from "../../components/explorer/actions.js"

export default store => next => action => {

	if(action.middle == "DOWNLOAD_MANAGER"){
		/*if(action.type=="ERROR_DOWNLOAD"){
			next(action)
		}*/

		if(action.type=="ADD_DOWNLOAD"){
			console.log("csm")
			store.dispatch(markDownload(action.path,"downloading"))
			next(action)
			return
		}
		if(action.type=="REMOVE_DOWNLOAD"){
			store.dispatch(markDownload(action.path,"downloaded"))
			setTimeout(()=>{
				store.dispatch(markDownload(action.path,"none"))
			},5000)
			next(action)
			return
		}
		next(action)
	}else{
		next(action)
	}

}