import {
	Map,
	fromJS
} from "immutable"
import {
	ACTIVE_UPLOAD,
	FETCHTED_PATH,
	DOWNLOAD_STATE
} from "./actions.js"

import {getParent,getName} from "./Util.js"

/**
  * editar un item dentro de la data de un item q contiene elementos dentro,
  * Cambiar una propiedad un item de un directorio, ya q se repetia este codigo en algunos reducers
  */
const setPropertyInChildreDiretory = (state,pathParent,pathChild, name, value) => {

	var newState = state;
	var parentPath = pathParent;//getParent(path);
	var targetName = pathChild;//getName(path);
	var childrensByParent = newState.getIn(["paths", parentPath, "payload"]);

	if (childrensByParent != null) {
		let index = null;
		//console.warn(" childrensByParent ", childrensByParent.toJS())
		var targetPath = childrensByParent.find((x, i) => (index = i, x.get("name") == targetName))
		if (targetPath != null) {
			//console.warn("targetPath ", targetPath.toJS(), index)
			var oldPathUpdate = targetPath.set(name, value)
			//oldPathUpdate = oldPathUpdate.set("path",action.payload.newPath)
			//console.warn("oldPathUpdate ", oldPathUpdate.toJS())

			if (index != null) {
				childrensByParent = childrensByParent.update(index, _ => oldPathUpdate)
				newState = newState.setIn(["paths", parentPath, "payload"], childrensByParent)
			}

		}
	}

	return newState;
}

export default (state = new Map(), action) => {

	switch (action.type) {
		case "FETCHING_PATH":
			
			var newState = state.setIn(["paths", action.path], fromJS({
				status: "loading",
				path:action.path
				
			}))


			return newState

		case FETCHTED_PATH:
			//delete action.payload.payload.args
			var newState = state.setIn(["paths", action.path], fromJS({
				status: action.status,
				...action.payload.payload //cambiar de data a payload
			}))

			//newState.setIn(["currentType"],action.payload.payload.file?"file":"folder")

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
			var childrensByParent = newState.getIn(["paths",parentPath,"payload"]);
			
			return setPropertyInChildreDiretory(newState,parentPath,targetName,"download",action.payload.status);

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
						newState = newState.setIn(["paths",parentPath,"payload"],childrensByParent)
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
			var childrensByParent = newState.getIn(["paths",action.payload.parentPath,"payload"]);
			
			newState = setPropertyInChildreDiretory(
				newState, action.payload.parentPath,
				action.payload.oldName,
				"name",
				action.payload.newName);

			newState = setPropertyInChildreDiretory(
				newState, action.payload.parentPath,
				action.payload.newName,
				"path",
				action.payload.newPath);
			
			/*if (childrensByParent!=null) {
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
						newState = newState.setIn(["paths",action.payload.parentPath,"payload"],childrensByParent)
					}

				}
			}*/

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
			/*rename diaglo*/


			/**mkdir dialog*/
		case "OPEN_MKDIR_DIALOG":
			var newState = state.setIn(["mkdirDialog","open"], true)
				newState = newState.setIn(["mkdirDialog","cantEdit"], true)
				newState = newState.setIn(["mkdirDialog","status"], "ready")
				newState = newState.setIn(["mkdirDialog","name"], action.nameFile)
				newState = newState.setIn(["mkdirDialog","path"], action.path)

			return newState

		case "CLOSE_MKDIR_DIALOG":
			var newState = state.setIn(["mkdirDialog","open"], false)
				newState = newState.setIn(["mkdirDialog","cantEdit"], false)
				newState = newState.setIn(["mkdirDialog","status"], "ready")
				newState = newState.setIn(["mkdirDialog","name"], "")
				newState = newState.setIn(["mkdirDialog","path"], "")
			return newState


		case "CANT_EDIT_MKDIR_DIALOG":
			var newState = state.setIn(["mkdirDialog","cantEdit"], action.cantEdit)
			return newState

		case "STATUS_MKDIR_DIALOG":
			var newState = state.setIn(["mkdirDialog","status"], action.status)
				newState = newState.setIn(["mkdirDialog","errorMsg"], action.errorMsg)
			return newState

		case "CREATED_PATH_MKDIR_DIALOG":
		
			var newState = state;

			var data = fromJS(action.payload.payload);
			var parentPath = getParent(data.get("path"));
			var newPath = data.get("path");

			var parent = newState.getIn(["paths",parentPath],false);
			
			if(parent){
				/**lista de elementos en ese parent*/
				var parentData = parent.get("payload",false);
				if(parentData){

					parentData = parentData.push(data);
					parent = parent.set("payload",parentData);
					newState = newState.setIn(["paths",parentPath],parent)

				}
			}
			return newState;

			/**mkdir dialog*/

		case "FILTER_TOOLBAR":
			var newState = state;

			var toolbar = newState.get("toolBar")
				toolbar = toolbar.set("filter",action.payload.filter)
				newState = newState.set("toolBar",toolbar)
			return newState

		case "SORTBY_TOOLBAR":
			var newState = state;

			var toolbar = newState.get("toolBar")
				toolbar = toolbar.set("sortBy",action.payload.sortBy)
				newState = newState.set("toolBar",toolbar)
			return newState

		case "ORDER_TOOLBAR":
			var newState = state;

			var toolbar = newState.get("toolBar")
				toolbar = toolbar.set("order",action.payload.order)
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

					newState =  setPropertyInChildreDiretory(newState,parentPath,targetName,"selectioned",false);

					/*var path=item.get("path");
					var parentPath = getParent(path);
					var targetName = getName(path);
						var childrensByParent = newState.getIn(["paths",parentPath,"payload"]);
					
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
									newState = newState.setIn(["paths",parentPath,"payload"],childrensByParent)
								}

							}
						}*/
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

				return setPropertyInChildreDiretory(newState,parentPath,targetName,"selectioned",true);


				var childrensByParent = newState.getIn(["paths",parentPath,"payload"]);
			
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
							newState = newState.setIn(["paths",parentPath,"payload"],childrensByParent)
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

				return setPropertyInChildreDiretory(newState,parentPath,targetName,"selectioned",false);

				var childrensByParent = newState.getIn(["paths",parentPath,"payload"]);
			
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
							newState = newState.setIn(["paths",parentPath,"payload"],childrensByParent)
						}

					}
				}
			return newState;



		case "CURRENT_TYPE_EXPLORER":

			var newState = state;
				newState = newState.setIn(["currentType"],action.payload.type)
		return newState;


		/**Upload*/
		case ACTIVE_UPLOAD:
			var newState = state;

			newState = newState.setIn(["upload","active"],action.payload.active)

			return newState;
		/**Upload*/

		default:
			return state
	}
}