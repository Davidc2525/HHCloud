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

		default:
			return state
	}
}