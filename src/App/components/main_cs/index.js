import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import NavigationIcon from '@material-ui/icons/Navigation';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import _ from "lodash";
import PropTypes from 'prop-types';
import React from 'react';
//import Index from "../index/index.js"
//import DownloadViewer from "../download_viewer/index.js"
/**/
//import Exprorer2 from "../explorer/Explorer.jsx"
//import Account2 from "../account/index.jsx"
import Loadable from 'react-loadable';
import { withRouter } from 'react-router';
import { Route, Switch } from "react-router-dom";
import logo from "../../../media/img/logop.png";
import Nav from "../nav_cs/index.js";
import SideVarContent from './titleData.js';
import MiniControl from "../index/MiniControl.jsx"
function Loading(props) {
  if (props.error) {
    return <div>Error! <button onClick={props.retry}>Retry</button></div>;
  } else {
    return <div><img src={logo} /></div>;
  }
}
const Exprorer = Loadable({
  loader: () =>
    import('../explorer/Explorer.jsx'),
  loading: Loading
});

const Account = Loadable({
  loader: () =>
    import('../account/index.jsx'),
  loading: Loading
});

const Index = Loadable({
  loader: () =>
    import("../index/index.js"),
  loading: Loading
});


const UploadView = Loadable({
  loader: () =>
    import("../upload_view/UploadView.jsx"),
  loading: Loading
});

const DownloadViewer = Loadable({
  loader: () =>
    import("../download_viewer/index.js"),
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
    height: "auto",
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
  toolbarContent:{
    ...theme.mixins.toolbar,
    display: "flex",
    flexGrow: "1",
    minHeight: "56px",
    alignItems: "flexStart",
    paddingLeft: "24px",
    flexDirection: "column",
    justifyContent: "center",
  },
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
    width: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,

    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 0,

    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing.unit * 0,
      marginLeft: drawerWidth + "px"
    },
    footer: {
      flexGrow: 1,

    },
    rootGrid: { flexGrow: 1, width: "100%", margin: "none" },
    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: 'center',
      color: theme.palette.text.secondary,
    }


  },
});

const getBeforePath = (path, index) => {
  const preRuta = path.split("=")[1].split("\/")
  console.warn(path, index, preRuta)
  return preRuta.slice(0, index + 1)
}


const ButtonLink = withRouter(({ history }) => (
  <Button
    onClick={() => { history.push('/SC/unidad#/') }}
    variant="extendedFab" color="primary" aria-label="delete" >

    <NavigationIcon />
    Mi Unidad
  </Button>

));

@withStyles(styles, { withTheme: true })
class ResponsiveDrawer extends React.Component {
  state = {
    width: 0, height: 0,
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  debounced = _.debounce((width, height) => { this.setState(s => ({ width, height: (height - 64) })) }, 800, { 'maxWait': 1000 });

  render() {
    const { classes, theme } = this.props;

    const drawerContent = (
      <div id="nc">
        <div className={classes.toolbar} >
          {/*<img width="110px" style={{ marginLeft: "60px" }} src={logo} />*/}
          <Grid container alignItems={"flex-start"} justify="center" className={classes.toolbarContent}>
            <Grid item>
              <div><Typography color="textSecondary" variant="title">HHCloud</Typography></div>
            </Grid>
            <Grid item>
              <div><Typography color="textSecondary" variant="body2">Tu nube</Typography></div>
            </Grid>
          </Grid>

        </div>
        <Divider />
        <List><SideVarContent /></List>
        <Divider />
        <MiniControl/>

        {/**<div id="footer" className={classes.footer} >
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
        </div>**/}

      </div>
    );

    return (
      <div className={classes.root}>
        <Nav handleDrawerToggle={this.handleDrawerToggle.bind(this)} />
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

            <Route path="/SC/unidad" component={Exprorer} />

            {/*esta rruta es para ese componente
              en components/nuevo_cs
            */}
            <Route exact path="/SC" component={Index} />
            <Route exact path="/SC/download" component={DownloadViewer} />
            <Route exact path="/SC/upload" component={UploadView} />
            <Route exact path="/SC/account" component={Account} />

            <Route component={() => <div>Andas perdido?</div>} />
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
