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
import { mailFolderListItems, otherMailFolderListItems } from './titleData.js';
import SideVarContent from './titleData.js';
 import { BrowserRouter as Router, Route, Link,Redirect,Switch } from "react-router-dom";
 import Exprorer from "../explorer/index.js"
import Chip from '@material-ui/core/Chip';
import Nav from "../nav_cs/index.js"
import NavigationIcon from '@material-ui/icons/Navigation';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router'

import logo from "../../../media/img/logop.png"
import Nuevo from "../nuevo_cs/index.js"
import PahtSee from "../path_see/index.js"

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
   button: {
    margin: theme.spacing.unit,
  },
  appBar: {
    position: 'absolute',
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
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
  	//backgroundColor:"grey",
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    width:"98%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 0,
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing.unit * 2,
    },

   
  },
});

const getBeforePath = (path,index)=>{
  const preRuta = path.split("=")[1].split("\/")
  console.warn(path,index,preRuta)
  return preRuta.slice(0,index+1)
}


const ButtonLink = withRouter(({ history }) => (
  <Button 
   onClick={() => { history.push('/unidad#/') }}
   variant="extendedFab" color="primary" aria-label="delete" >
    
    <NavigationIcon  />
    Mi Unidad
  </Button>
 
));

class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes, theme } = this.props;

    const drawer = (
      <div id="nc">
        <div className={classes.toolbar} >
          <img width="110px" style={{marginLeft:"60px"}} src={logo}/>
        </div>
        <Divider />
        
        <ButtonLink/>
        
        <Divider />
        <List><SideVarContent/></List>
        <Divider />
        <List>{otherMailFolderListItems}</List>
      </div>
    );

    return (
      <div className={classes.root}>
      	<Nav handleDrawerToggle={this.handleDrawerToggle.bind(this)}/>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          > 
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>

        <main className={classes.content}>
          <div className={classes.toolbar} />
             
             <Route path="/unidad" component={PahtSee}/>
           
            
            <Switch>

                <Route path="/unidad" component={Exprorer}/>
                <Route exact path="/" render={()=><div>Inicio</div>}/>
                {/*esta rruta es para ese componente
                    en components/nuevo_cs
                */}
                <Route exact path="/nuevo" component={Nuevo}/>
                <Route exact path="/downloads" render={()=>
                  <div>Descargas </div>
                }/>

            </Switch>
        </main>
      </div>
    );
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);