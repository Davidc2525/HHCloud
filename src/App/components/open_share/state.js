import {
	fromJS,
	Map,
	List
} from "immutable"

const state = {
	namecomponent: "open_share",

	toolBar: {
		sortBy:"name",
		order:true, //true = asc, false = desc
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
