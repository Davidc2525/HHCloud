//middleware.js
// @ts-check
import { UPLOAD_MANAGER, ADD_UPLOAD, END_UPLOAD ,endUpload} from "./action";
import { Map } from "immutable";
import { fetchingPath } from "../../components/explorer/actions";


export default store => next => action => {

    if (action.middle == UPLOAD_MANAGER) {
        if (action.type == ADD_UPLOAD) {
            next(action);
            return;
        }
       
        if (action.type == END_UPLOAD) {
            store.dispatch(fetchingPath(action.up.getPath()))
            setTimeout(_=>{                
                next(action);                
            },1000)
            return;
        }
        next(action);
    }else{
        next(action);
    }

}