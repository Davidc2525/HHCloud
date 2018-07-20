import React from "react"
import {
  push
} from "react-router-redux";
import {tryNormalize,parsePath} from "./Util.js"
import {Map,List as ListI} from "immutable"
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

import DirectoryList from "./DirectoryList.jsx"
import DirectoryListVirtualize from "./DirectoryListVirtualize.jsx"
import fileExtension from "file-extension"

//import FileViewer from "../file_viewer"
import mime from "mime-types"
import Loadable from 'react-loadable';
function Loading(props) {
  if (props.error) {
    return <div>Error! <button onClick={ props.retry }>Retry</button></div>;
  } else {
    return <div>Espere</div>;
  }
} 
const  FileViewer = Loadable({
    loader: () =>
      import ('../file_viewer'),
    loading: Loading
  });

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


@withRouter
@withStyles(styles,{withTheme:true})
@withWidth()
@connect((state,props)=>{
	var currentType = state.getIn(["explorer","currentType"]);
	var p = props.location.hash;
	var currentPath = tryNormalize(parsePath(p))//;p.substring(p.indexOf("#")+1);//props.location.hash.split("#")[1];//parse(props.location.search).path
		currentPath = decodeURI(currentPath)
	let explorer = state.get("explorer");
	let paths = explorer.get("paths");
	//let path = paths.get(props.location.search)

	if (!paths.has(currentPath)) {
		//console.log("get path "+currentPath)
		store.dispatch(fetchingPath(currentPath,true))
		
		return {
			paths: paths.toArray(),
			path: new Map({status:"loading",path:currentPath}),
			explorer: state.get("explorer")
		}


	}
	var path = paths.get(currentPath);
	if (currentType != (path.get("file") ? "file" : "folder") ) {

		store.dispatch({type:"CURRENT_TYPE_EXPLORER",payload:{type:path.get("file")?"file":"folder"}})

	}

	return {
		paths: paths.toArray(),  
		path: path,
		explorer: state.get("explorer")
	}

})
class ViewExplorer extends React.Component {


 
	constructor(props) {

		super(props)
 	

	}

	handleCloseDialog(){
		store.dispatch({type:"CLOSE_RENAME_DIALOG"})
		//this.setState(s=>({renamedialog:false}))
	}

	render(){
		//console.error(this.props)
		const {classes,width}=this.props

		return (

			<div id="ViewExplorer">
				
				{/**Dialogo de cambio de nombre*/}
				<RenameDialog />


				{/**Dialogo de mover o copiar ruta <MoveOrCopyDialog />*/}
				<MoveOrCopyDialog />
				

				{/*<div className={classes.headerHelper}>
					<Route path="/SC/unidad" style={{position:"fixed"}}  component={(width=="sm"||width=="xs")?PahtSee2:PahtSee1}/>
					cosas
					
				</div>
				<div style={{height:"100px"}} className={classes.toolbar} />
				*/}
           
			
			
			
	          	{/*this.props.paths.map(x=>
	          		<div>
	          	 		{<Link to={`/SC/unidad#${x.get("path")}`} >{x.get("path")}</Link>} 
	          	 	</div>
	          	 )*/}

	          	 {this.props.path!=null&&
	          	 	<div /*style={{height:this.props.h-(32)}}*/   className={classes.root}>
				 	
					 	{this.props.path.get("status")=="loading" &&
				 			<Grid style={{ height: "100%"}} direction="column" justify="center" alignItems="center" container>
				 	 			<Grid item>

				 	 			 	<Typography color="textSecondary" variant="subheading" >
					           			{this.props.path.get("path")}
					         		</Typography>
					          	</Grid>
					          	<br/>
				 	 			<Grid item><CircularProgress /></Grid>
				 	 		</Grid>	
				 		}
				 		
				 		{this.props.path.get("status")=="error" && 
				 			
				 			<Grid style={{ height: "100%"}} direction="column" justify="center" alignItems="center" container>
				 	 			<Grid item>
				 	 			 	<Typography variant="headline" component="h2" style={{cursor:"pointer"}}   noWrap={true} className={classes.title} >
				            			error name: {this.props.path.get("error")}, mensaje: {this.props.path.get("errorMsg")}
				          			</Typography>
					          	</Grid>
				 	 		</Grid>
						}
						
						{this.props.path.get("status")=="ok" /*&& this.props.path.getIn(["data"]) != null */&& 

							<div>
								{!this.props.path.get("file")&&
									<div id="folder">
					          			{/*<DirectoryList data={this.props.path} history={this.props.history} classes={classes}  /> */}   
					          			<DirectoryListVirtualize data={this.props.path} datalist={this.props.path} history={this.props.history} classes={classes}  />     
									</div>
								}

								{this.props.path.get("file")&&
									<div id="file">
										<div className={classes.paper} >
											{<FileViewer item={this.props.path} />}
											{/*store.dispatch({type:"CURRENT_TYPE_EXPLORER",payload:{type:"file"}})	*/}
											

											<div>{fileExtension(this.props.path.get("path"))}</div>
											<div>{mime.contentType(this.props.path.getIn(["data","name"]))}</div>
											<strong>{this.props.path.get("path")}</strong> {filesize(this.props.path.getIn(["data","size"]))}
											{/**/}
										</div>
									</div>
								}
							</div>
						}

				 	</div>
	          	 }

	          	 {this.props.path==null&&
	          	 	<div>
				 	 	<Grid style={{ height: "100%"}} justify="center" alignItems="center" container>
				 	 		<Grid item>none</Grid>
				 	 	</Grid>
				 	</div>
	          	 }
  
			 </div>
          	
			)
	}

}

