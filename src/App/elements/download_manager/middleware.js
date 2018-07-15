


export default store => next => action => {

	if(action.middle&&action.middle == "DOWNLOAD_MANAGER"){
		if(action.type=="ERROR_DOWNLOAD"){
			next(action)
		}
	}else{
		next(action)
	}

}