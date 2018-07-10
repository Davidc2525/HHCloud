import {
	Map,
	fromJS
} from "immutable"


export default (state = new Map(), action) => {
	console.warn(state)
	switch (action.type) {


		case "ADD_DOWNLOAD":
			var downloads = state.get("downloads")
			downloads = downloads.push(action.dl)
			var newState = state.set("downloads", downloads)


			return newState


		case "REMOVE_DOWNLOAD":
			var downloads = state.get("downloads")
			var index = downloads.indexOf(action.dl)
			downloads = downloads.delete(index)

			var newState = state.set("downloads", downloads)


			return newState

		default:
			return state
	}
}