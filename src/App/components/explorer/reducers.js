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










			/**rename dialog*/
		case "OPEN_RENAME_DIALOG":
			var newState = state.setIn(["renameDialog","open"], true)
				newState = newState.setIn(["renameDialog","cantEdit"], true)
				newState = newState.setIn(["renameDialog","status"], "ready")
				newState = newState.setIn(["renameDialog","name"], action.nameFile)
				newState = newState.setIn(["renameDialog","path"], action.path)

			return newState

		case "CLOSE_RENAME_DIALOG":
			var newState = state.setIn(["renameDialog","open"], false)
				newState = newState.setIn(["renameDialog","cantEdit"], false)
				newState = newState.setIn(["renameDialog","status"], "ready")
				newState = newState.setIn(["renameDialog","name"], "")
				newState = newState.setIn(["renameDialog","path"], "")
			return newState


		case "CANT_EDIT_RENAME_DIALOG":
			var newState = state.setIn(["renameDialog","cantEdit"], action.cantEdit)
			return newState

		case "STATUS_RENAME_DIALOG":
			var newState = state.setIn(["renameDialog","status"], action.status)
			return newState



		default:
			return state
	}
}