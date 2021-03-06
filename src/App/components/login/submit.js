import {SubmissionError} from 'redux-form/immutable'
import {auth} from "../../elements/auth/index.js";
import ApiInstance from "../../elements/API/v1/Api.js"
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

function submit2(values) {
  return sleep(1000).then(() => {
    // simulate server latency
    if (!['david@orchi.com'].includes(values.get("email"))) {
      throw new SubmissionError({
        email: 'User does not exist',
        _error: 'Login failed!'
      })
    } else if (values.get("password") !== 'David23034087') {
      throw new SubmissionError({
        password: 'Wrong password',
        _error: 'Login failed!'
      })
    } else {
      window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
    }
  })
}
const LoginSubmit = values => {

		return auth.Auth.signIn(values.get("email"),values.get("password"),values.get("remember"))
		.then(auth => {
			console.log("session iniciada", auth)
		}).catch(x => {	
			if (x.username != null) {
				throw new SubmissionError({
					email: x.username,
					_error: x.msg
				})
			} else if (x.password != null) {
				throw new SubmissionError({
					password: "Clave incorrecta.",
					_error: x.msg
				})
			}else if(x.error){
				throw new SubmissionError({
					_error: x.errorMsg
				})
			}

		})
	}


const submitRegister = values => {// agregar valor de usuario genero
	const email		= values.get("email");
	const username	= values.get("username");
	const firstName	= values.get("firstname");
	const lastName	= values.get("lastname");
	const password	= values.get("password");
	const user = new User({email,username,firstName,lastName,password});
	
	return new Promise((re, rej) => {
		ApiInstance.instance.callOperation("createuser", {
			user,
			thenCB: user => {
				re(user)
			},
			catchCB: x => {
				rej(x)

			}
		})
	})
	/**dejamos el then para la clase register.then(user=>{

	})*/
	

}

export {LoginSubmit}
export {submitRegister}