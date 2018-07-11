const MIDDLEWARE = "EXPLORER"
const FETCHING_PATH = "FETCHING_PATH";
const DOWNLOAD_STATE = "DOWNLOAD_STATE";
const FETCHTED_PATH = "FETCHTED_PATH";
const DELETEING_PATH = "DELETING_PATH";
const DELETED_PATH = "DELETED_PATH";



const fetchingPath = (path) => {
	return ({
		type: FETCHING_PATH,
		middle: MIDDLEWARE,
		path: path

	})
}

const fetchtedPath = (path, data,status="loading") => {
	return ({
		path: path,
		status:status,
		type: FETCHTED_PATH,
		middle: "EXPLORER",
		payload :{data}
	})
}


const deletingPath = (path, name) => {
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

export {
	deletedPath,
	fetchtedPath,
	deletingPath,
	fetchingPath,
	DELETEING_PATH,
	DELETED_PATH,
	MIDDLEWARE,
	FETCHING_PATH,
	DOWNLOAD_STATE,
	FETCHTED_PATH
}