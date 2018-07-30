import React from "react"


window.r = React
import {
  push
} from "react-router-redux";
import ApiInstance from "../../elements/API/v1/Api.js"
/**/
import OrderSelect from "./OrderSelect.jsx"
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
//import Button from '@material-ui/core/Button';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DeleteForever from '@material-ui/icons/DeleteForever';
import CloudUpload from '@material-ui/icons/CloudUpload';
import CloudDownload from '@material-ui/icons/CloudDownload';
import CreateNewFolder from '@material-ui/icons/CreateNewFolder';
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
import {getParent,parsePath,tryNormalize,isRoot} from"./Util.js"
//import IconButton from '@material-ui/core/IconButton';
import { withTheme } from '@material-ui/core/styles';
/**/

import {List as ListI,fromJS} from "immutable"
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

//import FileViewer from "../file_viewer"
import mime from "mime-types"

//import ViewExplorer from "./ViewExplorer.js"
import Dropzone from 'react-dropzone'
import Loadable from 'react-loadable';

function Loading(props) {
  if (props.error) {
    return <div>Error! <button onClick={ props.retry }>Retry</button></div>;
  } else {
    return <div>Espere</div>;
  }
} 
const  ViewExplorer = Loadable({
    loader: () =>
      import ('./ViewExplorer.js'),
    loading: Loading
  });

