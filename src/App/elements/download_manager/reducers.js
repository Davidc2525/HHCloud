import {
	Map,
	fromJS
} from "immutable"


export default (state = new Map(), action) => {
	//console.warn(state)
	switch (action.type) {


		case "ADD_DOWNLOAD":
			var downloads = state.get("downloads")
			downloads = downloads.set(action.dlId,fromJS(action.dl.toObject()))
			var newState = state.set("downloads", downloads)


			return newState


		case "REMOVE_DOWNLOAD":
			var downloads = state.get("downloads")
			//var index = downloads.indexOf(action.dlId)
			downloads = downloads.delete(action.dlId)

			var newState = state.set("downloads", downloads)


			return newState

		case "PROGRESS_DOWNLOAD":
			var downloads = state.get("downloads")
			//var index = downloads.indexOf(action.dlId)
			//downloads = downloads.set(action.dlId)
			var item =state.getIn(["downloads",action.dlId]);
			if (item != null) {
				var newState = state.setIn(["downloads", action.dlId], fromJS(action.dl.toObject()))
			}else{
				return state
			}

			return newState

		case "ERROR_DOWNLOAD":
			var downloads = state.get("downloads")
			//var index = downloads.indexOf(action.dlId)
			//downloads = downloads.set(action.dlId)

			var newState = state.setIn(["downloads",action.dlId],fromJS(action.dl.toObject()  ))


			return newState

		default:
			return state
	}
}