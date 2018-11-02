import {
	MIDDLE,
	ACTIONS
} from "./actions.js"

import {ACTIONS as APP_ACTIONS} from "../../actions.js"
import ApiInstance from "../../elements/API/v1/Api.js";
export default store => next => action => {
	/**
	 * if (ApiInstance == null) {
			ApiInstance = require("../../elements/API/v1/Api.js").default
	}
	 */
	if (action && action.middle && action.middle == MIDDLE) {

		if (action.type == ACTIONS.FETCHING_SHARED.NAME) {
			setTimeout(_ => {
				ApiInstance.instance.callOperation("user::list", {
					thenCB: response => {
						store.dispatch(ACTIONS.FETCHED_SHARED.FUN(response, "loaded"));
					},
					catchCB: (x) => {
						store.dispatch(ACTIONS.FETCHED_SHARED.FUN(x, "error"));
					}
				});
			}, 10 * 1)
			next(action);
			return;
		}

		if (action.type == ACTIONS.DELETING_SHARE.NAME) {

			ApiInstance.instance.callOperation("user::delete", {
				...action.payload,
				thenCB: response => {
					store.dispatch(ACTIONS.DELETED_SHARE.FUN(action.payload.owner, action.payload.path));
					store.dispatch(APP_ACTIONS.OPEN_LITTLE_MSG.FUN( `Se elimino '${action.payload.path}'  de tu lista de enalces compartidos contigo.` ));
				},
				catchCB: (x) => {
					store.dispatch(APP_ACTIONS.OPEN_LITTLE_MSG.FUN(x.msg));
					/*setTimeout(_ => {
						store.dispatch(ACTIONS.CLOSE_LITLE_MSG.FUN());
					}, 3000)*/
					//alert(`Error al eliminar enlace compartido contigo: ${x.msg}`)
				}
			});

			next(action);
			return;

		}
	}

	next(action)
}