const styles = theme => ({
  headerHelper:{
  	boxShadow:theme.shadows[4],
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
@withTheme()
@withStyles(styles)
@withWidth()
@connect(state=>{ 
	var upload = state.getIn(["explorer","upload"]);
	var path = tryNormalize(parsePath(state.getIn(["router"]).hash));
	var online = state.getIn(["app","online"])
	var currentType = state.getIn(["explorer","currentType"]);
	var toolBar = state.getIn(["explorer","toolBar"]);
	var selection = state.getIn(["explorer","selection"]);
	var selecteds = state.getIn(["explorer","selection","selecteds"]);
	return {upload,online,filter:toolBar.get("filter"),path,currentType,selecteds,isSelecteMode:selection.get("isSelecteMode")}
})
class Explorer extends React.Component{
	constructor(props){
		super(props);
		window.ex = this
		this.state = {items:[],files: []}

		this.tmpItems =new ListI()
	}
	scanFiles(item) {
		//console.warn("sacn",item)
		this.tmpItems = this.tmpItems.push(item)
		//this.setState(p=>({items:[item,...p.items]}))

		if (item.isDirectory) {
			let directoryReader = item.createReader();
			

			directoryReader.readEntries((entries)=> {
				entries.forEach((entry)=> {
					this.scanFiles(entry);
				});
			});
		}
	}
	handleFileSelect(e) {
		var itemsToState = []
		console.warn(e)
		var evt = e;
		evt.stopPropagation();
		evt.preventDefault();
		console.error(evt.dataTransfer.types)
		var items = evt.dataTransfer.items; // FileList object.
		Array.prototype.forEach.call(items, _ => {
			
			//this.tmpItems.push(_.webkitGetAsEntry())
			this.scanFiles(_.webkitGetAsEntry())
			//console.warn(_.webkitGetAsEntry())
		})
		this.setState({items:this.tmpItems.toJS()})
		console.warn(this.tmpItems)
		//this.tmpItems=[]

		return;

		var files = evt.dataTransfer.files; // FileList object.
		Array.prototype.forEach.call(files, _ => {
			console.log(_)
			var f = new FileReader()
			f.onload = x => {
				console.warn(x.target.result)
				var b = new Blob([x.target.result], {
					type: _.type
				})

				window.open(URL.createObjectURL(b))
			}
			f.readAsArrayBuffer(_)

		})
		console.warn(files)
	}

	handleDragOver(e) {
		console.warn(e)
		var evt = e;
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	}
	 onDrop(files) {
	 	console.log(files)
	    this.setState({
	      files
	    });
	  }
	render() {
		const {classes,width,upload,currentType}= this.props

		const position  = (currentType=="folder")?"fixed":"absolute"

		const uploadActive = upload.get("active")
		
		return (
			<div id="Explorer">
				<div style={{position}} id="headerHelper" className={classes.headerHelper}>
					<div className={classes.seccions}>
						<Route path="/SC/unidad" style={{position:"fixed"}}  component={(width=="sm"||width=="xs")?PahtSee2:PahtSee2}/>
					</div>
					<div className={classes.seccions}>
						<ToolBar/>
					</div>
					
				</div>
				<div style={{height:"100px"}} className={classes.toolbar} />
				
				{!uploadActive&&<ViewExplorer/>}
				{uploadActive&&
					 <section>
				        <div className="dropzone">
				          <Dropzone multiple inputProps={{webkitdirectory:true ,directory:true, multiple:true}} onDrop={this.onDrop.bind(this)}>
				            <p>Try dropping some files here, or click to select files to upload.</p>
				          </Dropzone>
				        </div>
				        <aside>
				          <h2>Dropped files</h2>
				          <ul>
				            {
				              this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
				            }
				          </ul>
				        </aside>
				      </section>

					
				}
			</div>
		);
	}
}

export default Explorer
/*<div onDragOver={this.handleDragOver.bind()} onDrop={this.handleFileSelect.bind(this)}>
						Subir
						{this.state.items.map(x=>
							<div>
								{x.fullPath}
							</div>)}
					</div>*/


const stylesToolBar = theme => ({
	toolbar:{
		height:"50px",
		paddingLeft:"10px",
		paddingRight:"10px"
	},
	root:{

		alignItems:"center",
		display:"flex",
		flexGrow:1,
	},
	selection:{

	},
	button: {
    	marginLeft: theme.spacing.unit,
  	},
	actionIcos:{flexGrow:0},
	info:{flexGrow:1},
	order:{
		display:"flex",
		flexGrow:1,
		justifyContent:"flex-end",
		//marginRight:10
	}
})



/**Toolbar Pasar a modulo independiente*/
@connect(state=>{ 
	var upload = state.getIn(["explorer","upload"]);
	var router = state.getIn(["router"]);
	var online = state.getIn(["app","online"])
	var currentType = state.getIn(["explorer","currentType"]);
	var toolBar = state.getIn(["explorer","toolBar"]);
	var selection = state.getIn(["explorer","selection"]);
	var selecteds = state.getIn(["explorer","selection","selecteds"]);
	return {upload,online,filter:toolBar.get("filter"),router,currentType,selecteds,isSelecteMode:selection.get("isSelecteMode")}
})
@withStyles(stylesToolBar,{withTheme:true})
//@withRouter
@withMobileDialog()
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
		if(data.action == "selectemode"){
			this.onChangeSelectMode()
		}
		if(!this.props.online){
			//alert("Se encuentra desconectado para proceder con la accion. Porfavor verifique su conexion a internet o refresque la pagina.")
			return
		}
		if (data.action == "goparent") {

			if (!isRoot(( parsePath(this.props.router.location.hash))) ) {
				store.dispatch(push("/SC/unidad#" + getParent(parsePath(this.props.router.location.hash))))
			}

		}
		if(data.action == "refresh"){
				store.dispatch(fetchingPath(parsePath(this.props.router.location.hash),true))
		}

		if(data.action == "mkdir"){
				store.dispatch({type:"OPEN_MKDIR_DIALOG"})
		}

		if(data.action == "upload"){
			var preState = this.props.upload.get("active")
				store.dispatch({type:"ACTIVE_UPLOAD",payload:{active:!preState}})
		}
		if (data.action == "delete") {
			store.dispatch({
				type: "DELETING_PATHS",
				middle:"EXPLORER",
				payload:{
					listPath:this.props.selecteds.keySeq().toList()
				}
			});
			//this.onChangeSelectMode()
		}
		if(data.action == "download"){
			
			/**Accinador de descargas multiples*/
			DownloadManagerInstance.instance.addDownload(this.props.selecteds.toList());
			this.onChangeSelectMode()
		}

		if (data.action == "downloadFile") {
			ApiInstance
				.instance
				.callOperation("status", {
					path: parsePath(this.props.router.location.hash),
					thenCB: item => {
						console.log("downloadFile", fromJS(item.data))
						DownloadManagerInstance.instance.addDownload(fromJS(item.data));
					},
					catchCB: x => alert(x.errorMsg)
				})
			/**Accinador de descargas multiples*/
			//DownloadManagerInstance.instance.addDownload(this.props.selecteds.toList());
			//this.onChangeSelectMode()
		}

		if(data.action == "copy"){

		}
		if(data.action == "move"){

		}

	}

	createAtionButton(action,CompIcon,title,disabled=false){
		return (
			<Tooltip title={title}>
		 		<IconButton disabled={disabled} color="primary" onClick={(e)=>this.handleAction(e,{action:action})} component="span">
		         	<CompIcon/>
		        </IconButton>				       
 			</Tooltip>
		)
	}

	render(){
		const currentType = this.props.currentType
		const classes = this.props.classes;


		const isSelecteMode = this.props.isSelecteMode
		const selecteds = this.props.selecteds
		var sizeOfSelection = 0;
		const anySelecte = selecteds.count()>0;
		if(anySelecte){
			selecteds.forEach(item=>{
				if(true||item.get("file")){
					sizeOfSelection+=item.get("size")
				}
			})

		}

		const fullScreen = this.props.fullScreen;
		const isroot = isRoot((parsePath(this.props.router.location.hash)));
		
		return (
			 <div id="toolbar" className={classes.toolbar +" "+ classes.root}>
			 	{!isSelecteMode&&
			 	<Fade in={!isSelecteMode}>
				 	<div>
						{
							this.createAtionButton("goparent", ArrowUpward, "Ir a carpeta contenedora",isroot)
						}


						{
							this.createAtionButton("refresh", Refresh, "Actualizar")
						}

						{
							currentType == "folder" &&
								[
									this.createAtionButton("mkdir", CreateNewFolder, "Crear nueva carpeta"), 
									this.createAtionButton("upload", CloudUpload, "Subir"),
									this.createAtionButton("selectemode", SelectAll, "Hacer seleccion")
								]
						}
				 	</div>
				 </Fade>
				}

		        {currentType=="folder"&&
		        <Fade in={currentType=="folder"}>
			        <div className={classes.root} id="folder">
				       
						{!isSelecteMode&&
							<Hidden xsDown>
								<span>
								 <SearchBar
								 	style={{boxShadow:"none"}}
								 	//searchIcon={<span></span>}
								 	//closeIcon={<span></span>}
								    //value={this.state.value}
									placeholder={"Filtrar"}
								   	onChange={(newValue) => this.onFilterChange(newValue)}
								    //onRequestSearch={() => doSomethingWith(this.state.value)}
								  />
						        </span>
					        </Hidden>
				    	}

				    	

				    	{isSelecteMode&&
					        <div id="selection" className={ classes.root +" "+classes.selection }>
						        <Fade in={isSelecteMode}>
							        <div className={classes.root}>
							        		
							        	<div className={classes.root + " " + classes.actionIcos}>
									        
											{
												[
													this.createAtionButton("selectemode", ArrowBack, "Atras"),
													this.createAtionButton("delete", DeleteForever, "Eliminar seleccionados", !anySelecte),
													this.createAtionButton("download", CloudDownload, "Descargar seleccionados", !anySelecte),
												]
											}
									       
									       {false&&<IconButton onClick={(e)=>this.handleAction(e,{action:"copy"})} disabled={!anySelecte} color="primary" component="span">
									          <FilterNone />
									        </IconButton>}

									        {false&&<IconButton onClick={(e)=>this.handleAction(e,{action:"move"})} disabled={!anySelecte} color="primary" component="span">
									          <FlipToFront />
									        </IconButton>}
									 	</div>
								 		<div className={classes.info}>
								 			
								 			<Zoom in={anySelecte} ><Chip label={`${selecteds.count()}  (${filesize(sizeOfSelection)})`}  /></Zoom>
								 			{/*<Typography variant="body2">Selecionados: {selecteds.count()}</Typography>*/}

								 		</div>

							        </div>
							 	</Fade>
					        </div>
					    }

					    <div className={classes.order}>
				    		<div><OrderSelect/></div>
				    	</div>
						
					</div>
				</Fade>
				}
				
				{currentType=="file"&&
				<div id="file">
					<Fade in={currentType=="file"}>
						<div className={classes.root + " " + classes.actionIcos}> 
							{
								[
									this.createAtionButton("downloadFile", CloudDownload, "Descargar"),
								]
							}
						</div>
					</Fade>
				</div>}
	        </div>
	    )
	}


}