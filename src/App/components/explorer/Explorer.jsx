//@ts-check
import Chip from '@material-ui/core/Chip';
import Fade from '@material-ui/core/Fade';
import Hidden from '@material-ui/core/Hidden';
import Button from "@material-ui/core/Button"
import IconButton from '@material-ui/core/IconButton';
//import IconButton from '@material-ui/core/IconButton';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
//import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid"
import withMobileDialog from '@material-ui/core/withMobileDialog';
import withWidth from '@material-ui/core/withWidth';
import Zoom from '@material-ui/core/Zoom';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import CloudDownload from '@material-ui/icons/CloudDownload';
import CloudUpload from '@material-ui/icons/CloudUpload';
import CreateNewFolder from '@material-ui/icons/CreateNewFolder';
import DeleteForever from '@material-ui/icons/DeleteForever';
import FilterNone from '@material-ui/icons/FilterNone';
import FlipToFront from '@material-ui/icons/FlipToFront';
import Refresh from '@material-ui/icons/Refresh';
import SelectAll from '@material-ui/icons/SelectAll';

import BlurCircular from '@material-ui/icons/BlurCircular';
import BlurOff from '@material-ui/icons/BlurOff';
import BlurOn from '@material-ui/icons/BlurOn';
import Flip from '@material-ui/icons/Flip';


import filesize from "filesize";
/**/
import { fromJS, List as ListI } from "immutable";
import _ from "lodash";
import SearchBar from 'material-ui-search-bar';
import React from "react";
import {findDOMNode} from "react-dom";
//import ViewExplorer from "./ViewExplorer.js"
import Dropzone from 'react-dropzone';
import Loadable from 'react-loadable';
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { push } from "react-router-redux";
import ApiInstance from "../../elements/API/v1/Api.js";
import { DownloadManagerInstance } from "../../elements/download_manager/index.js";
import {UploadManagerInstance} from "../../elements/upload_manager/index.js";
import { UploaderSelect} from "./UploaderSelect.jsx";
import { store } from "../../redux/index.js";
import PahtSee2 from "../path_see/index2.jsx";
import { fetchingPath, activeUpload, selectedModeToolbar, deletingPaths, filterToolBar} from "./actions.js";
/**/
import OrderSelect from "./OrderSelect.jsx";
import { getParent, isRoot, parsePath, tryNormalize } from "./Util.js";
import { ItemUpload } from '../../elements/upload_manager/ItemUpload.js';
import Popover from '@material-ui/core/Popover';

const icoms = require("@material-ui/icons");

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
	

const toFileList = (files :FileList):File[]=>{
	let fileList:File[] = [];
	for(let x = 0;x<files.length;x++){
		fileList.push(files.item(x));
	}
	return fileList;
}

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
	button: {
		margin: theme.spacing.unit,
	},
	input: {
		display: 'none',
	},
});




//@withRouter
//@ts-ignore
@withTheme()
@withStyles(styles)
@withWidth()
@connect(state=>{
	var upload = state.getIn(["explorer","upload"]);
	var path = tryNormalize(parsePath(state.getIn(["router"]).location.hash));
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
		//window.ex = this
		this.state = {items:[],files: []}

		this.tmpItems = new ListI();
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
		console.log(this.props.path,files)
			this.setState(p=>({files:[...p.files,...files]}));
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
				<div>
					{false&&Object.keys(icons).map(x=>RenderIcon(x,icons[x]))}
				</div>
				<ViewExplorer/>
				
			</div>
		);
	}
}

