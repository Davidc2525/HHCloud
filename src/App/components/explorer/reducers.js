import {
	Map,fromJS
} from "immutable"
import {FETCHTED_PATH,DOWNLOAD_STATE} from "./actions.js"

export default (state = new Map(), action) => {

	switch (action.type) {
		case FETCHTED_PATH:
			var newState = state.setIn(["paths", action.path], fromJS({
				status: "empty",
				...action.data
			}))

			return newState

		case "DOWNLOAD_STATE":
			var newState = state.setIn(["paths", action.path], fromJS({
				status: "empty",
				...action.data
			}))

			return newState
			
		default:
			return state
	}
}