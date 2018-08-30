import {
	Map,
	fromJS
} from "immutable"


export default (state = new Map(), action) => {
	//console.warn(state)
	switch (action.type) {
		case "AUTH_SET_STATE":
			return state.set("state", action.payload.state)
		case "AUTH_SETLOGIN":
			return state.set("isLogin", action.payload.isLogin)
		case "AUTH_SETUSERDATA":
			return state.set("dataUser", fromJS(action.payload.userdata))
		case "AUTH_SETUSERDATA_STORAGE":
					return state.setIn(["dataUser","contentSummary"], fromJS(action.payload.contentSummary))
		case "AUTH_SETUSERDATA_USER":
				return state.setIn(["dataUser","user"], fromJS(action.payload.user))

		default:
			return state
	}
}