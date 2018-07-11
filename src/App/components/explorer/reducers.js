import {
	Map,
	fromJS
} from "immutable"
import {
	FETCHTED_PATH,
	DOWNLOAD_STATE
} from "./actions.js"

export default (state = new Map(), action) => {

	switch (action.type) {
		case "FETCHING_PATH":
			
			var newState = state.setIn(["paths", action.path], fromJS({
				status: "loading",
				path:action.path
				
			}))

			return newState

		case FETCHTED_PATH:
			delete action.payload.data.args
			var newState = state.setIn(["paths", action.path], fromJS({
				status: action.status,
				...action.payload.data
			}))

			return newState

		case "DELETED_PATH":
			var newState = state.deleteIn(["paths", action.path])
			return newState


		/**eliminar*/
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