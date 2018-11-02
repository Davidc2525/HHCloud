import { apiShareInstance } from ".";

class FsListOperation {
    constructor({ spath, subpath, owner, thenCB = _ => { }, catchCB = x => { } } = {}) {
        apiShareInstance
            .instance
            .fsList({ spath, subpath, owner})
            .then(response => {
                thenCB(response);
            })
            .catch(x => {
                catchCB(x);
            });
    }
}

export default FsListOperation;
export { FsListOperation };