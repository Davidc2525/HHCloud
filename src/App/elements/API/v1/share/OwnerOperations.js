

import { apiShareInstance } from ".";

class OwnerOperations {
    static share() {
        return class {
            constructor({ path,mode,users = [], thenCB = _ => { }, catchCB = x => { } } = {}) {
                apiShareInstance
                    .instance
                    .ownerCreateShare({ path,users,mode })
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
            constructor({ path, thenCB = _ => { }, catchCB = x => { } } = {}) {
                apiShareInstance
                    .instance
                    .ownerDelete({ path })
                    .then(response => {
                        thenCB(response);
                    })
                    .catch(x => {
                        catchCB(x);
                    });
            }
        }

    }

    static get() {
        return class {
            constructor({ wusers = false, path, thenCB = _ => { }, catchCB = x => { } } = {}) {
                apiShareInstance
                    .instance
                    .ownerGet({ wusers, path })
                    .then(response => {
                        thenCB(response);
                    })
                    .catch(x => {
                        catchCB(x);
                    });
            }
        }

    }

    static setUsersPath() {
        return class {
            constructor({ users , path, mode, thenCB = _ => { }, catchCB = x => { } } = {}) {
                apiShareInstance
                    .instance
                    .ownerSetUsersPath({ users, path, mode })
                    .then(response => {
                        thenCB(response);
                    })
                    .catch(x => {
                        catchCB(x);
                    });
            }
        }

    }

    static setMode() {
        return class {
            constructor({ mode, path, thenCB = _ => { }, catchCB = x => { } } = {}) {
                apiShareInstance
                    .instance
                    .ownerSetMode({ mode, path })
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

export default OwnerOperations;