import {
	Map,
	fromJS
} from "immutable"
import {
	ACTIONS
} from "./actions.js"
import {getParent,getName} from "../explorer/Util.js"
import {EMPTY_DATA} from "./state.js"
export default (state = Map(), action) => {


	if (action.type == ACTIONS.COPY.C_OPEN.NAME) {
		var newState = state;
		var copy = newState.get("copy");
		copy = copy.set("status", "ok");
		copy = copy.set("open", true);
		copy = copy.set("spath", action.payload.spath);
		copy = copy.set("subpath", action.payload.subpath);
		copy = copy.set("owner", action.payload.owner);
		

		newState = newState.set("copy", copy);

		return newState;
	}


	if (action.type == ACTIONS.COPY.C_CLOSE.NAME) {
		var newState = state;
		var copy = newState.get("copy");
		copy = copy.set("status", "ok");
		copy = copy.set("open", false);
		copy = copy.set("spath",undefined);
		copy = copy.set("subpath",undefined);
		copy = copy.set("owner",undefined);
		

		newState = newState.set("copy", copy);

		return newState;
	}






	if (action.type == ACTIONS.CREATE_EDIT.SET_STATUS.NAME) {
		var newState = state;
		var create_edit = newState.get("create_edit");
		create_edit = create_edit.set("status", action.payload.status);
		create_edit = create_edit.set("msg", action.payload.msg);

		newState = newState.set("create_edit", create_edit);

		return newState;
	}

	if (action.type == ACTIONS.CREATE_EDIT.DATA_SHARE_ADD_USER.NAME) {
		var newState = state;
		var create_edit = newState.get("create_edit");
		var newUser = action.payload.user;
		var users = create_edit.getIn(["data","shareWith","users"]);
			users = users.push(newUser);
			create_edit = create_edit.setIn(["data","shareWith","users"],fromJS(users));
			create_edit = create_edit.set("users",true);

			newState = newState.set("create_edit", create_edit);

		return newState;
	}

	if (action.type == ACTIONS.CREATE_EDIT.DATA_SHARE_REMOVE_USER_BY_ID.NAME) {
		var newState = state;
		var idUser = action.payload.id;
		var create_edit = newState.get("create_edit");
		var users = create_edit.getIn(["data","shareWith","users"]);
		var index = users.findIndex(x=>x.get("id")==idUser);

			users = users.remove(index);
			create_edit = create_edit.setIn(["data","shareWith","users"],users);
			create_edit = create_edit.set("users",true);
			newState = newState.set("create_edit", create_edit);

		return newState;
	}
	

	if (action.type == ACTIONS.CREATE_EDIT.SET_DATA_SHARE.NAME) {
		var newState = state;
		var create_edit = newState.get("create_edit");
		create_edit = create_edit.set("status", "ok");
		//create_edit = create_edit.set("msg", undefined);
		create_edit = create_edit.set("data", fromJS(action.payload));

		newState = newState.set("create_edit", create_edit);

		return newState;
	}

	if (action.type == ACTIONS.CREATE_EDIT.SET_MODE_SHARE.NAME) {
		var newState = state;
		var create_edit = newState.get("create_edit");
		var data = create_edit.get("data");
			data = data.set("mode",action.payload.mode);
		
			create_edit = create_edit.set("data", data);
			create_edit = create_edit.set("mode", true);

			newState = newState.set("create_edit", create_edit);

		return newState;
	}

	if (action.type == ACTIONS.CREATE_EDIT.OPEN.NAME) {
		var newState = state;
		var create_edit = newState.get("create_edit");
		create_edit = create_edit.set("status", "ok");
		create_edit = create_edit.set("type", action.payload.type);
		create_edit = create_edit.set("open", true);
		create_edit = create_edit.set("path", action.payload.path);
		create_edit = create_edit.set("owner", action.payload.owner);
		create_edit = create_edit.set("data", fromJS(EMPTY_DATA()));

		if (action.payload.type == "create") {
			create_edit = create_edit.set("mode", true);
			create_edit = create_edit.set("users", true);
		} else {
			create_edit = create_edit.set("mode", false);
			create_edit = create_edit.set("users", false);
		}

		newState = newState.set("create_edit", create_edit);

		return newState;
	}


	if (action.type == ACTIONS.CREATE_EDIT.CLOSE.NAME) {
		var newState = state;
		var create_edit = newState.get("create_edit");
		create_edit = create_edit.set("status", "ok");
		create_edit = create_edit.set("type", "create");
		create_edit = create_edit.set("open", false);
		create_edit = create_edit.set("owner", undefined);
		create_edit = create_edit.set("path", undefined);
		create_edit = create_edit.set("msg", undefined);
		create_edit = create_edit.set("mode", false);
		create_edit = create_edit.set("users", false);
		create_edit = create_edit.set("data", fromJS(EMPTY_DATA()));

		newState = newState.set("create_edit", create_edit);

		return newState;
	}

	if (action.type == ACTIONS.CREATE_EDIT.SAVE_CONF_SHARE.NAME) {
		var newState = state;
		var create_edit = newState.get("create_edit");
		//create_edit = create_edit.set("status", "ok");
		
		create_edit = create_edit.set("mode", false);
		create_edit = create_edit.set("users", false);
		newState = newState.set("create_edit", create_edit);

		return newState;
	}

	return state;

}