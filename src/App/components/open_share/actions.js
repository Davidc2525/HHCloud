import { List } from "immutable";

const MIDDLEWARE = "OPENSHARE"
const FETCHING_PATH = "share@FETCHING_PATH";
const DOWNLOAD_STATE = "DOWNLOAD_STATE";
const FETCHTED_PATH = "share@FETCHTED_PATH";
const DELETEING_PATH = "DELETING_PATH";
const DELETED_PATH = "DELETED_PATH";
const CLEAR_STATE = "CLEAR_STATE";
const ACTIVE_UPLOAD = "ACTIVE_UPLOAD"

const clearState = ({
	type: CLEAR_STATE 
})

const openDialogMkDir = _ => ({ 
	type: "OPEN_MKDIR_DIALOG" 
})

const closeDialogMkDir = _ => ({
	type: "CLOSE_MKDIR_DIALOG"
})

const filterToolBar = (value: string) => ({
	 type: "FILTER_TOOLBAR", 
	 payload: { filter: value }
})

const selectedModeToolbar = (active:boolean) => ({
	type: 'SELECTED_MODE_TOOLBAR',
	payload:{
		selecteMode:active
	}
})

const fetchingPath = (payload) => {
	return ({
		type: FETCHING_PATH,
		middle: MIDDLEWARE,
		path: payload.path,
		payload

	})
}

const fetchtedPath = (path:string, payload,status="loading") => {
	return ({
		path: path,
		status:status,
		type: FETCHTED_PATH,
		middle: MIDDLEWARE,
		payload :{payload}
	})
}



/**/

const markDownload=(path:string,status="none"/*none,downloading,downloaded,error*/)=>{
	console.warn("markDownload",path,status)
	return ({
		type:"MARK_DOWNLOAD",
		middle: MIDDLEWARE,
		payload:{
			path:path,
			status:status
		}
	})
}

/***/
const deletingPath = (path:string, name) => {
	return ({
		type: DELETEING_PATH,
		middle: MIDDLEWARE,
		path: path,
		name: name,
	})
}

const deletingPaths = (list:List) => {
	return ({
		type: "DELETING_PATHS",
		middle: MIDDLEWARE,
		payload: {
			listPath: list
		}
	})
}

const deletedPath = (path,pathParent) => {
	return ({
		path: path,
		pathParent: pathParent,
		type: DELETED_PATH,
		middle: MIDDLEWARE,
	})
}

const activeUpload = active => ({type:ACTIVE_UPLOAD,payload:{active}})

export {
	filterToolBar,
	openDialogMkDir,
	closeDialogMkDir,
	selectedModeToolbar,
	activeUpload,
	markDownload,
	deletingPaths,
	deletedPath,
	fetchtedPath,
	deletingPath,
	fetchingPath,
	clearState,
	CLEAR_STATE,
	ACTIVE_UPLOAD,
	DELETEING_PATH,
	DELETED_PATH,
	MIDDLEWARE,
	FETCHING_PATH,
	DOWNLOAD_STATE,
	FETCHTED_PATH
}