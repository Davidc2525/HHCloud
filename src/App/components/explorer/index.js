import React from "react"
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
import {dl} from "./middleware.js"
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress'
import LinearProgress from '@material-ui/core/LinearProgress';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FolderIcon from '@material-ui/icons/Folder';
import ArchiveIcon from '@material-ui/icons/Archive';
import FileDownload from '@material-ui/icons/FileDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import {fetchingData,MIDDLEWARE,FETCHING_PATH} from  "./actions.js"


import withWidth from '@material-ui/core/withWidth';


import {DownloadManagerInstance} from "../../elements/download_manager/index.js"

const styles = theme => ({
  root: {
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
});

@connect((state,props)=>{
	console.warn(store)
	var currentPath = props.location.hash.split("#")[1];parse(props.location.search).path
	let explorer = state.get("explorer");
	let paths = explorer.get("paths");
	//let path = paths.get(props.location.search)

	if (!paths.has(currentPath)) {
		console.log("get path "+currentPath)
		store.dispatch(fetchingData(currentPath))
		
		return {
			paths: paths.toArray(),
			path: null,
			explorer: state.get("explorer")
		}


	}

	return {
		paths: paths.toArray(),  
		path: paths.get(currentPath),
		explorer: state.get("explorer")
	}

}, dispatch => ({
  onClick: event => dispatch(honk()) // <-- empty payload
}))
class Explorer extends React.Component {


 
	constructor(props) {

		super(props)
 

	}

	render(){
		console.error(this.props)
		const {classes,width}=this.props
		return (

			<div >
			
			
	          	{/*this.props.paths.map(x=>
	          		<div>
	          	 		{<Link to={`//unidad#${x.get("path")}`} >{x.get("path")}</Link>} 
	          	 	</div>
	          	 )*/}
				
				 {this.props.path != null ? 

				 	<div className={classes.root}>
						 		
					 	
					 	{this.props.path.getIn(["data"]) != null ?


					 		/*
					 		

						        <FolderSmall path={this.props.path} history={this.props.history} classes={classes}  data={x}/>     
				          		*/
					          			
					          	this.props.path.get("file")?

					          		//"file"
					          		
					          		<Grid spacing={24} justify="flex-start" direction="row" container >
										<Grid item xs={12}>
											<Paper className={classes.paper} >
											file <strong>{this.props.path.get("path")}</strong> {filesize(this.props.path.getIn(["data","size"]))}
											</Paper>
										</Grid>
									</Grid> 	

					          		:
					          		(width=="sm"||width=="xs"||width=="md") ? 
					          				<FolderSmall data={this.props.path} history={this.props.history} classes={classes}  />     
					          			:
					          				
					          				<FolderBig data={this.props.path} history={this.props.history} classes={classes}  />     
					          				

				          		

				          		
					 			:

					 			<div>none</div>
					 	}

				 	</div>

				 	 :<div>
				 	 	<Grid style={{ height: "100%"}} justify="center" alignItems="center" container>
				 	 		<Grid item><CircularProgress /></Grid>
				 	 	</Grid>
				 	 </div>}

				 
				  
			 </div>
          	
			)
	}

}

const FolderBig = ({classes,data,history})=>{
	/*
	<Paper  className={classes.paper}>
		<Link to={`//unidad#${x.get("path")}`} >{x.get("path")}</Link> {filesize(x.get("size"))}
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
				          	history.push("/unidad#"+folder.get("path"))
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
				          	history.push("/unidad#"+folder.get("path"))
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
				          	history.push("/unidad#"+file.get("path"))
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
				          	history.push("/unidad#"+file.get("path"))
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
const FolderSmall = ({classes,data,history})=>{
	/*
	<Paper  className={classes.paper}>
		<Link to={`//unidad#${x.get("path")}`} >{x.get("path")}</Link> {filesize(x.get("size"))}
	</Paper>

	this.props.path.getIn(["data"]).sortBy(x=>x.get("file")).map(x=>
			          		
			          			<FolderSmall history={this.props.history} classes={classes}  data={x}/>
			          			
							
						 	)*/
	var load = false;

	const folders = data.get("data").sortBy(x=>x.get("file")).filter(x=>x.get("file")==false);
	const files = data.get("data").sortBy(x=>x.get("file")).filter(x=>x.get("file")==true);
	return (
			<div>
			 <List dense={true}>
			 	<Typography variant="headline" component="h2" style={{cursor:"pointer"}}   className={classes.title} >
		            Carpetas {folders.count()}
		        </Typography>
			 	<Divider />
			 	{folders.map(item=>{
			 		return (
                  <ListItem button onClick={()=>{
		          	history.push("/unidad#"+item.get("path"))
		          }} >
                    <ListItemAvatar>
                      <Avatar>
                       	{item.get("file")?<ArchiveIcon/>:<FolderIcon />}
                        
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      secondaryTypographyProps={{noWrap:true, variant:"body2"}}
                      primaryTypographyProps={{color:"primary",noWrap:true, variant:"title"}}
                      primary={item.get("name")}
                      //secondary={filesize(item.get("size"))}
                    />

                    <ListItemSecondaryAction>
                      <IconButton  aria-label="Descargar"onClick={()=>{
			           	
			          	DownloadManagerInstance.instance.addDownload(item.get("path"))
			          }}>
                        <FileDownload />
                      </IconButton>
                       <IconButton  aria-label="Delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>

			 			)
			 	})}


			 	<Typography variant="headline" component="h2" style={{cursor:"pointer"}}   className={classes.title} >
		            Archivos {files.count()}
		        </Typography>
			 	<Divider />
			 	{files.map(item=>{
			 		return (
                  <ListItem button onClick={()=>{
		          	history.push("/unidad#"+item.get("path"))
		          }} >
                    <ListItemAvatar>
                      <Avatar>
                       	{item.get("file")?<ArchiveIcon/>:<FolderIcon />}
                        
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      secondaryTypographyProps={{noWrap:false, variant:"body2"}}
                      primaryTypographyProps={{color:"primary",noWrap:true, variant:"title"}}
                      primary={item.get("name")}
                      secondary={filesize(item.get("size"))}
                    />

                    <ListItemSecondaryAction>
                      <IconButton  aria-label="Descargar"onClick={()=>{
			           	
			          	DownloadManagerInstance.instance.addDownload(item.get("path"))
			          }}>
                        <FileDownload />
                      </IconButton>
                       <IconButton  aria-label="Delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>

			 			)
			 	})}
                
              </List>
			</div>
		)
}
export default withWidth()(withStyles(styles)(withRouter(Explorer)));