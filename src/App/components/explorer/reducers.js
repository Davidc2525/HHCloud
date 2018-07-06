import {
	Map,fromJS
} from "immutable"

export default (state = new Map(), action) => {

	switch (action.type) {
		case "FETCHTED_PATH":
			var newState = state.setIn(["paths", action.path], fromJS({
				status: "empty",
				path: action.path,
				data: {}
			}))

			return newState
			
		default:
			return state
	}
}