import {
	fromJS
} from "immutable"

const state = {
	namecomponent: "explorer",
	renameDialog: {
		status:"ready", //ready,changing, error
		cantEdit:false,
		open: false,
		name: "",
	},
	moveDialog:{
		open:false,
		path:""
	},
	copyDialog:{
		open:false,
		path:""
	},

	paths: {}

}
export default fromJS(state)