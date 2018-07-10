const MIDDLEWARE = "EXPLORER"
const FETCHING_PATH = "FETCHING_PATH";
const DOWNLOAD_STATE = "DOWNLOAD_STATE";
const FETCHTED_PATH = "FETCHTED_PATH";



const fetchingData = (path) => {
	return ({
		type: FETCHING_PATH,
		middle: MIDDLEWARE,
		path: path

	})
}

export {
	fetchingData,
	MIDDLEWARE,
	FETCHING_PATH,
	DOWNLOAD_STATE,
	FETCHTED_PATH
}