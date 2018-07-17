import {
	fromJS,
	Map,
	List
} from "immutable"

const state = {
	namecomponent: "explorer",
	renameDialog: {
		status: "ready", //ready,changing, error
		errorMsg: "",
		cantEdit: false,
		open: false,
		name: "",
	},
	moveOrCopyDialog: {
		op: "copy", //move or copy
		open: false,
		path: "",
		name: "",
		stauts: "ok",
		errorMsg: "",

		paths: new Map(),
		fetchingPath: false,
		currentPath: "/",
		pathSelectedToMoveOrCopy: ""
	},
	toolBar: {
		filter: "",
	},	
	selection: {
		isSelecteMode: false,
		selecteds:new Map(),

	},
	currentType:"folder",//folder, file
	paths: {}

}
export default fromJS(state)