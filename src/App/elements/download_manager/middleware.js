
import {markDownload} from "../../components/explorer/actions.js"

export default store => next => action => {

	if(action.middle == "DOWNLOAD_MANAGER"){
		/*if(action.type=="ERROR_DOWNLOAD"){
			next(action)
		}*/

		if(action.type=="ADD_DOWNLOAD"){
			console.log("csm")
			if(!action.dl.multiple){
				store.dispatch(markDownload(action.path,"downloading"))
			}
			next(action)
			return
		}
		
		if(action.type=="REMOVE_DOWNLOAD"){
			if(!action.dl.multiple){
				store.dispatch(markDownload(action.path,"none"))
			}
			next(action)
			return
		}

		if(action.type=="END_DOWNLOAD"){
			if(!action.dl.multiple){
				store.dispatch(markDownload(action.path,"downloaded"))
			}
			setTimeout(()=>{
				store.dispatch(markDownload(action.path,"none"))
				
				next(action)
			},5000)
			return
		}

		if(action.type=="ERROR_DOWNLOAD"){
			if(!action.dl.multiple){
				store.dispatch(markDownload(action.path,"downloaderror"))
			}
			setTimeout(()=>{
				store.dispatch(markDownload(action.path,"none"))
				store.dispatch({
					type: "REMOVE_DOWNLOAD",
					middle: "DOWNLOAD_MANAGER",
					//dlId: dl.id,
					path: action.path,
					dl: action.dl
				})
			},5000)
			next(action)
			return
		}

		next(action)
	}else{
		next(action)
	}

}