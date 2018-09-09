import {store,history} from "./redux/index.js"
import Auth,{auth,STATE} from "./elements/auth/index.js"
import DownloadManager from "./elements/download_manager/index.js"
import UploadManagerInstance from "./elements/upload_manager/index"
import React from "react"
import { Provider ,connect} from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

window.df = require("dateformat")
import {STATES} from "./elements/auth/state.js"
import { withRouter } from 'react-router-dom'

import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
  push
} from "react-router-redux";
//import style from "./css/main.css"
//import Nav from "./components/Nav/index.js"

//import Home from "./components/main_cs/index.js"


 //import('semantic-ui-css/semantic.min.css');
//import { Button ,Menu} from 'semantic-ui-react'
import {  browserHistory } from 'react-router';
import { BrowserRouter as Router, Route, Link,Redirect,Switch } from "react-router-dom";
import Loadable from 'react-loadable';
import red from '@material-ui/core/colors/red';
import ApiInstance from "./elements/API/v1/Api.js";

// import Button from '@material-ui/core/Button';
import {Title} from "./components/title/index.js"
 const AuthArea = Loadable({
  loader: () => import('./components/login/index.jsx'),
 loading: Loading
});
 const Home2 = Loadable({
  loader: () => import('./components/main_cs/index.js'),
 loading: Loading
});

function Loading(props) {
  if (props.error) {
    return <div>Error! <button onClick={ props.retry }>Retry</button></div>;
  } else {
    return <div>Loading...</div>;
  }
}
const dark = createMuiTheme({
  palette: {
    primary: {
      light: '#03A9F4',
      main: '#039BE5',
      dark: '#424242',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    type: true ? "dark" : 'light', // Switching the dark mode on is a single property value change.
    status: {
      danger: 'orange',
    },

    unidadButtom:{
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    }
  },
  shape: {
    borderRadius: "1.3em"
  }

});

const light = createMuiTheme({
  palette: {
    primary: {
      main: '#40c4ff',
    },
    secondary: {
      main: '#009688',
    },
    type: 'light',
    unidadButtom:{
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    }
  },
  shape: {
    borderRadius: "1.3em"
  }
});

const Main =()=>(
    <MuiThemeProvider theme={true?light:dark}>
     <Route component={Home2}/>
    </MuiThemeProvider>

)

const AuthAreaThemed = _ => (
  <MuiThemeProvider theme={true?light:dark}>
     <Route component={AuthArea}/>
  </MuiThemeProvider>
)


@withRouter
@connect((state,props)=>({auth:state.get("auth")}))
class App extends React.Component{

  render(){
   const authState =  this.props.auth.get("state");
        return   (
            <div>
            <Title/>
            <Switch>
              <Route path="/SC/unidad" render={
                ()=>{
                  if(authState!=STATES[2]){
                    return <Main/>
                  }
                  if(authState==STATES[2]){
                    return <Redirect to="/SC/login"/>
                  }
                }
              }/>

              <Route path="/SC/login" render={
                ()=>{
                  if(authState==STATES[1]){
                    return <Redirect to="/SC/"/>
                  }else{
                    return <AuthAreaThemed/>
                  }
                }
              }/>

              <Route render={
                ()=>{
                  if(authState==STATES[2]){
                    return <Redirect to="/SC/login"/>
                  }

                  return <Main/>

                }
              }/>
            </Switch>
            </div>
      )
  }
}
const AppProvider = ()=>(

  <Provider store={store}>
    <ConnectedRouter history={ history}>
      <App/>
    </ConnectedRouter>
  </Provider>

  )


export default AppProvider ;
