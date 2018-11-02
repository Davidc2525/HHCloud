import {
	store
} from "../../redux/index.js";
import {
	ACTIONS
} from "./actions.js";


const mapActions = (acs, ro) => {
	var obj = ro || {}
	Object.keys(acs).forEach(x => {

		return obj[x] = acs[x].FUN
	})
	return obj;
}

export {mapActions}