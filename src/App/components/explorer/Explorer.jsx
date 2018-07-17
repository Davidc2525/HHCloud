import React from "react"
import {
  push
} from "react-router-redux";

/**/
import SelectAll from '@material-ui/icons/SelectAll';
import TextField from '@material-ui/core/TextField';
import _ from "lodash"
//import IconButton from '@material-ui/core/IconButton';
/**/
import {List as ListI} from "immutable"
import {connect} from "react-redux"
import { BrowserRouter as Router, Route, Link,Redirect,Switch } from "react-router-dom";
import { withRouter } from 'react-router'
import {store} from "../../redux/index.js"
import {parse} from "query-string"
import filesize from "filesize"
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {deletingPath}from "./actions.js"
import {dl,get} from "./middleware.js"
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress'
import LinearProgress from '@material-ui/core/LinearProgress';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';

import FolderIcon from '@material-ui/icons/Folder';
import ArchiveIcon from '@material-ui/icons/Archive';
import FileDownload from '@material-ui/icons/FileDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import {fetchingPath,MIDDLEWARE,FETCHING_PATH} from  "./actions.js"
import { ContextMenu, MenuItem as MenuItemCM, ContextMenuTrigger ,connectMenu} from "react-contextmenu";
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';

import RenameDialog from "./RenameDialog.jsx"
import MoveOrCopyDialog from "./MoveOrCopyDialog.jsx"

import withWidth from '@material-ui/core/withWidth';
import PahtSee1 from "../path_see/index.js"
import PahtSee2 from "../path_see/index2.jsx"

import {DownloadManagerInstance} from "../../elements/download_manager/index.js"
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import  VList from 'react-virtualized/dist/commonjs/List'

import fileExtension from "file-extension"

import FileViewer from "../file_viewer"
import mime from "mime-types"

import ViewExplorer from "./ViewExplorer.js"


const styles = theme => ({
  headerHelper:{
  	height:"100px",
  	width: "-moz-available",
  	width:"-webkit-fill-available",
  	position:"fixed",
  	zIndex:1,
  	padding:"0px",
  	backgroundColor:theme.palette.background.paper,
  	boxSizing: "border-box",
  },
  root: {
  	// overflowY: "scroll",
  	 //boxSizing: "border-box",
  	[theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing.unit * 2,
    },
  	
  	//height:"100%",
    flexGrow: 1,
    
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'start',
    color: theme.palette.text.secondary,
  },
   card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 18,
  },
  pos: {
    marginBottom: 12,
  },
  toolbar: theme.mixins.toolbar,
});


//@withRouter
@withStyles(styles,{withTheme:true})
@withWidth()
class Explorer extends React.Component{


	render() {
		const {classes,width}= this.props
		return (
			<div id="Explorer" >

				<div id="toolbar" className={classes.headerHelper}>
					<Route path="/SC/unidad" style={{position:"fixed"}}  component={(width=="sm"||width=="xs")?PahtSee2:PahtSee2}/>
					
					<ToolBar/>
					
				</div>
				<div style={{height:"100px"}} className={classes.toolbar} />
				
				<ViewExplorer/>
			</div>
		);
	}
}
export default Explorer



@connect(state=>{
	var currentType = state.getIn(["explorer","currentType"]);
	var toolBar = state.getIn(["explorer","toolBar"]);
	var selection = state.getIn(["explorer","selection"]);
	var selecteds = state.getIn(["explorer","selection","selecteds"]);
	return {filter:toolBar.get("filter"),currentType,selecteds,isSelecteMode:selection.get("isSelecteMode")}
})
class ToolBar extends React.Component {
	constructor(props){super(props); window.tb=this}
	

	onFilterChange(e){
		//ViewExplorer.nc()
		var target = e.target;
		this.onFilterChangeDebounce(target)
		//store.dispatch({type:"FILTER_TOOLBAR",payload:{filter:e}})
	}



	componentDidCatch(error, info) {
		window.tb = this
    // Display fallback UI
	    this.setState({ hasError: true,error,info });
	    // You can also log the error to an error reporting service
	    console.warn(error, info);
	  }

	onFilterChangeDebounce=_.debounce((target)=>{
		//console.log(target)
		store.dispatch({type:"FILTER_TOOLBAR",payload:{filter:target.value}})
	},500)

	onChangeSelectMode(){
		
		store.dispatch({type: 'SELECTED_MODE_TOOLBAR',payload:{selecteMode:!this.props.isSelecteMode}})

	}

	render(){
		const isSelecteMode = this.props.isSelecteMode
		const selecteds = this.props.selecteds
		const currentType = this.props.currentType
		//console.warn("isSelecteMode",isSelecteMode,this.props.isSelecteMode)
		return (
			 <div>
		        {currentType=="folder"&&
		        <div id="folder">
			        <IconButton onClick={this.onChangeSelectMode.bind(this)} color="primary" component="span">
			          <SelectAll />
			        </IconButton>
			        {isSelecteMode&& <span><strong>{selecteds.count()}</strong></span>}
					
					{!isSelecteMode&&
					<span>
						<TextField
				          id="search"
				          
				          placeholder={"Filtrar"}
				          type="search"
				          onChange={this.onFilterChange.bind(this)}
				        
				          margin="normal"
			        	/>
			        </span>}
					
				</div>}
				{currentType=="file"&&
				<div id="file">
					toolbar to files
				</div>}
	        </div>
	    )
	}


}