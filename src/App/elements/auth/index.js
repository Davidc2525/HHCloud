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


class Auth {

	constructor(props) {
		window.Auth = this
		console.warn(store);

		this.signIn().then(x => {
			if (x.login) {
				store.dispatch({
					type: "AUTH_SET_STATE",
					payload: {
						state: STATES[1]
					}
				});
				this.onLogin(x);
				
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
	}

	setState(newState){
		store.dispatch({
			type: "AUTH_SET_STATE",
			payload: {
				state: newState
			}
		});
	}

	signUp(user, pass) {

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
		return fetch(`${location.origin}/api/logout`, {
			credentials: "include"
		}).then(x => x.json()).then(x => console.warn(x))
	}

	signIn(username, password, remember) {
		return new Promise((resolve, reject) => {

				var arg = {op:"login",username,password,remember}
				//var fd = new FormData();

				//fd.append("args", JSON.stringify(arg, null, 2))
				var args = "?args="+JSON.stringify(arg, null, 2)
				var xhr = new XMLHttpRequest();

				xhr.open("get", ApiInstance.instance.urlService+`auth?op=login&args=${(JSON.stringify(arg))}` , true);
				//xhr.setRequestHeader('Content-type', 'application/json');
				xhr.withCredentials = true;
				xhr.responseType = 'json';


				xhr.onprogress = (event) => {

				};

				xhr.onerror = (event) => {
					console.warn(xhr)
					reject({
						status:"error",
						error: "connection_error",
						msg: "Error al tratar de conectar, revisa tu conexion."
					})
				}

				xhr.onload = event => {
					resolve(xhr.response)
				};

				xhr.send();

			})
			.then(x => new AuthObject(x)).then(x => {

				return new Promise((res, rej) => {
					if ((x.auth || x.exist)) {
						this.onLogin(x)
						res(x)
					} else {
						rej(x)
					}

				})

			});
	}
}


class AuthObject {

	constructor({
		sesid,
		userid,
		auth,
		exist,
		msg,
		username,
		password
	}) {
		this.login = false;
		this.userid = userid;
		this.sesid = sesid;
		this.auth = auth;
		this.exist = exist;
		this.msg = msg;
		this.username = username;
		this.password = password;
		if (this.auth || this.exist) {
			this.login = true;
		}
	}

}

const auth = {


	"Auth": (new Auth())


};

export default auth
export {
	auth
}