const EMPTY_DATA = _ => ({
	"owner": {},
	"sharedAt": -1,
	"mode": "P",
	"shareWith": {
		"users": []
	},
	"path": ""
})
import {Map} from "immutable"
export {EMPTY_DATA}
export default {

	create_edit: {
		status: "ok", //ok,saving,error,loading
		type: "create", //create,edit
		open: false,
		owner: null,
		path: null,
		msg: null,

		//modificaciones, al momento de guardar solo
		//se guardaran los datos modificados
		//si solo cambio el modo, solo guardara el modo
		//si solo edito a los usuarios con quien compartira
		//solo guardara los usuarios
		//si modifico ambos, se guardan ambos
		mode:false,
		users:false,

		/**data share*/
		data: EMPTY_DATA()
	},
	copy: {
		status: "ok", //ok,copyng,error,loading
		type: "create", //create,edit
		currentPath: "/",
		pathSelectedToMoveOrCopy: "/",
		open: false,
		owner: null,
		spath: null,
		subpath: null,
		dstpath: null,
		msg: null,

		paths: Map(),

		progress:0,
	}

}