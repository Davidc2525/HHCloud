//middleware.js
// @ts-check
import {INCREMENT_FILE_UPLOADED, UPLOAD_MANAGER, ADD_UPLOAD, END_UPLOAD, UPDATE_UPLOAD ,endUpload} from "./action";
import { Map } from "immutable";
import { fetchingPath } from "../../components/explorer/actions";
import ApiInstance from "../API/v1/Api.js"
import {setContentSummary,setUserData} from "../auth/actions.js"

export default store => next => action => {

    if (action.middle == UPLOAD_MANAGER) {
        if (action.type == ADD_UPLOAD) {
            next(action);
            return;
        }
       
        if (action.type == END_UPLOAD) {
            store.dispatch(fetchingPath(action.up.getPath()))
            
            setTimeout(_=>{
				ApiInstance.instance.callOperation("accountstatus",{thenCB:as=>store.dispatch(setUserData(as))})
			},2000)
            
            setTimeout(_=>{                
                next(action);                
            },1000)
            return;
        }

        if(action.type == INCREMENT_FILE_UPLOADED){

        	let up:Upload = action.up;
        	let file:File = action.file
        	let size:number = 0;
        	let cs = store.getState().getIn(["auth","dataUser","contentSummary"],null);
        	size = file.size;
        	
        	if(cs!=null){
        		cs = cs.set("length",cs.get("length")+size)
        		cs = cs.set("fileCount",cs.get("fileCount")+1)
        	}

        	store.dispatch(setContentSummary(cs))
        	next(action);
        	return;
        }
        next(action);
    }else{
        next(action);
    }

}