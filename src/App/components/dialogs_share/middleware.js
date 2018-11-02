import {
	MIDDLE,
	ACTIONS
} from "./actions.js";
import ApiInstance from "../../elements/API/v1/Api.js"

export default store => next => action => {

	if (action && action.middle && action.middle == MIDDLE) {

		if (action.type == ACTIONS.CREATE_EDIT.OPEN.NAME) {


			if (action.payload.type == "edit"||action.payload.type == "delete") {
				setTimeout(_ => {
					ApiInstance.instance.callOperation("owner::get", {
						path: action.payload.path,
						wusers: true,
						thenCB: (r) => {
							store.dispatch(ACTIONS.CREATE_EDIT.SET_DATA_SHARE.FUN(r.payload));
							store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("ok"));
						},
						catchCB: (x) => {
							store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("error", x.msg));
						}
					});
				}, 0)

				next(action);
				store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("loading"));
			} else {
				next(action);
			}

			return;
		}

		if (action.type == ACTIONS.CREATE_EDIT.DELETE_SHARE.NAME) {
			next(action);
			store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("deleting"));
			const path = action.payload.path;
			ApiInstance.instance.callOperation("owner::delete", {
				path,
				thenCB: (r) => {					
					store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("ok"));
					store.dispatch(ACTIONS.CREATE_EDIT.CLOSE.FUN());
					store.dispatch({type:"SET_SHARED",payload:{path,shared:false}});

				},
				catchCB: (x) => {
					store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("error", x.msg));
				}
			});

			return;
		}


		if (action.type == ACTIONS.CREATE_EDIT.SAVE_CONF_SHARE.NAME) {
			var type = store.getState().getIn(["dialogs_share", "create_edit", "type"]);
			var path = store.getState().getIn(["dialogs_share", "create_edit", "path"]);
			var mode = store.getState().getIn(["dialogs_share", "create_edit", "data", "mode"]);

			const modfMode = store.getState().getIn(["dialogs_share", "create_edit", "mode"]);
			const modfUsers = store.getState().getIn(["dialogs_share", "create_edit", "users"]);
			
			next(action);
			store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("saving"));
			if(modfMode&&modfUsers){
				var ids = store.getState()
					.getIn(["dialogs_share", "create_edit", "data", "shareWith", "users"])
					.map(x => x.get("id")).toJS();

				var users = ids.join();
				var nameOperation = type == "create" ? "owner::share":"owner::set_users_path";

				ApiInstance.instance.callOperation(nameOperation, {
					path,
					users,
					mode,
					thenCB: (r) => {					
						store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("ok"));
						
						store.dispatch({type:"SET_SHARED",payload:{path,shared:true}});

					},
					catchCB: (x) => {
						store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("error", x.msg));
					}
				});

				return;
			}

			if(modfMode){
				ApiInstance.instance.callOperation("owner::set_mode", {
					path,
					mode,
					thenCB: (r) => {					
						store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("ok"));
						
						store.dispatch({type:"SET_SHARED",payload:{path,shared:true}});

					},
					catchCB: (x) => {
						store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("error", x.msg));
					}
				});
			}

			if(modfUsers){
				var ids = store.getState()
					.getIn(["dialogs_share", "create_edit", "data", "shareWith", "users"])
					.map(x => x.get("id")).toJS();

				var users = ids.join();
				var nameOperation = type == "create" ? "owner::share":"owner::set_users_path";

				ApiInstance.instance.callOperation(nameOperation, {
					path,
					users,
					thenCB: (r) => {					
						store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("ok"));
						
						store.dispatch({type:"SET_SHARED",payload:{path,shared:true}});

					},
					catchCB: (x) => {
						store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("error", x.msg));
					}
				});
			}

			if(!modfUsers&&!modfMode){
				store.dispatch(ACTIONS.CREATE_EDIT.SET_STATUS.FUN("ok"));
			}

			return;
		}


	}

	next(action);

}