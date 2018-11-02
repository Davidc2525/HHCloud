import {
	MIDDLE,
	ACTIONS
} from "./actions.js";
export default store => next => action => {

	if (action && action.middle && action.middle == MIDDLE) {
		if (action.type == ACTIONS.CLOSE_LITTLE_MSG.NAME) {

			setTimeout(_ => {
				var msgStack = store.getState().getIn(["app", "littleMsg", "msgs"]);
				if (msgStack.size > 0) {
					var content = msgStack.first();
					//msgStack = msgStack.shift();
					store.dispatch(ACTIONS.OPEN_LITTLE_MSG.FUN(content.msg));
					store.dispatch(ACTIONS.SHIFT_LITTLE_MSG.FUN());

				}
			}, 400 )

			next(action)
			return;
		}
	}
	next(action);


}