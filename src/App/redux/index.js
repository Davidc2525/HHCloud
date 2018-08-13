import initStateTest from "./initStoreTest.js";
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

import createHistory from "history/createBrowserHistory";
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
  syncHistoryWithStore,
  push
} from "react-router-redux";


const history = (createHistory());
window.h = history
window.p=push
const middleware = routerMiddleware(history);
//const mrm = s=>n=>ax=>(console.log(ax),middleware(ax)(n)(ax))

import {reducer as formReducer} from 'redux-form/immutable'

/**explorer*/
import stateExplorer from "../components/explorer/state.js"
import reducersExplorer from "../components/explorer/reducers.js"
import middlewareExplorer from "../components/explorer/middleware.js"


/**download manager*/
import stateAuth from "../elements/auth/state.js"
import reducersAuth from "../elements/auth/reducers.js"
import middlewareAuth from "../elements/auth/middleware.js"
//console.info(stateDownloadManager,reducersDownloadManager)


/**download manager*/
import stateDownloadManager from "../elements/download_manager/state.js"
import reducersDownloadManager from "../elements/download_manager/reducers.js"
import middlewareDownloadManager from "../elements/download_manager/middleware.js"
//console.info(stateDownloadManager,reducersDownloadManager)



/**Estado incial de app*/
const initialState = /*fromJS(initStateTest);*/fromJS({
	app: {
		online:true,
		name: "HHCloud"
	},
	auth: stateAuth,
	explorer: stateExplorer,
	downloads: stateDownloadManager
});

/**Reducers para cada estado*/
const reducers = combineReducers({
	form:formReducer,
	router: routerReducer,
	app: (state = new Map(), action) => {
		if(action.type=="APP_CONNECTION"){
			var newState = state;
				newState = state.setIn(["online"],action.payload.online);

			return newState;
		}
		return state;
	},
	auth: reducersAuth,
	explorer: reducersExplorer,
	downloads: reducersDownloadManager,
})

/**Dev tools*/
const composeEnhancers = composeWithDevTools({
	// Specify custom devTools options
});

/**Crear store*/
const store = createStore(reducers, initialState, composeEnhancers(
	applyMiddleware(dynamicMiddlewares, middlewareExplorer,middlewareDownloadManager,middlewareAuth,middleware),
));

ononline=_=>{
	store.dispatch({type:"APP_CONNECTION",payload:{online:true}})
	console.warn("conectado")
}

onoffline=_=>{
	store.dispatch({type:"APP_CONNECTION",payload:{online:false}})
	console.warn("deconectado")
}

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
	store,
	history
}