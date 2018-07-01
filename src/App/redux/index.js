import { devToolsEnhancer,composeWithDevTools } from 'redux-devtools-extension';
import { addMiddleware, removeMiddleware, resetMiddlewares } from 'redux-dynamic-middlewares'
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

const initialState = fromJS({
	app: {
		name: "SucreCloud"
	},
	auth:{
		isLogin:true
	}
});
const reducers = combineReducers({
	app: (state = new Map(), action) => {
		
		return state
	},
	auth: (state = new Map(),action) =>{
		if(action.type == "setIsLogin"){
			return state.set("isLogin",action.isLogin)
		}
		return state
	}
})
const composeEnhancers = composeWithDevTools({
  // Specify custom devTools options
});
const store = createStore(reducers, initialState, composeEnhancers(
  applyMiddleware(dynamicMiddlewares),
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
addMiddleware(myMiddleware /*[, anotherMiddleware ... ]*/)

export {
	injectAsyncReducer,
	store
}