const RenderIcon = (dn,Name) => <div><Name/><strong>{dn}</strong></div>

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
//@ts-ignore
@connect(state=>{
	var hashPath = state.getIn(["router"]).location.hash;
	try{
		hashPath = decodeURIComponent(hashPath)
	}catch(e){
		console.error(e)
	}
	var path = tryNormalize(parsePath(hashPath));
	var upload = state.getIn(["explorer","upload"]);
	var router = state.getIn(["router"]);
	var online = state.getIn(["app","online"])
	var currentType = state.getIn(["explorer","currentType"]);
	var toolBar = state.getIn(["explorer","toolBar"]);
	var selection = state.getIn(["explorer","selection"]);
	var selecteds = state.getIn(["explorer","selection","selecteds"]);
	var payloadInPath = state.getIn(["explorer","paths",path,"payload"],null);
	return {path,payloadInPath,upload,online,filter:toolBar.get("filter"),router,currentType,selecteds,isSelecteMode:selection.get("isSelecteMode")}
})
@withStyles(stylesToolBar,{withTheme:true})
//@withRouter
@withMobileDialog()
class ToolBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			anchorEl: null,
		}
		//window.tb = this
	}


	onFilterChange(e){
		//ViewExplorer.nc()
		//var target = e.target.value;
		var value = e;
		this.onFilterChangeDebounce(value)
		//store.dispatch({type:"FILTER_TOOLBAR",payload:{filter:e}})
	}

	onFilterChangeDebounce = _.debounce((value)=>{
		//console.log(target)
		store.dispatch(filterToolBar(value));
	},500)

	onChangeSelectMode(){

		//store.dispatch({type: 'SELECTED_MODE_TOOLBAR',payload:{selecteMode:!this.props.isSelecteMode}})
		//store.dispatch({ type: "ADD_ITEMS_SELECTION", payload: { items:this.props.payloadInPath, itemSelected:false} })

		store.dispatch(selectedModeToolbar(!this.props.isSelecteMode));

	}

	/**
	 * manejador de acciones de ToolBar
	 */
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
			this.setState({
				anchorEl: event.currentTarget,
			});
			var preState = this.props.upload.get("active")
				store.dispatch(activeUpload(!preState))
		}

		if (data.action == "delete") {
			store.dispatch(deletingPaths(this.props.selecteds.keySeq().toList()));
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
						console.log("downloadFile", fromJS(item.payload))
						DownloadManagerInstance.instance.addDownload(fromJS(item.payload));
					},
					catchCB: x => alert(x.errorMsg)
				})
			/**Accinador de descargas multiples*/
			//DownloadManagerInstance.instance.addDownload(this.props.selecteds.toList());
			//this.onChangeSelectMode()
		}


		if(data.action == "invertselection"){
			//store.dispatch(selectedModeToolbar(true));

			store.dispatch({ type: "INVERT_SELECTION_TOOLBAR", payload: { items:this.props.payloadInPath } })
		}

		if(data.action == "deselectall"){
			store.dispatch(selectedModeToolbar(true));
		}

		if(data.action == "selectall"){

			store.dispatch({ type: "ADD_ITEMS_SELECTION", payload: { items:this.props.payloadInPath, itemSelected:true} })

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
	handleClickAway = () => {
		store.dispatch(activeUpload(false))
	};
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
		const uploadActive = this.props.upload.get("active");
		const {anchorEl} = this.state;
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
								 this.createAtionButton("selectemode", SelectAll, "Hacer seleccion"),
								 this.createAtionButton("mkdir", CreateNewFolder, "Crear nueva carpeta"),
								 <span>
								
										{this.createAtionButton("upload", CloudUpload, "Subir")}
										 <Popover
											 id="simple-popper"
											 open={uploadActive}
											 anchorEl={anchorEl}
											 onClose={this.handleClickAway}
											 anchorOrigin={{
												 vertical: 'bottom',
												 horizontal: 'center',
											 }}
											 transformOrigin={{
												 vertical: 'top',
												 horizontal: 'center',
											 }}
										 >
											<UploaderSelect/>
										 </Popover>
									
									</span>,
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
															this.createAtionButton("selectall", BlurOn, "Seleccionar todo"),
															this.createAtionButton("deselectall", BlurOff, "No seleccionar ninguno", !anySelecte),
															this.createAtionButton("invertselection", Flip, "Invertir seleccion", !anySelecte),
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
