import {fromJS} from "immutable"
export default store => next => action => {


	if (action.middle == "EXPLORER") {
		if (action.type == "FETCHING_PATH") {
			setTimeout(()=>{
				store.dispatch({path:action.path,type:"FETCHTED_PATH",middle:"EXPLORER"})
			},2000)
			
		}

		
			
			next(action)
		

	}



}