//@ts-check
import { Map,fromJS } from "immutable";
import {ADD_UPLOAD,END_UPLOAD,UPDATE_UPLOAD} from "./action"

export default (state : Map = Map(), action) => {

	switch (action.type) {

		case UPDATE_UPLOAD:
		case ADD_UPLOAD:
			var newState : Map  = state;
			var uploads = newState.get("uploads");
			uploads = uploads.set(action.upId,fromJS(action.up.toObject()))
			newState = newState.set("uploads",uploads);
			return newState;

		case END_UPLOAD:
			var newState : Map  = state;
			var uploads = newState.get("uploads");
			uploads = uploads.delete(action.upId)
			newState = newState.set("uploads",uploads);
			return newState;
		
			

		default:
		return state;
	}
	
}