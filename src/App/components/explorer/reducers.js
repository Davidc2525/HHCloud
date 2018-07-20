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

			//newState.setIn(["currentType"],action.payload.data.file?"file":"folder")

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

		case "SET_STATUS_MOVE_OR_COPY_DIALOG":
			var newState = state;
				newState = newState.setIn(["moveOrCopyDialog","status"], action.payload.status)

			return newState

		case "SET_FETCH_MOVE_OR_COPY_DIALOG":
			var newState = state;
				newState = newState.setIn(["moveOrCopyDialog","fetchingPath"], action.payload.fetching)

			return newState

			case "SET_PATHS_MOVE_OR_COPY_DIALOG":
			var newState = state;
			var paths = newState.getIn(["moveOrCopyDialog","paths"])
				paths = paths.set(action.payload.path, fromJS(action.payload.paths))					
				newState = newState.setIn(["moveOrCopyDialog","paths"], paths)

			return newState



		/**dialogo de mover o copiar*/

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

				
				paths = paths.asMutable();

				pathsToDelete.forEach( (deletePath) => paths.delete( deletePath.get("path") ) )

				paths = paths.asImmutable();

				//pathsToDelete.forEach( (deletePath) => paths = paths.delete( deletePath.get("path") ) )

				newState = newState.set("paths", paths)
			}

			return newState


		case "FILTER_TOOLBAR":
			var newState = state;

			var toolbar = newState.get("toolBar")
				toolbar = toolbar.set("filter",action.payload.filter)
				newState = newState.set("toolBar",toolbar)
			return newState
		
		case "SELECTED_MODE_TOOLBAR":
			var newState = state;
			var selecteds = newState.getIn(["selection","selecteds"]);
			var selection = newState.get("selection");
				selection = selection.set("selecteds",new Map())
				newState = newState.set("selection",selection);
			var newStateSelection = action.payload.selecteMode;


				selection = selection.set("isSelecteMode",newStateSelection);
				newState = newState.set("selection",selection)


				selecteds.forEach(item => {


					var path=item.get("path");
					var parentPath = getParent(path);
					var targetName = getName(path);
						var childrensByParent = newState.getIn(["paths",parentPath,"data"]);
					
						if (childrensByParent!=null) {
							let index  = null; 
							console.warn(" childrensByParent ", childrensByParent.toJS())
							var targetPath = childrensByParent.find((x,i) => (index=i,x.get("name") == targetName))
							if (targetPath != null) {
								console.warn("targetPath ", targetPath.toJS(),index)
								var oldPathUpdate = targetPath.set("selectioned",false)
								//oldPathUpdate = oldPathUpdate.set("path",action.payload.newPath)
								console.warn("oldPathUpdate ", oldPathUpdate.toJS())

								if(index!= null){
									childrensByParent=childrensByParent.update(index,_=>oldPathUpdate)
									newState = newState.setIn(["paths",parentPath,"data"],childrensByParent)
								}

							}
						}
				});
			return newState

		case "ADD_ITEM_SELECTION":
			var newState = state;
			var selection = newState.get("selection")
			var selecteds = selection.get("selecteds")
			var item = action.payload.item
			var path =  item.get("path")
				selecteds = selecteds.set(path,item)
				selection = selection.set("selecteds",selecteds);

				newState = newState.set("selection",selection);

			var parentPath = getParent(path);
			var targetName = getName(path);
				var childrensByParent = newState.getIn(["paths",parentPath,"data"]);
			
				if (childrensByParent!=null) {
					let index  = null; 
					console.warn(" childrensByParent ", childrensByParent.toJS())
					var targetPath = childrensByParent.find((x,i) => (index=i,x.get("name") == targetName))
					if (targetPath != null) {
						console.warn("targetPath ", targetPath.toJS(),index)
						var oldPathUpdate = targetPath.set("selectioned",true)
						//oldPathUpdate = oldPathUpdate.set("path",action.payload.newPath)
						console.warn("oldPathUpdate ", oldPathUpdate.toJS())

						if(index!= null){
							childrensByParent=childrensByParent.update(index,_=>oldPathUpdate)
							newState = newState.setIn(["paths",parentPath,"data"],childrensByParent)
						}

					}
				}

			return newState;

		case "REMOVE_ITEM_SELECTION":
			var newState = state;
			var selection = newState.get("selection")
			var selecteds = selection.get("selecteds")
			var item = action.payload.item
			var path =  item.get("path")

				selecteds = selecteds.delete(path)
				selection = selection.set("selecteds",selecteds);

				newState = newState.set("selection",selection);

			var parentPath = getParent(path);
			var targetName = getName(path);
				var childrensByParent = newState.getIn(["paths",parentPath,"data"]);
			
				if (childrensByParent!=null) {
					let index  = null; 
					console.warn(" childrensByParent ", childrensByParent.toJS())
					var targetPath = childrensByParent.find((x,i) => (index=i,x.get("name") == targetName))
					if (targetPath != null) {
						console.warn("targetPath ", targetPath.toJS(),index)
						var oldPathUpdate = targetPath.set("selectioned",false)
						//oldPathUpdate = oldPathUpdate.set("path",action.payload.newPath)
						console.warn("oldPathUpdate ", oldPathUpdate.toJS())

						if(index!= null){
							childrensByParent=childrensByParent.update(index,_=>oldPathUpdate)
							newState = newState.setIn(["paths",parentPath,"data"],childrensByParent)
						}

					}
				}
			return newState;



		case "CURRENT_TYPE_EXPLORER":

			var newState = state;
				newState = newState.setIn(["currentType"],action.payload.type)
		return newState;

		default:
			return state
	}
}