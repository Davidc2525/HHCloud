import {
	devToolsEnhancer,
	composeWithDevTools
} from 'redux-devtools-extension';
import {
	addMiddleware,
	removeMiddleware,
	resetMiddlewares
} from 'redux-dynamic-middlewares'
import immutable from "immutable"
import {
	Map,
	fromJS
} from "immutable"
import {
	combineReducers
} from 'redux-immutable';
import {
	createStore,
	applyMiddleware
} from 'redux'

import {
	createStores
} from 'redux-dynamic-reducer'
import dynamicMiddlewares from 'redux-dynamic-middlewares'


/**explorer*/
import stateExplorer from "../components/explorer/state.js"
import reducersExplorer from "../components/explorer/reducers.js"
import middlewareExplorer from "../components/explorer/middleware.js"

/**download manager*/
import stateDownloadManager from "../elements/download_manager/state.js"
import reducersDownloadManager from "../elements/download_manager/reducers.js"
import middlewareDownloadManager from "../elements/download_manager/middleware.js"
//console.info(stateDownloadManager,reducersDownloadManager)



/**Estado incial de app*/
const initialState = fromJS({
	app: {
		name: "SucreCloud"
	},
	auth: {
		isLogin: true
	},
	explorer: stateExplorer,
	downloads: stateDownloadManager
});

/**Reducers para cada estado*/
const reducers = combineReducers({
	app: (state = new Map(), action) => {

		return state
	},
	auth: (state = new Map(), action) => {
		if (action.type == "setIsLogin") {
			return state.set("isLogin", action.isLogin)
		}
		return state
	},
	explorer: reducersExplorer,
	downloads: reducersDownloadManager
})

/**Dev tools*/
const composeEnhancers = composeWithDevTools({
	// Specify custom devTools options
});

/**Crear store*/
const store = createStore(reducers, initialState, composeEnhancers(
	applyMiddleware(dynamicMiddlewares, middlewareExplorer),
	// other store enhancers if any
));



store.asyncReducers = {}

function createReducer(asyncReducers) {
	return combineReducers({
		...asyncReducers
	});
}

function injectAsyncReducer(store, name, asyncReducer) {
	store.asyncReducers[name] = asyncReducer;
	store.replaceReducer(createReducer(store.asyncReducers));
}
window.injectAsyncReducer = injectAsyncReducer
window.store = store

//injectAsyncReducer(store,"nc",(state = Map({name:"reducer nuevo"}),action)=>{console.warn(state,action);return state})


const myMiddleware = store => next => action => {
	// do something
	console.error(action)
	return next(action)
}

// will add middleware to existing chain
//addMiddleware(myMiddleware /*[, anotherMiddleware ... ]*/)

export {
	injectAsyncReducer,
	store
}