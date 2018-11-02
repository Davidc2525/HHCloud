import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';
import fileExtension from "file-extension";
import filesize from "filesize";
import { Map } from "immutable";
//import FileViewer from "../file_viewer"
import mime from "mime-types";
import React from "react";
import Loadable from 'react-loadable';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { store } from "../../redux/index.js";
import { fetchingPath } from "./actions.js";
import DirectoryListVirtualize from "./DirectoryListVirtualize.jsx";
import { dl } from "./middleware.js";
import MkdirDialog from "../explorer/MkdirDialog.jsx";
import MoveOrCopyDialog from "../explorer/MoveOrCopyDialog.jsx";
import RenameDialog from "../explorer/RenameDialog.jsx";

import CopyDialog from "../dialogs_share/CopyToUnity.jsx";
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied';
import {
	getParent,
	isRoot,
	parsePath,
	tryNormalize,
	parseSharePath,
	getAppLocation,
	locationToData
} from "../explorer/Util.js";
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
  	padding:"20px",
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
	var currentType = state.getIn(["open_share","currentType"]);
	
	var locationData = locationToData(props.location);

	
	let explorer = state.get("open_share");
	let paths = explorer.get("paths");
	//let path = paths.get(props.location.search)

	if (!paths.has(locationData.currentPathWithUser)) {
		//console.log("get path "+currentPath)
		store.dispatch(fetchingPath({...locationData,path:locationData.currentPathWithUser},true))
	

		return {
			paths: paths.toArray(),
			path: new Map({status:"loading",path:locationData.currentPathWithUser,...locationData}),
			explorer: state.get("open_share")
		}


	}
	var path = paths.get(locationData.currentPathWithUser);
		path = path.set("spath",locationData.spath)
		path = path.set("subpath",locationData.subpath)
		path = path.set("owner",locationData.owner)
	if (currentType != (path.get("file") ? "file" : "folder") ) {

		store.dispatch({type:"CURRENT_TYPE_EXPLORER",payload:{type:path.get("file")?"file":"folder"}})

	}

	return {
		paths: paths.toArray(),  
		path: path,
		explorer: state.get("open_share")
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
		const data = this.props.path.get("payload"); // de data a payload 

		return (

			<div id="ViewExplorer">
				
				<CopyDialog />
				

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
				 	 			 	<Typography noWrap color="textSecondary" variant="title" >
							           	{/*this.props.path.get("path")*/}
							           	Cargando
							        </Typography>
					    		</Grid>
					     		<br/>
				 	 			<Grid item><CircularProgress /></Grid>
				 	 		</Grid>	
				 		}
				 		
				 		{this.props.path.get("status")=="error" && 
				 			
				 			<Grid style={{ height: "80%"}} direction="column" justify="center" alignItems="center" container>
				 	 			<Grid item>
				 	 			 	<SentimentDissatisfied color={"primary"} style={{ fontSize: 100 }} />
					          	</Grid>

					          	<Grid item>
				 	 			 	<Typography variant="title" color="" component="h2" style={{cursor:"pointer"}}   noWrap={true} className={classes.title} >
				            			Ups! parece que tengo un pequeño problema.
				          			</Typography>

					          	</Grid>

					          	<Grid item>
				 	 			 	<Typography variant="headline" component="h2" style={{cursor:"pointer"}}   noWrap={false} className={classes.title} >
				            			{/*error name: {this.props.path.get("error")}, mensaje:*/}
				            			{this.props.path.get("msg")}
				          			</Typography>
					          	</Grid>
				 	 		</Grid>
						}
						
						{this.props.path.get("status")=="ok" && (data==null || data.count()>=1) /*&& this.props.path.getIn(["payload"]) != null */&& 

							<div>
								{!this.props.path.get("file")&&
									<div id="folder">
											{/*<DirectoryList data={this.props.path} history={this.props.history} classes={classes}  /> */}   
											<DirectoryListVirtualize data={this.props.path} classes={classes}  />     
									</div>
								}

								{this.props.path.get("file")&&
									<div id="file">
										<div className={classes.paper} >
											{<FileViewer 
												item={this.props.path} 
												isShare={true}/>}
											{/*store.dispatch({type:"CURRENT_TYPE_EXPLORER",payload:{type:"file"}})	*/}
											
											{false&&<Typography>{fileExtension(this.props.path.get("path"))}</Typography>}
											{false&&<Typography>{mime.contentType(this.props.path.getIn(["payload","name"]))/**de data a payload*/}</Typography>}
											<Typography><strong>{this.props.path.get("path")}</strong> {filesize(this.props.path.getIn(["payload","size"]))}</Typography>
											{/**/}
										</div>
									</div>
								}
							</div>
						}

						{this.props.path.get("status")=="ok" && (data==null || data.count()==0)&&
							
							<Grid style={{ height: "100%"}} direction="column" justify="center" alignItems="center" container>
				 	 			<Grid item>
				 	 			 	<Typography variant="headline" component="h2" style={{cursor:"pointer"}}   noWrap={true} className={classes.title} >
				            			Esta carpeta esta vacia. 
				          			</Typography>
					          	</Grid>
				 	 		</Grid>
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


export default ViewExplorer