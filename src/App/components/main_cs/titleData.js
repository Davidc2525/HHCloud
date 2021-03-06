//@ts-check
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import FolderSharedIcon from "@material-ui/icons/FolderShared"
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CloudDownload from '@material-ui/icons/CloudDownload';
import CloudUpload from "@material-ui/icons/CloudUpload";
import DashboardIcon from '@material-ui/icons/Dashboard';
import filesize from "filesize";
import React from 'react';
import Loadable from 'react-loadable';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Route } from "react-router-dom";
import { push } from "react-router-redux";
import { UploadManagerInstance } from "../../elements/upload_manager/index.js";
import { store } from "../../redux/index.js";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import {STATES} from "../../elements/auth/state.js"

const style = theme => ({
  button: {
    ...theme.palette.unidadButtom,
    //borderRadius: 3,
    border: 0,
    color: 'white',
    width: "100%",
    height: 48,
    padding: '0 30px',

  },
   buttonBlue: {
     background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
     boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
   },
   buttonPink: {
     background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
     boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
   },
 })


const ButtonLink = withRouter(({ history ,...rest}) => (
  <Button
  {...rest}
   onClick={() => { store.dispatch(push("/SC/unidad#/"))}}
   variant="extendedFab" color="primary" aria-label="unidad" >
    Mi Unidad
  </Button>

));

function Loading(props) {
  if (props.error) {
    return <div>Error! <button onClick={props.retry}>Retry</button></div>;
  } else {
    return <div><Typography variant="body1" gutterBottom>Cargando...</Typography></div>;
  }
}

const MiniControl = Loadable({
  loader: () =>
    import("../index/MiniControl.jsx"),
  loading: Loading
});

const MenuLink = ({ Aicon,label, to, exact=false }) => (
  <Route
    path={to}
    exact={exact}
    children={({ match }) => (
      <ListItem selected={match!=null} button onClick={()=>{
        store.dispatch(push(to))
      }}>
        <ListItemIcon>
          <Aicon />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItem>

    )}
  />
);



/*
dls = store.getState().get("downloads").get("downloads").toJS()

size = Object.keys(dls).map(x=>dls[x]).map(x=>({size:x.payload.size,loaded:x.payload.loaded})).reduce((a,c)=>( a+=c.size),0)

loaded = Object.keys(dls).map(x=>dls[x]).map(x=>({size:x.payload.size,loaded:x.payload.loaded})).reduce((a,c)=>( a+=c.loaded),0)
;

(loaded/size)*100
*/
@connect((state,props)=>{
  var auth = state.get("auth");
  var dl = state.get("downloads").get("downloads")
  var up = state.get("uploads").get("uploads")
  let countUps = up.count();
  var count = dl.count()
  return {countUps,up,count,dl,auth};
})
class SideVarContent extends React.Component{


  getTotalProgressUpload(){
    const total =  UploadManagerInstance.instance.getElementsUploadsCount();
    const loaded = UploadManagerInstance.instance.getElementsUploadedCount();
    return (loaded / total) * 100;
  }

  getTotalProgressDownload(){

      var dls = this.props.dl.toJS();

      var data = Object.keys(dls).map(x=>dls[x]).map(x=>({size:x.payload.size,loaded:x.payload.loaded}));

      var size = data.reduce((a,c)=>( a+=c.size),0);

      var loaded = data.reduce((a,c)=>( a+=c.loaded),0);

      return (loaded / size) * 100;
  }

  getTotalSpeedDownloadDownload() {

    var dls = this.props.dl;

    const speeds = dls.toList().map(x => x.getIn(["speed"]))

    const speedAvg = speeds.reduce((a, n) => (a + n), 0);// / speeds.count();

    return speedAvg;

  }


  render(){

    const {location,history,count,classes,countUps,auth} = this.props;
    const state = auth.get("state");

    return (

      <div>
        
        {state==STATES[1]&&
          <div>
          {/*ir a unidad*/}
            <ListItem>

              <ButtonLink className={classes.button}  {...this.props}/>

            </ListItem>

            {/*inicio*/}
            <MenuLink exact to="/SC/" Aicon={DashboardIcon} label="Control"/>
            {/*<ListItem button onClick={()=>{
              store.dispatch(push("/SC/"))
              }}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Control" />
            </ListItem>*/}

            {/*Perfil*/}
            <MenuLink exact to="/SC/account" Aicon={AccountCircleIcon} label="Cuenta"/>
            {  /*<ListItem button onClick={()=>{
              store.dispatch(push("/SC/account"))
              }}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="cuenta" />
            </ListItem>*/}

            <Divider />
            <MenuLink exact to="/SC/shared-with-me" Aicon={FolderSharedIcon} label="Compatido conmigo"/>
            <Divider />
          </div>}
        
        
        {/*descargas*/}
          {(count>0||state==STATES[1])&&
          <div>
            <ListItem button onClick={()=>{
              store.dispatch(push("/SC/download"))
            }}>
              <ListItemIcon>
                <CloudDownload />
              </ListItemIcon>

              {count>0?
                <ListItemText primary="Descarga" secondary={`${count}, (${filesize(this.getTotalSpeedDownloadDownload())}/s)`} />
              :
              <ListItemText primary="Descarga"  />
              }
            </ListItem>
            {count>0&& <LinearProgress value={this.getTotalProgressDownload()} variant="determinate"/>}

           </div>
          }

        {/*Upload*/}
        {state==STATES[1]&&<div>
          <ListItem button onClick={()=>{
            store.dispatch(push("/SC/upload"))
          }}>
            <ListItemIcon>
              <CloudUpload />
            </ListItemIcon>

            {countUps>0?
              <ListItemText primary="Subida" secondary={`${countUps}, (${UploadManagerInstance.instance.getElementsUploadsCount()}, ${UploadManagerInstance.instance.getElementsUploadedCount()})`} />
            :
            <ListItemText primary="Subida"  />
            }
          </ListItem>
          {countUps>0&& <LinearProgress value={this.getTotalProgressUpload()} variant="determinate"/>}
        <Divider/>
        <MiniControl/>
        </div>}

      </div>
      )
  }
}
SideVarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default (withRouter(withStyles(style,{withTheme:true})(SideVarContent)))


