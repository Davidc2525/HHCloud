

import { apiShareInstance } from ".";

class UserOperations {
    static list(){
        return class {
            constructor({ thenCB = _ => { }, catchCB = x => { } } = {}){
                apiShareInstance
                    .instance
                    .userList()
                    .then(response => {
                        thenCB(response);
                    })
                    .catch(x => {
                        catchCB(x);
                    });
            }
        }
    }

    static delete() {
        return class {
            constructor({ owner, path, thenCB = _ => { }, catchCB = x => { } } = {}) {
                apiShareInstance
                    .instance
                    .userDelete({ owner, path})
                    .then(response => {
                        thenCB(response);
                    })
                    .catch(x => {
                        catchCB(x);
                    });
            }
        }
    }

    static copy() {
        return class {
            constructor({ owner, spath, srcpath, dstpath,thenCB = _ => { }, catchCB = x => { } } = {}) {
                apiShareInstance
                    .instance
                    .userCopy({ owner, spath, srcpath, dstpath})
                    .then(response => {
                        thenCB(response);
                    })
                    .catch(x => {
                        catchCB(x);
                    });
            }
        }
    }
}

export default UserOperations;