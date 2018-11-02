
import {markDownload} from "../../components/explorer/actions.js"
import {ACTIONS as APP_ACTIONS} from "../../actions.js"

export default store => next => action => {

	if(action.middle == "DOWNLOAD_MANAGER"){
		/*if(action.type=="ERROR_DOWNLOAD"){
			next(action)
		}*/

		if(action.type=="ADD_DOWNLOAD"){
			console.log("csm")
			if(!action.dl.multiple){
				store.dispatch(markDownload(action.path,"downloading"));
				store.dispatch(APP_ACTIONS.OPEN_LITTLE_MSG.FUN(`Descarga en proceso '${action.path}'`));
			}else{
				store.dispatch(APP_ACTIONS.OPEN_LITTLE_MSG.FUN(`Descarga multiple en proceso.`));
			}
				
			next(action)
			return
		}
		
		if(action.type=="REMOVE_DOWNLOAD"){
			if(!action.dl.multiple){
				store.dispatch(markDownload(action.path,"none"))
			}
			store.dispatch(APP_ACTIONS.OPEN_LITTLE_MSG.FUN(`Descarga removida '${action.path}'`));
			next(action)
			return
		}

		if(action.type=="END_DOWNLOAD"){
			if(!action.dl.multiple){
				store.dispatch(markDownload(action.path,"downloaded"))
			}
			store.dispatch(APP_ACTIONS.OPEN_LITTLE_MSG.FUN(`Descarga finalizada '${action.path}'`));
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
			store.dispatch(APP_ACTIONS.OPEN_LITTLE_MSG.FUN(`Error al descargar '${action.path}'`));
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