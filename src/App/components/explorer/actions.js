const MIDDLEWARE = "EXPLORER"
const FETCHING_PATH = "FETCHING_PATH";
const DOWNLOAD_STATE = "DOWNLOAD_STATE";
const FETCHTED_PATH = "FETCHTED_PATH";
const DELETEING_PATH = "DELETING_PATH";
const DELETED_PATH = "DELETED_PATH";
const ACTIVE_UPLOAD = "ACTIVE_UPLOAD"



const fetchingPath = (path:string,withContent=false) => {
	return ({
		type: FETCHING_PATH,
		middle: MIDDLEWARE,
		path: path,
		payload:{withContent}

	})
}

const fetchtedPath = (path:string, payload,status="loading") => {
	return ({
		path: path,
		status:status,
		type: FETCHTED_PATH,
		middle: "EXPLORER",
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
		name: name


	})
}

const deletedPath = (path,pathParent) => {
	return ({
		path: path,
		pathParent: pathParent,
		type: DELETED_PATH,
		middle: "EXPLORER",

	})
}

const activeUpload = active => ({type:ACTIVE_UPLOAD,payload:{active}})

export {
	activeUpload,
	markDownload,
	deletedPath,
	fetchtedPath,
	deletingPath,
	fetchingPath,
	ACTIVE_UPLOAD,
	DELETEING_PATH,
	DELETED_PATH,
	MIDDLEWARE,
	FETCHING_PATH,
	DOWNLOAD_STATE,
	FETCHTED_PATH
}