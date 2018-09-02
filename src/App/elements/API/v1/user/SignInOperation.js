import apiUserInstance from "./index";
import { AuthObject } from "../../../auth/AuthObject";
interface args {
    email:string,
    password:string,
    remember:boolean,
    thenCB:Function,
    catchCB:Function
}
class SignInOperation {
    constructor(props:args = {}) {
        apiUserInstance
            .instance
            .signIn(props.email,props.password,props.remember)
            .then(authobject => {
                props.thenCB(authobject);
            })
            .catch(x => {
                props.catchCB(x);
            });
    }
}

export { SignInOperation }