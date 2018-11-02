import {
	Map
} from "immutable";
import {
	MIDDLE,
	ACTIONS
} from "./actions.js";


export default (state = new Map(), action) => {
	if (action.type == ACTIONS.APP_CONNECTION.NAME) {
		var newState = state;
		newState = state.setIn(["online"], action.payload.online);

		return newState;
	}

	if (action.type == ACTIONS.APP_SET_TITLE.NAME) {
		var newState = state;
		newState = state.setIn(["title"], action.payload.title);

		return newState;
	}

	if (action.type == ACTIONS.OPEN_LITTLE_MSG.NAME) {

		var newState = state;
		var open = newState.getIn(["littleMsg", "open"]);
		var msgStack = newState.getIn(["littleMsg", "msgs"]);
		if (open) {
			msgStack = msgStack.push({
				msg: action.payload.msg,
				key: new Date().getTime()
			})
			newState = newState.setIn(["littleMsg", "msgs"], msgStack)
		} else {
			newState = newState.setIn(["littleMsg", "open"], true);
			newState = newState.setIn(["littleMsg", "msg"], action.payload.msg);
		}

		return newState;

	}

	/**private*/
	if (action.type == ACTIONS.SHIFT_LITTLE_MSG.NAME) {
		var newState = state;
		var msgStack = newState.getIn(["littleMsg", "msgs"]);
		if (msgStack.size > 0) {
			msgStack = msgStack.shift();
			newState = newState.setIn(["littleMsg", "msgs"], msgStack)

			return newState;
		}
	}

	if (action.type == ACTIONS.CLOSE_LITTLE_MSG.NAME) {

		var newState = state;
		var msgStack = newState.getIn(["littleMsg", "msgs"]);
		newState = newState.setIn(["littleMsg", "open"], false);
		newState = newState.setIn(["littleMsg", "msg"], "");
		return newState;
	}

	return state;
}