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
import LinearProgress from '@material-ui/core/LinearProgress';
const styles = theme => ({
  root: {
    flexGrow: 1,
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
	var currentPath = parse(props.location.search).path
	let explorer = state.get("explorer");
	let paths = explorer.get("paths");
	let path = paths.get(props.location.search)

	if (!paths.has(currentPath)) {
		console.log("get path "+currentPath)
		store.dispatch({path:currentPath,type:"FETCHING_PATH",middle:"EXPLORER"})
		
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
		const {classes}=this.props
		return (

			<div >
			
	          	{/*this.props.paths.map(x=>
	          		<div>
	          	 		{<Link to={`/unidad?path=${x.get("path")}`} >{x.get("path")}</Link>} 
	          	 	</div>
	          	 )*/}
				
				 {this.props.path != null ?
				 <div className={classes.root}>
				 	 <Grid spacing={24} justify="flex-start" direction="row" container >
					 	{
					 		this.props.path.getIn(["data"]) != null ?
					 		(this.props.path.get("file")) ?
						 	<Grid item xs={12}>
					          <Paper className={classes.paper} >
					          	file <strong>{this.props.path.get("path")}</strong> {filesize(this.props.path.getIn(["data","size"]))}
					          </Paper>
					        </Grid>
					 			
					 		:
					 				          
			          		this.props.path.getIn(["data"]).sortBy(x=>x.get("file")).map(x=>
			          		<Grid  item xs={4}>	
			          			<FolderBig history={this.props.history} classes={classes}  data={x}/>
			          			
							</Grid>
						 	)
					 		:
					 		<div>none</div>
					 	}
				       
				 	 </Grid>


				</div>
				 	:

				 	<div>cargando</div>

				 
				  }
			 </div>
          	
			)
	}

}

const FolderBig = ({classes,data,history})=>{
	/*
	<Paper  className={classes.paper}>
		<Link to={`/unidad?path=${x.get("path")}`} >{x.get("path")}</Link> {filesize(x.get("size"))}
	</Paper>*/
	var load = false;
	return (
		<Card className={classes.card}>
        <CardContent>
         
          <Typography variant="headline" component="h2" style={{cursor:"pointer"}}  onClick={()=>{
          	history.push("unidad?path="+data.get("path"))
          }} noWrap={true} className={classes.title} >
            {data.get("name")}
          </Typography>

          <Typography  color="textSecondary">
           {data.get("file")?filesize(data.get("size")) : ""}
          </Typography>

         <Typography color="textSecondary" variant="subheading" >
           {(data.get("file")?"Archivo":"Carpeta")}
          </Typography>
          <Fade in={load}>
          	
          <LinearProgress />
          </Fade>
        </CardContent>
        <CardActions>
          <Button onClick={()=>{
          	history.push("unidad?path="+data.get("path"))
          }} size="small">Abrir</Button>
           <Button onClick={()=>{
           	load = true
          	dl(data.get("path"))
          }} size="small">Descargar</Button>
         
        </CardActions>
        
      </Card>)
}
const FolderSmall = ({classes,data,history})=>{
	/*
	<Paper  className={classes.paper}>
		<Link to={`/unidad?path=${x.get("path")}`} >{x.get("path")}</Link> {filesize(x.get("size"))}
	</Paper>*/
	var load = false;
	return (
		<Card className={classes.card}>
        <CardContent>
         
          <Typography variant="headline" component="h2" style={{cursor:"pointer"}}  onClick={()=>{
          	history.push("unidad?path="+data.get("path"))
          }} noWrap={true} className={classes.title} >
            {data.get("name")}
          </Typography>

          <Typography  color="textSecondary">
           {data.get("file")?filesize(data.get("size")) : ""}
          </Typography>

         <Typography color="textSecondary" variant="subheading" >
           {(data.get("file")?"Archivo":"Carpeta")}
          </Typography>
          <Fade in={load}>
          	
          <LinearProgress />
          </Fade>
        </CardContent>
        <CardActions>
          <Button onClick={()=>{
          	history.push("unidad?path="+data.get("path"))
          }} size="small">Abrir</Button>
           <Button onClick={()=>{
           	load = true
          	dl(data.get("path"))
          }} size="small">Descargar</Button>
         
        </CardActions>
        
      </Card>)
}
export default withStyles(styles)(withRouter(Explorer));