import apiUserInstance from "./index";

class ChangePasswordOperation {
    constructor({ id, currentPassword, password, thenCB = response => { }, catchCB = response => { } } = {}) {
        apiUserInstance
            .instance
            .changePassword(id, currentPassword, password)
            .then(response => {
                thenCB(response);
            })
            .catch(response => {
                catchCB(response);
            });
    }
}

export { ChangePasswordOperation };