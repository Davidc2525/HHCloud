const MIDDLE = "share@DIALOGS"
const _prefix = "share_dialogs@"
const ACTIONS = {

	COPY:{
		C_OPEN:{
			NAME:_prefix+"OPEN_COPY",
			FUN:function({owner,spath,subpath}){
				return ({
					type:_prefix+"OPEN_COPY",
					middle:MIDDLE,
					payload : {owner,spath,subpath}
				})
			}
		},
		C_CLOSE:{
			NAME:_prefix+"CLOSE_COPY",
			FUN:function () {
				return ({
					type:_prefix+"CLOSE_COPY",
					middle:MIDDLE,
				})
			}
		},

	},

	CREATE_EDIT: {
		
		SET_STATUS:{
			NAME:_prefix+"SET_STATUS",
			FUN:function(status="ok",msg=null){
				return ({
					type:_prefix+"SET_STATUS",
					middle:MIDDLE,
					payload : {status,msg}
				})
			}
		},

		DELETE_SHARE:{
			NAME:_prefix+"DELETE_SHARE",
			FUN:function(path){
				return ({
					type:_prefix+"DELETE_SHARE",
					middle:MIDDLE,
					payload:{path}
				})
			}
		},
		SAVE_CONF_SHARE:{
			NAME:_prefix+"SAVE_CONF_SHARE",
			FUN:function(){
				return ({
					type:_prefix+"SAVE_CONF_SHARE",
					middle:MIDDLE,
				})
			}
		},
		SET_DATA_SHARE:{
			NAME:_prefix+"SET_DATA_SHARE",
			FUN:function(payload){
				return ({
					type:_prefix+"SET_DATA_SHARE",
					middle:MIDDLE,
					payload : payload
				})
			}
		},
		DATA_SHARE_ADD_USER:{
			NAME:_prefix+"DATA_SHARE_ADD_USER",
			FUN:function(user){
				return ({
					type:_prefix+"DATA_SHARE_ADD_USER",
					middle:MIDDLE,
					payload : {user}
				})
			}
		},

		DATA_SHARE_REMOVE_USER_BY_ID:{
			NAME:_prefix+"DATA_SHARE_REMOVE_USER_BY_ID",
			FUN:function(id){
				return ({
					type:_prefix+"DATA_SHARE_REMOVE_USER_BY_ID",
					middle:MIDDLE,
					payload : {id}
				})
			}
		},
		SET_MODE_SHARE:{
			NAME:_prefix+"SET_MODE_SHARE",
			FUN:function(mode="P"){
				return ({
					type:_prefix+"SET_MODE_SHARE",
					middle:MIDDLE,
					payload : {mode}
				})
			}
		},
		OPEN:{
			NAME:_prefix+"OPEN",
			FUN:function({owner,path,dtype="create"}){
				return ({
					type:_prefix+"OPEN",
					middle:MIDDLE,
					payload : {owner,path,type:dtype}
				})
			}
		},
		CLOSE:{
			NAME:_prefix+"CLOSE",
			FUN:function () {
				return ({
					type:_prefix+"CLOSE",
					middle:MIDDLE,
				})
			}
		}
	}
}

export {MIDDLE,ACTIONS}