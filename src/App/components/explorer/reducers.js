import {
	Map,
	fromJS
} from "immutable"
import {
	FETCHTED_PATH,
	DOWNLOAD_STATE
} from "./actions.js"

import {getParent,getName} from "./Util.js"

export default (state = new Map(), action) => {

	switch (action.type) {
		case "FETCHING_PATH":
			
			var newState = state.setIn(["paths", action.path], fromJS({
				status: "loading",
				path:action.path
				
			}))

			return newState

		case FETCHTED_PATH:
			delete action.payload.data.args
			var newState = state.setIn(["paths", action.path], fromJS({
				status: action.status,
				...action.payload.data
			}))

			return newState

		case "DELETED_PATH":
			var newState = state.deleteIn(["paths", action.path])
			return newState


		/**eliminar*/
		case "DOWNLOAD_STATE":
			var newState = state.setIn(["paths", action.path], fromJS({
				status: "empty",
				...action.data
			}))

			return newState




		/*markado de descarga*/
		case "MARK_DOWNLOAD":
			//action.payload.{path,status}
			var newState = state;
			var parentPath = getParent(action.payload.path)
			var targetName = getName(action.payload.path)
				//newState = newState.get(action.payload.parentPath)
			
			/**actualizar padre en donde se encuentra esa rruta hijo*/
				/**hijos de la rruta padre*/
			var childrensByParent = newState.getIn(["paths",parentPath,"data"]);
			
			if (childrensByParent!=null) {
				let index  = null; 
				console.warn(" childrensByParent ", childrensByParent.toJS())
				var targetPath = childrensByParent.find((x,i) => (index=i,x.get("name") == targetName))
				if (targetPath != null) {
					console.warn("targetPath ", targetPath.toJS(),index)
					var oldPathUpdate = targetPath.set("download",action.payload.status)
					//oldPathUpdate = oldPathUpdate.set("path",action.payload.newPath)
					console.warn("oldPathUpdate ", oldPathUpdate.toJS())

					if(index!= null){
						childrensByParent=childrensByParent.update(index,_=>oldPathUpdate)
						newState = newState.setIn(["paths",parentPath,"data"],childrensByParent)
					}

				}
			}

		return newState 


		/**dialogo de mover o copiar*/
		case "OPEN_MOVE_OR_COPY_DIALOG":
			var newState = state.setIn(["moveOrCopyDialog","open"], true)
				newState = newState.setIn(["moveOrCopyDialog","op"], action.payload.op)
				newState = newState.setIn(["moveOrCopyDialog","cantEdit"], true)
				newState = newState.setIn(["moveOrCopyDialog","status"], "ready")
				newState = newState.setIn(["moveOrCopyDialog","name"], action.payload.name)
				newState = newState.setIn(["moveOrCopyDialog","path"], action.payload.path)

			return newState
			
		case "CLOSE_MOVE_OR_COPY_DIALOG":
			var newState = state.setIn(["moveOrCopyDialog","open"], false)
					newState = newState.setIn(["moveOrCopyDialog","op"], null)
					newState = newState.setIn(["moveOrCopyDialog","cantEdit"], false)
					newState = newState.setIn(["moveOrCopyDialog","status"], "ready")
					newState = newState.setIn(["moveOrCopyDialog","name"], "")
					newState = newState.setIn(["moveOrCopyDialog","path"], "")

		return newState;

			/**rename dialog*/
		case "OPEN_RENAME_DIALOG":
			var newState = state.setIn(["renameDialog","open"], true)
				newState = newState.setIn(["renameDialog","cantEdit"], true)
				newState = newState.setIn(["renameDialog","status"], "ready")
				newState = newState.setIn(["renameDialog","name"], action.nameFile)
				newState = newState.setIn(["renameDialog","path"], action.path)

			return newState

		case "CLOSE_RENAME_DIALOG":
			var newState = state.setIn(["renameDialog","open"], false)
				newState = newState.setIn(["renameDialog","cantEdit"], false)
				newState = newState.setIn(["renameDialog","status"], "ready")
				newState = newState.setIn(["renameDialog","name"], "")
				newState = newState.setIn(["renameDialog","path"], "")
			return newState


		case "CANT_EDIT_RENAME_DIALOG":
			var newState = state.setIn(["renameDialog","cantEdit"], action.cantEdit)
			return newState

		case "STATUS_RENAME_DIALOG":
			var newState = state.setIn(["renameDialog","status"], action.status)
				newState = newState.setIn(["renameDialog","errorMsg"], action.errorMsg)
			return newState

		case "RENAMED_PATH":
			var newState = state;
				//newState = newState.get(action.payload.parentPath)
			
			/**actualizar padre en donde se encuentra esa rruta hijo*/
				/**hijos de la rruta padre*/
			var childrensByParent = newState.getIn(["paths",action.payload.parentPath,"data"]);
			
			if (childrensByParent!=null) {
				let index  = null; 
				//console.warn(" childrensByParent ", childrensByParent.toJS())
				var oldPath = childrensByParent.find((x,i) => (index=i,x.get("name") == action.payload.oldName))
				if (oldPath != null) {
					//console.warn("oldPath ", oldPath.toJS(),index)
					var oldPathUpdate = oldPath.set("name",action.payload.newName)
					oldPathUpdate = oldPathUpdate.set("path",action.payload.newPath)
					//console.warn("oldPathUpdate ", oldPathUpdate.toJS())

					if(index!= null){
						childrensByParent=childrensByParent.update(index,_=>oldPathUpdate)
						newState = newState.setIn(["paths",action.payload.parentPath,"data"],childrensByParent)
					}

				}
			}

			/**eliminar rrutas q comiensen con la rruta anterios(rruta antes de cambiar el nombre )*/
			var paths =  newState.get("paths");
			var OldpathAbs =  paths.get(action.payload.oldPath);
			if (OldpathAbs != null) {
				var pathsToDelete = paths.filter(itemPath => itemPath.get("path").startsWith(action.payload.oldPath))

				pathsToDelete.forEach( (deletePath) => paths = paths.delete( deletePath.get("path") ) )

				newState = newState.set("paths", paths)
			}

			return newState



		default:
			return state
	}
}