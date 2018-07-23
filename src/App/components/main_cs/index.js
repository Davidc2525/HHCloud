import React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
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
import Chip from '@material-ui/core/Chip';
import Nav from "../nav_cs/index.js"
import NavigationIcon from '@material-ui/icons/Navigation';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router'
import _ from "lodash"
import logo from "../../../media/img/logop.png"
import Nuevo from "../nuevo_cs/index.js"
import DownloadViewer from "../download_viewer/index.js"
import PahtSee from "../path_see/index.js"
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
/**/

import Exprorer from "../explorer/Explorer.jsx"

 
import Loadable from 'react-loadable';
function Loading(props) {
  if (props.error) {
    return <div>Error! <button onClick={ props.retry }>Retry</button></div>;
  } else {
    return <div><img src={logo}/></div>;
  }
} 
const  Exprorer2 = Loadable({
    loader: () =>
      import ('../explorer/Explorer.jsx'),
    loading: Loading
  });

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    
    zIndex: 1,
    //flexDirection:"column",
    position: 'relative',
    display: 'flex',
    height:"auto",
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
      position: 'fixed',
    },
  },
  content: {
    boxSizing: "border-box",
   
    //height: "100%",
    width:"100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,

    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 0,
      
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing.unit * 0,
      marginLeft:drawerWidth+"px"
    },
    footer: {
      flexGrow: 1,

    },
    rootGrid:{flexGrow:1,width:"100%",margin:"none"},
    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: 'center',
      color: theme.palette.text.secondary,
    }

   
  },
});

const getBeforePath = (path,index)=>{
  const preRuta = path.split("=")[1].split("\/")
  console.warn(path,index,preRuta)
  return preRuta.slice(0,index+1)
}


const ButtonLink = withRouter(({ history }) => (
  <Button 
   onClick={() => { history.push('/SC/unidad#/') }}
   variant="extendedFab" color="primary" aria-label="delete" >
    
    <NavigationIcon  />
    Mi Unidad
  </Button>
 
));

@withStyles(styles, { withTheme: true })
class ResponsiveDrawer extends React.Component {
  state = {
    width:0,height:0,
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  debounced = _.debounce((width,height)=>{ this.setState(s=>({width,height:(height-64)})) }, 800, { 'maxWait': 1000 });

  render() {
    const { classes, theme } = this.props;

    const drawerContent = (
      <div id="nc">
        <div className={classes.toolbar} >
          <img width="110px" style={{marginLeft:"60px"}} src={logo}/>
        </div>
        <Divider />
        
       
        
        <Divider />
        <List><SideVarContent/></List>
        <Divider />
        <List>{otherMailFolderListItems}</List>
           {/*<div id="footer" className={classes.footer} >
              <div className={classes.footer}>
                <Grid className={classes.rootGrid} container justify="center" >

                    <Grid item xs={12}>
                      <Paper className={classes.paper}>xs=12</Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper className={classes.paper}>xs=12 sm=6</Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper className={classes.paper}>xs=12 sm=6</Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper className={classes.paper}>xs=6 sm=3</Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper className={classes.paper}>xs=6 sm=3</Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper className={classes.paper}>xs=6 sm=3</Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper className={classes.paper}>xs=6 sm=3</Paper>
                    </Grid>



                </Grid>
              </div>
            </div>*/}

      </div>
    );

    return (
      <div className={classes.root}>
      	<Nav handleDrawerToggle={this.handleDrawerToggle.bind(this)}/>
        <Hidden mdUp>
          <SwipeableDrawer

            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            onOpen={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          > 
            {drawerContent}
          </SwipeableDrawer>
        </Hidden>

        <Hidden smDown implementation="css">
          <SwipeableDrawer

            id={"drawer"}
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawerContent}
          </SwipeableDrawer>
        </Hidden>

        <main id="Content" className={classes.content}>
          <div className={classes.toolbar} />
       {/* <ReactResizeDetector  handleHeight  onResize={this.debounced.bind(this)}>
                
               </ReactResizeDetector>
       */}
        
             
           
            
            <Switch>

                <Route path="/SC/unidad" component={Exprorer}/>
                <Route exact path="/SC" render={()=><div>Inicio</div>}/>
                {/*esta rruta es para ese componente
                    en components/nuevo_cs
                */}
                <Route exact path="/SC/nuevo" component={Nuevo}/>
                <Route exact path="/SC/download" component={DownloadViewer}/>

                <Route  component={()=><div>Andas perdido?</div>}/>
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

export default ResponsiveDrawer