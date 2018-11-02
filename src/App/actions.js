const MIDDLE = "APP"

const ACTIONS = {
	APP_CONNECTION: {
		NAME: "APP_CONNECTION",
		FUN: function(online) {
			return ({
				type: "APP_CONNECTION",
				middle: MIDDLE,
				payload: {
					online
				}
			})
		}
	},


	APP_SET_TITLE: {
		NAME: "APP_SET_TITLE",
		FUN: function(title) {
			return ({
				type: "APP_SET_TITLE",
				middle: MIDDLE,
				payload: {
					title
				}
			})
		}
	},

	OPEN_LITTLE_MSG: {
		NAME: "APP_OPEN_LITTLE_MSG",
		FUN: function(msg,clazz="normal") {
			return ({
				type: "APP_OPEN_LITTLE_MSG",
				middle: MIDDLE,
				payload: {
					open: true,
					clazz,
					msg
				}
			})
		}
	},

	CLOSE_LITTLE_MSG: {
		NAME: "APP_CLOSE_LITTLE_MSG",
		FUN: function() {
			return ({
				type: "APP_CLOSE_LITTLE_MSG",
				middle: MIDDLE,
				payload: {
					open: false,
				}
			})
		}
	},
	/*private*/
	SHIFT_LITTLE_MSG: {
		NAME: "APP_SHIFT_LITTLE_MSG",
		FUN: function() {
			return ({
				type: "APP_SHIFT_LITTLE_MSG",
				middle: MIDDLE
			})
		}
	}
}

export {
	MIDDLE,
	ACTIONS
};