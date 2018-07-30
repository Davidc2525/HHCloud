import {store,history} from "./redux/index.js"
import DownloadManager from "./elements/download_manager/index.js"
import React from "react"
import { Provider ,connect} from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
//console.log(store)
window.df = require("dateformat")
import Auth from "./elements/auth/index.js"

import { withRouter } from 'react-router-dom'

import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
  push
} from "react-router-redux";
//import style from "./css/main.css"
//import Nav from "./components/Nav/index.js"

import Home from "./components/main_cs/index.js"


 //import('semantic-ui-css/semantic.min.css');
//import { Button ,Menu} from 'semantic-ui-react'
import {  browserHistory } from 'react-router';
import { BrowserRouter as Router, Route, Link,Redirect,Switch } from "react-router-dom";
import Loadable from 'react-loadable';
import red from '@material-ui/core/colors/red';

// import Button from '@material-ui/core/Button';
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
    <MuiThemeProvider theme={!true?light:dark}>
     <Route component={Home}/>
    </MuiThemeProvider>

  )


@withRouter
@connect((state,props)=>({auth:state.get("auth")}))
class App extends React.Component{

  render(){
        return   (
            <Switch>
              <Route exact path="/SC/login" render={(props)=>
               {
                return (
                 this.props.auth.get("isLogin") ? (console.warn(props),
                     <Redirect
                      to={props.location.state.from/*{
                        pathname: props.location.state.from.pathname,
                        hash:props.location.state.from.hash,
                        //state:props.state
                      }*/}
                    />
                  ) : (
                    <div>login
                    <br/>
                    <strong onClick={_=>Auth.Auth.googleSigIn()}>inisiar session con google</strong>
                    <br/>
                    <strong onClick={_=>Auth.Auth.gitHubSigIn()}>inisiar session con github</strong>
                    <br/>
                    <strong onClick={_=>Auth.Auth.facebookSigIn()}>inisiar session con facebook</strong>
                    </div>
                  )
                ) 
               }
              } /> 
              <Route
                
                render={props =>
                  this.props.auth.get("isLogin") ? (
                    <Main/>
                  ) : (
                    <Redirect
                      to={{
                        pathname: "/SC/login",
                        state: { from: props.location }
                      }}
                    />
                  )
                }
              />

            </Switch>
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
