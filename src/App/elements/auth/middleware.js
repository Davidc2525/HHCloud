

export default store => next => action => {

	if(action.middle == "AUTH_MANAGER"){
		/*if(action.type=="ERROR_DOWNLOAD"){
			next(action)
		}*/

		
		
	}else{
		next(action)
	}

}