const FolderBig = ({classes,data,history})=>{
	/*
	<Paper  className={classes.paper}>
		<Link to={`/SC/unidad#${x.get("path")}`} >{x.get("path")}</Link> {filesize(x.get("size"))}
	</Paper>*/
	
	const folders = data.get("data").sortBy(x=>x.get("file")).filter(x=>x.get("file")==false);
	const files = data.get("data").sortBy(x=>x.get("file")).filter(x=>x.get("file")==true);
	return (
			<Grid data-set="david"  spacing={24} justify="flex-start" direction="row" container >
				{folders.map(folder =>(
				<Grid item xs={4}>

					<Card className={classes.card}>
				        <CardContent>
				         
				          <Typography variant="headline" component="h2" style={{cursor:"pointer"}}  onClick={()=>{
				          	history.push("/SC/unidad#"+folder.get("path"))
				          }} noWrap={true} className={classes.title} >
				            {folder.get("name")}
				          </Typography>

				          <Typography  color="textSecondary">
				           {folder.get("file")?filesize(folder.get("size")) : ""}
				          </Typography>

				         <Typography color="textSecondary" variant="subheading" >
				           {(folder.get("file")?"Archivo":"Carpeta")}
				          </Typography>
				          
				          	
				          
				        </CardContent>
				        <CardActions>
				          <Button onClick={()=>{
				          	history.push("/SC/unidad#"+folder.get("path"))
				          }} size="small">Abrir</Button>
				           <Button onClick={()=>{
				           	load = true
				          	dl(folder.get("path"))
				          }} size="small">Descargar</Button>
				         
				        </CardActions>
				        
				    </Card>
				</Grid>
				))}

				{files.map(file =>(
				<Grid item xs={4}>

					<Card className={classes.card}>
				        <CardContent>
				         
				          <Typography variant="headline" component="h2" style={{cursor:"pointer"}}  onClick={()=>{
				          	history.push("/SC/unidad#"+file.get("path"))
				          }} noWrap={true} className={classes.title} >
				            {file.get("name")}
				          </Typography>

				          <Typography  color="textSecondary">
				           {file.get("file")?filesize(file.get("size")) : ""}
				          </Typography>

				         <Typography color="textSecondary" variant="subheading" >
				           {(file.get("file")?"Archivo":"Carpeta")}
				          </Typography>
				          
				          	
				          
				        </CardContent>
				        <CardActions>
				          <Button onClick={()=>{
				          	history.push("/SC/unidad#"+file.get("path"))
				          }} size="small">Abrir</Button>
				           <Button onClick={()=>{
				           	load = true
				          	dl(file.get("path"))
				          }} size="small">Descargar</Button>
				         
				        </CardActions>
				        
				    </Card>
				</Grid>
				))}
			</Grid>
		)
}




export default ViewExplorer