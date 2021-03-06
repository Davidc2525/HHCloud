import {
	Map,
	fromJS
} from "immutable"


export default (state = new Map(), action) => {
	//console.warn(state)
	switch (action.type) {


		case "ADD_DOWNLOAD":
			var downloads = state.get("downloads");
			downloads = downloads.set(action.dl.id,fromJS(action.dl.toObject()));
			var newState = state.set("downloads", downloads);


			return newState


		case "END_DOWNLOAD":
		case "REMOVE_DOWNLOAD":
			var downloads = state.get("downloads")
			//var index = downloads.indexOf(action.dl.id)
			downloads = downloads.delete(action.dl.id)

			var newState = state.set("downloads", downloads)

			return newState

		case "PROGRESS_DOWNLOAD":
			var downloads = state.get("downloads")
			//var index = downloads.indexOf(action.dl.id)
			//downloads = downloads.set(action.dl.id)
			var item = state.getIn(["downloads",action.dl.id]);
			if (item != null) {
				var newState = state.setIn(["downloads", action.dl.id], fromJS(action.dl.toObject()))
			}else{
				return state
			}

			return newState

		case "ERROR_DOWNLOAD":
			var downloads = state.get("downloads")
			//var index = downloads.indexOf(action.dl.id)
			//downloads = downloads.set(action.dl.id)

			var newState = state.setIn(["downloads",action.dl.id],fromJS(action.dl.toObject()  ))


			return state

		default:
			return state
	}
}
