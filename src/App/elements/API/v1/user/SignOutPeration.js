import apiUserInstance from "./index";
import { AuthObject } from "../../../auth/AuthObject";

class SignOutOperation {
    constructor({ thenCB = x => { }, catchCB = x => { } } = {}) {
        apiUserInstance
            .instance
            .signOut()
            .then(x => {
                thenCB(x);
            })
            .catch(x => {
                catchCB(x);
            });
    }
}

export { SignOutOperation }