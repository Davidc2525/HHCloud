import {
	fromJS
} from "immutable"

const state = {
	namecomponent: "explorer",
	renameDialog: {
		status:"ready", //ready,changing, error
		errorMsg:"",
		cantEdit:false,
		open: false,
		name: "",
	},
	moveOrCopyDialog:{
		op:"copy",//move or copy
		open:false,
		path:"",
		name:"",
		stauts:"ok",
		errorMsg:""
	},
	copyDialog:{
		open:false,
		path:""
	},

	paths: {}

}
export default fromJS(state)