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

const middleware = routerMiddleware(history);
//const mrm = s=>n=>ax=>(console.log(ax),middleware(ax)(n)(ax))

import {reducer as formReducer} from 'redux-form/immutable'

/**App*/
import stateApp from "../state.js";
import reducersApp from "../reducers.js"
import middlewareApp from "../middleware.js"

/**Dialogs share*/
import stateDialogsShare from "../components/dialogs_share/state.js"
import reducerDialogsShare from "../components/dialogs_share/reducer.js"
import middlewareDialogsShare from "../components/dialogs_share/middleware.js"

/**open share*/
import stateSharedWithMe from "../components/share/state.js"
import reducersSharedWithMe from "../components/share/reducers.js"
import middlewareSharedWithMe from "../components/share/middleware.js"

/**open share*/
import stateOpenShare from "../components/open_share/state.js"
import reducersOpenShare from "../components/open_share/reducers.js"
import middlewareOpenShare from "../components/open_share/middleware.js"

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

/**upload manager */
import stateUploadManager from "../elements/upload_manager/state.js";
import reducersUploadManger from "../elements/upload_manager/reducers.js";
import middlewareUploadManager from "../elements/upload_manager/middleware.js";



/**Estado incial de app*/
const initialState = /*fromJS(initStateTest);*/fromJS({
	app: stateApp,
	auth: stateAuth,
	dialogs_share:stateDialogsShare,
	shared_with_me: stateSharedWithMe,
	open_share:stateOpenShare,
	explorer: stateExplorer,
	downloads: stateDownloadManager,
	uploads:stateUploadManager,
});

/**Reducers para cada estado*/
const reducers = combineReducers({
	form:formReducer,
	router: routerReducer,
	app: reducersApp,
	auth: reducersAuth,
	dialogs_share: reducerDialogsShare,
	shared_with_me:reducersSharedWithMe,
	open_share:reducersOpenShare,
	explorer: reducersExplorer,
	downloads: reducersDownloadManager,
	uploads:reducersUploadManger,
})

/**Dev tools*/
const composeEnhancers = composeWithDevTools({
	// Specify custom devTools options
});

/**Crear store*/
const store = createStore(reducers, initialState, composeEnhancers(
	applyMiddleware(
		middlewareDialogsShare,
		middlewareApp,
		dynamicMiddlewares,
		middlewareSharedWithMe,
		middlewareOpenShare,
		middlewareExplorer,
		middlewareDownloadManager,
		middlewareUploadManager,
		middlewareAuth,
		middleware),
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