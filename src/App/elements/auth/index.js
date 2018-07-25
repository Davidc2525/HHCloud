import firebaseApp from "firebase/app"
import firebaseAuth from "firebase/auth"
import firebase from "firebase"
window.fb = firebase
window.fbau = firebaseAuth

import {
	store
} from "../../redux/index.js"


class Auth {

	constructor(props) {
		window.Auth = this
		console.warn(store);

		var config = {
			apiKey: "AIzaSyCtGmtbl64SB9quCGXpuI8agx5RRh2_moE",
			authDomain: "hhcloud-29d6a.firebaseapp.com",
			databaseURL: "https://hhcloud-29d6a.firebaseio.com",
			projectId: "hhcloud-29d6a",
			storageBucket: "hhcloud-29d6a.appspot.com",
			messagingSenderId: "843650094886"
		};

		this.app = firebaseApp.initializeApp(config)
		this.auth = this.app.auth();

		this.auth.onAuthStateChanged(user => {
			if (user) {
				this.userLogin = user
				store.dispatch({type:"AUTH_SETLOGIN",payload:{isLogin:true}})
				store.dispatch({
					type: "AUTH_SETUSERDATA",
					payload: {
						userdata: user.toJSON()
					}
				})
			} else {
				this.userLogin = null
				store.dispatch({type:"AUTH_SETLOGIN",payload:{isLogin:false}})
				store.dispatch({type:"AUTH_SETUSERDATA",payload:{userdata:null}})
			}
		})

		console.warn(app)
	}


	signIn(user, pass) {
		this.auth.signInWithEmailAndPassword(user, pass)
			.then(x => {
				console.warn("logeado",x)
				//this.userLogin = x
			})
			.catch(x => console.error(x))

	}

	signUp(user, pass) {
		this.auth.createUserWithEmailAndPassword(user, pass)
			.then(x => {
				console.warn("registrado")
				this.auth.currentUser.sendEmailVerification
				//this.userLogin = x
			})
			.catch(x => console.error(x))

	}

	googleSigIn(){
		var p=new firebaseApp.auth.GoogleAuthProvider()
		
		this.auth.signInWithPopup(p).then(function(result) {
		  // This gives you a Google Access Token. You can use it to access the Google API.
			//r=result
		   //token = result.credential.accessToken;
		  // The signed-in user info.
		   //user = result.user;
		console.log("logeado",result)
		  // ...
		}).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // The email of the user's account used.
		  var email = error.email;
		  // The firebase.auth.AuthCredential type that was used.
		  var credential = error.credential;
		  // ...
		});
	}

	gitHubSigIn(){
		var p=new firebaseApp.auth.GithubAuthProvider()
		
		this.auth.signInWithPopup(p).then(function(result) {
		  // This gives you a Google Access Token. You can use it to access the Google API.
			//r=result
		   //token = result.credential.accessToken;
		  // The signed-in user info.
		   //user = result.user;
		console.log("logeado",result)
		  // ...
		}).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // The email of the user's account used.
		  var email = error.email;
		  // The firebase.auth.AuthCredential type that was used.
		  var credential = error.credential;
		  // ...
		});
	}

	facebookSigIn(){
		var p=new firebaseApp.auth.FacebookAuthProvider()
		
		this.auth.signInWithPopup(p).then(function(result) {
		  // This gives you a Google Access Token. You can use it to access the Google API.
			//r=result
		   //token = result.credential.accessToken;
		  // The signed-in user info.
		   //user = result.user;
		console.log("logeado",result)
		  // ...
		}).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // The email of the user's account used.
		  var email = error.email;
		  // The firebase.auth.AuthCredential type that was used.
		  var credential = error.credential;
		  // ...
		});
	}



}


const auth = {


	"Auth": (new Auth())


};

export default auth
export {
	auth
}