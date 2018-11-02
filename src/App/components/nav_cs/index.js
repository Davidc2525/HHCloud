import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloudOff from '@material-ui/icons/CloudOff';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import {connect} from "react-redux"
import { push } from "react-router-redux";
import AccountCircle from '@material-ui/icons/AccountCircle';
import Dashboard from '@material-ui/icons/Dashboard';
import DataUsage from '@material-ui/icons/DataUsage';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
//import { mailFolderListItems, otherMailFolderListItems } from './titleData.js';
import { auth } from "../../elements/auth/index"
import { STATES } from "../../elements/auth/state"
import {Login} from "../login/Login.jsx"
const drawerWidth = 240;

const styles = theme => (window.theme=theme,{
  root: {
    flexGrow: 1,

    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    backgroundColor:theme.palette.primary[theme.palette.type],
    //position: 'fixed',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  flex: {
    flex: 1,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
  	//backgroundColor:"grey",
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});


@withStyles(styles,{withTheme:true})
@connect((store, props) => {
  const currentType = store.get("explorer").get("currentType")
  const app = store.get("app");
  const auth = store.get("auth");

  return {app,auth,currentType}

})
class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false,
     auth: true,
    anchorEl: null,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };



  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleEvent = (event,action) => {
     switch(action.type){
       case "gohome":
        this.props.dispatch(push("/SC/"))
       break;
       case "gounity":
        this.props.dispatch(push("/SC/unidad#/"))
       break;
       case "goaccount":
         this.props.dispatch(push("/SC/account"))
       break;
       case "closesession":
         auth.Auth.signOut()
       break;

       default:
       break;
     }
  }
  render() {
    const { classes, theme,currentType} = this.props;
    const { anchorEl } = this.state;
    const appName = this.props.app.get("name");
    const isOnline = this.props.app.get("online");
    const title = this.props.app.get("title");

    const open = Boolean(anchorEl);
    const auth = this.props.auth;
    const isLogin = auth.get("state")==STATES[1];
    const dataUser = auth.getIn(["dataUser","user"],null);
    var displayName = "";
    if(dataUser!=null){
      displayName = dataUser.get("lastName")+" "+dataUser.get("firstName")
    }
    displayName = displayName.capitalize(true);

    const position  = (currentType=="folder")?"fixed":"absolute"

    return (

       <div>
         <AppBar style={{position}} color="primary" className={classes.appBar}>

           <Toolbar>
             <IconButton
               color="inherit"
               aria-label="open drawer"
               onClick={this.props.handleDrawerToggle}
               className={classes.navIconHide}
             >
               <MenuIcon />
             </IconButton>

             <div className={classes.flex}>
               <Grid container spacing={8}>
              { <Grid item>
                <Typography variant="title" color="inherit"  noWrap>
                 {title}
                </Typography>
               </Grid>}

                 {
                  !isOnline&&
                   <Grid item style={{padding:0}}>

                    <Chip
                      avatar={
                        <Avatar>
                          <CloudOff/>
                        </Avatar>
                      }
                      label="Sin conexion"
                      //onClick={handleClick}
                      //onDelete={handleDelete}
                      //className={classes.chip}
                    />
                   </Grid>
                  }
               </Grid>
             </div>

             <div>
               <IconButton
                 aria-owns={open ? 'menu-appbar' : null}
                 aria-haspopup="true"
                 onClick={this.handleMenu}
                 color="inherit"
               >
                 <AccountCircle />
               </IconButton>
               <Menu
                 id="menu-appbar"
                 anchorEl={anchorEl}
                 anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                 }}
                 transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                 }}
                 open={open}
                 onClose={this.handleClose}
               >
                {isLogin&&
                  [                   
                    <MenuItem onClick={event=>this.handleEvent(event,{type:"gohome"})}>
                      <ListItemIcon className={classes.icon}>
                        <Dashboard />
                      </ListItemIcon>
                      Inicio
                    </MenuItem>,
                    <MenuItem onClick={event=>this.handleEvent(event,{type:"gounity"})}>
                      <ListItemIcon className={classes.icon}>
                        <DataUsage />
                      </ListItemIcon>
                      Mi unidad
                    </MenuItem>,
                    <MenuItem onClick={event=>this.handleEvent(event,{type:"goaccount"})}>
                      <ListItemIcon className={classes.icon}>
                        <AccountCircle />
                      </ListItemIcon>
                      {displayName}
                    </MenuItem>,
                    <MenuItem onClick={event=>this.handleEvent(event,{type:"closesession"})}>
                      <ListItemIcon className={classes.icon}>
                        <ExitToApp />
                      </ListItemIcon>
                      Cerrar session
                    </MenuItem>
                 ]
                }

                {!isLogin&&<div style={{width:"330px",padding:"25px"}}><Login/></div>}
                </Menu>


            </div>


          </Toolbar>
        </AppBar>
       </div>


    );
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default ResponsiveDrawer
