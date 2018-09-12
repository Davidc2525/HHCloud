const AUTH_SETUSERDATA = "AUTH_SETUSERDATA"
const AUTH_SET_STATE = "AUTH_SET_STATE"
const CLEAR_STATE = "CLEAR_STATE"
const AUTH_SETUSERDATA_STORAGE = "AUTH_SETUSERDATA_STORAGE"
import AccountStatus from "../API/v1/user/AccountStatus.js"

const setUserData = (accountstatus:AccountStatus) => ({
	type: AUTH_SETUSERDATA,
	payload: {
		userdata: accountstatus.toObject()
	}
})

const setState = state => ({
	type: AUTH_SET_STATE,
	payload: {
		state
	}
})

const clearState = _ => ({
	type: CLEAR_STATE
})

const setContentSummary = contentSummary => ({
	type:AUTH_SETUSERDATA_STORAGE,
	payload:{
		contentSummary
	}
})

export {
	CLEAR_STATE,
	AUTH_SET_STATE,
	AUTH_SETUSERDATA,
	AUTH_SETUSERDATA_STORAGE,
	setContentSummary,
	clearState,
	setState,
	setUserData
}