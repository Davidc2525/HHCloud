import { apiShareInstance } from ".";

class FsSatusOperation {
    constructor({ spath, subpath, owner, thenCB = _ => { }, catchCB = x => { } } = {}) {
        apiShareInstance
            .instance
            .fsStatus({ spath, subpath, owner})
            .then(response => {
                thenCB(response);
            })
            .catch(x => {
                catchCB(x);
            });
    }
}

export default FsSatusOperation;
export { FsSatusOperation };