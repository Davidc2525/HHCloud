import {apiUserInstance} from "./index";

class SearchUserOperation {
	constructor({ query="", thenCB = user => { }, catchCB = x => { } } = {}) {
		apiUserInstance
			.instance
			.searchUser(query)
			.then(response => {
				thenCB(response);
			})
			.catch(x => {
				catchCB(x);
			});
	}
}

export  {SearchUserOperation};