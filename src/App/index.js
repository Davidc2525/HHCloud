import Auth from "./elements/auth/index.js"
import DownloadManager from "./elements/download_manager/index.js"
import React from "react"
import { Provider ,connect} from 'react-redux'
import {store,history} from "./redux/index.js"
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
//console.log(store)

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
const theme = createMuiTheme({
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
    type: true ?"dark":'light', // Switching the dark mode on is a single property value change.
    status: {
      danger: 'orange',
    }
  },
 
});

const Main =()=>(
    <MuiThemeProvider theme={theme}>
     <Route component={Home}/>
    </MuiThemeProvider>

  )


@withRouter
@connect((state,props)=>({auth:state.get("auth")}))
class App extends React.Component{

  render(){
        return   (
            <Switch>
              <Route exact path="/login" render={()=>
               {
                return (
                 this.props.auth.get("isLogin") ? (
                     <Redirect
                      to={{
                        pathname: "/",
                       // state: { from: props.location }
                      }}
                    />
                  ) : (
                    <div>login </div>
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
                        pathname: "/login",
                        //state: { from: props.location }
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
