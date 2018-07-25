import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import {connect} from "react-redux"


import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
//import { mailFolderListItems, otherMailFolderListItems } from './titleData.js';
 
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
    position: 'fixed',
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
  
  const app = store.get("app");
  const auth = store.get("auth");

  return {app,auth}

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

  render() {
    const { classes, theme } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const auth = this.props.auth;
    const dataUser = auth.get("dataUser",null);
    var displayName = "";
    if(dataUser!=null){
      displayName = dataUser.get("displayName")
    }

    return (
     
       <div>
          <AppBar color="primary" className={classes.appBar}>

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
              <Typography variant="title" color="inherit"  noWrap>
                {this.props.app.get("name")}
              </Typography>
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
                  <MenuItem onClick={this.handleClose}>Inicio</MenuItem>
                  <MenuItem onClick={this.handleClose}>{displayName}</MenuItem>
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