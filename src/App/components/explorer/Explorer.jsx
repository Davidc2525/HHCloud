import React from "react"
import {
  push
} from "react-router-redux";

/**/
import Fade from '@material-ui/core/Fade';

import DeleteForever from '@material-ui/icons/DeleteForever';
import CloudDownload from '@material-ui/icons/CloudDownload';
import Refresh from '@material-ui/icons/Refresh';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import SelectAll from '@material-ui/icons/SelectAll';
import ArrowBack from '@material-ui/icons/ArrowBack';
import TextField from '@material-ui/core/TextField';
import _ from "lodash"
import SearchBar from 'material-ui-search-bar'
import Hidden from '@material-ui/core/Hidden';
import FilterNone from '@material-ui/icons/FilterNone';
import FlipToFront from '@material-ui/icons/FlipToFront';
import Chip from '@material-ui/core/Chip';
import Zoom from '@material-ui/core/Zoom';
import {getParent,parsePath} from"./Util.js"
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
  	display:"flex",
  	flexDirection:"column",
  	height:"100px",
  	//width: "-moz-available",
  	//width:"-webkit-fill-available",
  	position:"fixed",
  	zIndex:1,
  	padding:"0px",
  	backgroundColor:theme.palette.background.paper,
  	boxSizing: "border-box",
  	[theme.breakpoints.up('xs')]: {
      width: `100%`,
    },
  	[theme.breakpoints.up('md')]: {
      width: `calc(100% - 240px)`,
    },
  },
  seccions:{
  	height:"50px"
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

				<div id="headerHelper" className={classes.headerHelper}>
					<div className={classes.seccions}>
						<Route path="/SC/unidad" style={{position:"fixed"}}  component={(width=="sm"||width=="xs")?PahtSee2:PahtSee2}/>
					</div>
					<div className={classes.seccions}>
						<ToolBar/>
					</div>
					
				</div>
				<div style={{height:"100px"}} className={classes.toolbar} />
				
				<ViewExplorer/>
			</div>
		);
	}
}
export default Explorer



const stylesToolBar = theme => ({
	root:{
		alignItems:"center",
		display:"flex",
		flexGrow:1,
	},
	selection:{

	},
	actionIcos:{flexGrow:0},
	info:{flexGrow:1}
})



@connect(state=>{ 
	var router = state.getIn(["router"]);
	var currentType = state.getIn(["explorer","currentType"]);
	var toolBar = state.getIn(["explorer","toolBar"]);
	var selection = state.getIn(["explorer","selection"]);
	var selecteds = state.getIn(["explorer","selection","selecteds"]);
	return {filter:toolBar.get("filter"),router,currentType,selecteds,isSelecteMode:selection.get("isSelecteMode")}
})
@withStyles(stylesToolBar,{withTheme:true})
//@withRouter
class ToolBar extends React.Component {
	constructor(props) {
		super(props);

		window.tb = this
	}
	

	onFilterChange(e){
		//ViewExplorer.nc()
		//var target = e.target.value;
		var value = e;
		this.onFilterChangeDebounce(value)
		//store.dispatch({type:"FILTER_TOOLBAR",payload:{filter:e}})
	}



	onFilterChangeDebounce=_.debounce((value)=>{
		//console.log(target)
		store.dispatch({type:"FILTER_TOOLBAR",payload:{filter:value}})
	},500)

	onChangeSelectMode(){
		
		store.dispatch({type: 'SELECTED_MODE_TOOLBAR',payload:{selecteMode:!this.props.isSelecteMode}})

	}

	handleAction(event,data){
		if(data.action == "goparen"){
			store.dispatch(push("/SC/unidad#"+getParent( parsePath(this.props.router.location.hash)  )))
		}	
		if(data.action == "refresh"){
				store.dispatch(fetchingPath(parsePath(this.props.router.location.hash)))
		}
		if(data.action == "selectemode"){
			this.onChangeSelectMode()
		}
		if(data.action == "delete"){

		}
		if(data.action == "download"){

		}
		if(data.action == "copy"){

		}
		if(data.action == "move"){

		}

	}

	render(){
		const isSelecteMode = this.props.isSelecteMode
		const selecteds = this.props.selecteds
		const currentType = this.props.currentType
		const classes = this.props.classes;

		const anySelecte = selecteds.count()>0
		//console.warn("isSelecteMode",isSelecteMode,this.props.isSelecteMode)
		return (
			 <div className={classes.root}>
			 	{!isSelecteMode&&
			 	<Fade in={!isSelecteMode}>
				 	<div>
				 		<IconButton onClick={(e)=>this.handleAction(e,{action:"goparen"})} color="primary" component="span">
				          <ArrowUpward />
				        </IconButton>

				         <IconButton onClick={(e)=>this.handleAction(e,{action:"refresh"})} color="primary" component="span">
				          <Refresh />
				        </IconButton>

				        {currentType=="folder"&&
				        <IconButton onClick={(e)=>this.handleAction(e,{action:"selectemode"})} color="primary" component="span">
				          <SelectAll />
				        </IconButton>
				    	}
				 	</div>
				 </Fade>
				}

		        {currentType=="folder"&&
		        <div className={classes.root} id="folder">
			        {isSelecteMode&&
			        <div id="selection" className={ classes.root +" "+classes.selection }>
				        <Fade in={isSelecteMode}>
					        <div className={classes.root}>
					        		
					        	<div className={classes.root + " " + classes.actionIcos}>
							        
						        	
						            <IconButton onClick={(e)=>this.handleAction(e,{action:"selectemode"})}  color="primary" component="span">
							          <ArrowBack />
							        </IconButton>	

							 		<IconButton onClick={(e)=>this.handleAction(e,{action:"delete"})} disabled={!anySelecte} color="primary" component="span">
							          <DeleteForever />
							        </IconButton>
							        
							        <IconButton onClick={(e)=>this.handleAction(e,{action:"download"})} disabled={!anySelecte} color="primary" component="span">
							          <CloudDownload />
							        </IconButton>
							        
							        <IconButton onClick={(e)=>this.handleAction(e,{action:"copy"})} disabled={!anySelecte} color="primary" component="span">
							          <FilterNone />
							        </IconButton>

							        <IconButton onClick={(e)=>this.handleAction(e,{action:"move"})} disabled={!anySelecte} color="primary" component="span">
							          <FlipToFront />
							        </IconButton>
							 	</div>
						 		<div className={classes.info}>
						 			
						 			  {<Zoom in={anySelecte} ><Chip label={selecteds.count()}  /></Zoom>}
						 			{/*<Typography variant="body2">Selecionados: {selecteds.count()}</Typography>*/}

						 		</div>

					        </div>
					 	</Fade>
			        </div>}


					
					{!isSelecteMode&&
					<Hidden xsDown>
						<span>
						 <SearchBar
						 	style={{height:"35px"}}
						 	searchIcon={<span></span>}
						 	closeIcon={<span></span>}
						    //value={this.state.value}
							placeholder={"Filtrar"}
						   	onChange={(newValue) => this.onFilterChange(newValue)}
						    //onRequestSearch={() => doSomethingWith(this.state.value)}
						  />
				        </span>
			        </Hidden>
			    	}
					
				</div>}
				{currentType=="file"&&
				<div id="file">
					toolbar to files
				</div>}
	        </div>
	    )
	}


}