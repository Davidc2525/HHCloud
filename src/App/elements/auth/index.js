/*import firebaseApp from "firebase/app"
import firebaseAuth from "firebase/auth"
import firebase from "firebase"
window.fb = firebase
window.fbau = firebaseAuth
*/
import ApiInstance from "../API/v1/Api.js"
import {STATES} from "./state.js"
import {
	store
} from "../../redux/index.js"
import { AuthObject } from "./AuthObject";
import {
	clearState,
	setState,
	setUserData
} from "./actions.js"

class Auth {

	constructor(props) {
		window.Auth = this
		console.warn(store);

		this.signIn().then(x => {
			if ((x.login)) {
				store.dispatch(setState(STATES[1]));
			}else{
				store.dispatch(setState(STATES[2]));
			}
		}).catch(x => {
			store.dispatch(setState(STATES[2]));
		})

	}

	setStateLogin(){
		this.setState(STATES[1]);
	}

	setStateNoLogin(){
		this.setState(STATES[2]);
		store.dispatch(clearState());
	}

	setState(newState){
		store.dispatch(setState(newState));
	}

	onLogin(x) {
		ApiInstance.instance.callOperation("accountstatus", {
			user: new User({
				id: x.userid
			}),
			thenCB: accountstatus => {
				store.dispatch(setUserData(accountstatus))
			},
			catchCB: x => console.warn(x)
		})
	}


	signOut() {
		return new Promise((resolve, reject) => {
			ApiInstance.instance.callOperation("logout", {
				thenCB: x => {
					this.setStateNoLogin()
					resolve(x);
				},
				catchCB: x => {
					this.setStateNoLogin()
					reject(x)
				}
			})
		})
	}

	signIn(username, password, remember) {
		return new Promise( (resolve,reject) => {
			ApiInstance.instance.callOperation("login", {
				email:username,
				password,
				remember,
				thenCB: authobject => {
					this.onLogin(authobject);	
					resolve(authobject);
				},
				catchCB: x => reject(x)
			})
		} );
	}
}

const auth = {


	"Auth": (new Auth())


};

export default auth
export {
	auth
}
