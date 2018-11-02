import {
    MIDDLE,
    ACTIONS
} from "./actions";
import {
    List,
    fromJS
} from "immutable";

import initState from "./state.js";

export default (state = new Map(), action) => {

    switch (action.type) {
        case "CLEAR_STATE":
            
            return initState;

        case ACTIONS.FETCHING_SHARED.NAME:
            var newState = state;
            newState = newState.set("status", action.status);
            newState = newState.set("shared", new List());
            return newState;


        case ACTIONS.FETCHED_SHARED.NAME:
            var newState = state;
            console.warn(action.payload)
            if (action.payload.status == "ok") {
                var shared = fromJS(action.payload.payload.shared);

                newState = newState.set("shared", shared);
            } else {
                newState = newState.set("error", action.payload.error);
                newState = newState.set("msg", action.payload.msg);
            }
            newState = newState.set("status", action.status);
            return newState;

        case ACTIONS.DELETED_SHARE.NAME:
            var newState = state;
            var index = newState.get("shared").findIndex(filter(action.payload.owner, action.payload.path));
            var shared = newState.get("shared");
                shared = shared.delete(index);
                newState = newState.set("shared", shared);

            return newState;


        case ACTIONS.OPEN_LITLE_MSG.NAME:
            var newState = state;
                newState = newState.setIn(["littleMsg","open"],true);
                newState = newState.setIn(["littleMsg","msg"],action.payload.msg);
            return newState;

        case ACTIONS.CLOSE_LITLE_MSG.NAME:
            var newState = state;
                newState = newState.setIn(["littleMsg","open"],false);
                newState = newState.setIn(["littleMsg","msg"],"");

            return newState;


        default:
            return state;
    }


}

const filter = (u, p) => x => {

    const path = x.get("path")
    const idUser = x.getIn(["owner", "id"])

    return p == path && u == idUser

}