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


class Auth {

	constructor(props) {
		window.Auth = this
		console.warn(store);

		this.signIn().then(x => {
			if ((x.login)) {
				store.dispatch({
					type: "AUTH_SET_STATE",
					payload: {
						state: STATES[1]
					}
				});
			}else{
				store.dispatch({
					type: "AUTH_SET_STATE",
					payload: {
						state: STATES[2]
					}
				});
			}
		}).catch(x => {
			store.dispatch({
				type: "AUTH_SET_STATE",
				payload: {
					state: STATES[2]
				}
			});
		})

	}

	setStateLogin(){
		this.setState(STATES[1]);
	}

	setStateNoLogin(){
		this.setState(STATES[2]);
		store.dispatch({type:"CLEAR_STATE"});
	}

	setState(newState){
		store.dispatch({
			type: "AUTH_SET_STATE",
			payload: {
				state: newState
			}
		});
	}

	onLogin(x) {
		ApiInstance.instance.callOperation("accountstatus", {
			user: new User({
				id: x.userid
			}),
			thenCB: accountstatus => {
				store.dispatch({
					type: "AUTH_SETUSERDATA",
					payload: {
						userdata: { ...accountstatus.toObject(),
							displayName: `${accountstatus.user.getLastName()} ${accountstatus.user.getFirstName()}`
						}
					}
				})
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
				thenCB: accountstatus => {
					this.onLogin(accountstatus);	
					resolve(accountstatus);
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
