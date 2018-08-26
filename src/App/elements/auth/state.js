const STATES = {
	0: "NONE",
	1: "LOGIN",
	2: "NOLOGIN",
}
export default {
	state: STATES[0],
	stateLogin:"",
	isLogin: false,
	dataUser: {
		//user,
		//contentSummary
	}
}

export {STATES}