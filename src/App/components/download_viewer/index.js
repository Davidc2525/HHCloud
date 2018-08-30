import React from "react"
import {connect} from "react-redux"

import filesize from "filesize"
import {withRouter} from "react-router"

import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';


import LinearProgress from '@material-ui/core/LinearProgress';


import {DownloadManagerInstance} from "../../elements/download_manager/index.js"


 const styles = theme => ({
  root: {
    flexGrow: 1,
    //maxWidth: 752,
  },
  demo: {
    //backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
    marginLeft: `${theme.spacing.unit * 2}px`,
  },
});

const isFile = (data)=>{
	return data.getIn(["payload","file"])
}

const getLoaded = (data)=>{
	if(isFile(data)){
		return filesize(data.getIn(["payload","loaded"]))
	}else{
		return filesize(data.getIn(["payload","loaded"]))
	}
}

const getSpeedDownload = (data)=>{
	return filesize(data.get("speed"))+"/s"
}

const getSize = (data)=>{
	if(isFile(data)){
		return filesize(data.getIn(["payload","size"]))
	}else{
		return filesize(data.getIn(["payload","size"]))
	}
}

const isDeterminantBarProgress = (data) => {
	return !Math.floor(data.getIn(["payload","loaded"]))<=0;
}

const getProgress = (data)=>{
	if(isFile(data)||true){
		return (  Math.ceil(data.getIn(["progress"])) )+"%  ("+ getLoaded(data) +" de "+getSize(data)+") ("+getSpeedDownload(data)+")"
	}else{
		return filesize( data.getIn(["progress"])   )
	}
}

const hasError = (data)=>{
	return data.get("error")
}

const isMultipe=(data)=>{
	return data.get("multiple");
}

const getNameDownload=(data)=>{
	if(isMultipe(data)){
		return data.getIn(["payload","name"])
	}else{
		return data.get("path")
	}

}

const view=({data,history})=>{
		return (
		<div elevation={0}>
			<ListItem button onClick={()=>{
				if(isMultipe(data)){return}
        history.push("/SC/unidad#"+data.getIn(["path"]))
      }}>

        <ListItemText
          primary={getNameDownload(data)}
          secondary={!hasError(data) ? getProgress(data):"error al descargar" }
        />
        <ListItemSecondaryAction>
          <IconButton aria-label="Delete"
            onClick={_=>confirm(`Desea cancelar descarga de ${getNameDownload(data)}?`)&&DownloadManagerInstance.instance.cancelDownload(data.get("id"))}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      {data.getIn(["progress"])<=100&&
        <LinearProgress value={Math.floor(data.getIn(["progress"]))} variant={isDeterminantBarProgress(data)?"determinate":"query"}/>}

		</div>)


}

@connect((state,props)=>{
	//let downloadState = state.get("downloads")
	let downloads = state.get("downloads").get("downloads")

	return {count:downloads.count(),downloads:downloads.toArray()}
})
class DownloadViewer extends React.Component{

	constructor(props){super(props)}

	render(){
		const {downloads,classes,count,history} = this.props;
		return (
		<div /*style={{height:this.props.h,overflow:"auto"}}*/ className={classes.root}>
      <Typography variant="title" className={classes.title}>
        Descarga
      </Typography>
      {(count > 0) &&
        <Typography className={classes.title} variant="body2" gutterBottom>
          <span>Descargas en proceso <strong>{count}.</strong></span>
        </Typography>}
      <Grid item xs={12} md={12}>
        {count == 0&&
          <Grid style={{height:"100%"}} container justify="center" alignItems="center">
            <Grid item xs={6}>
              <Typography variant="headline" gutterBottom>
                No hay descargas en proceso.
              </Typography>
            </Grid>
          </Grid>
        }
        <div className={classes.demo}>
          <List dense={false}>
            {downloads.map(x=>view({data:x,history}))}
          </List>
        </div>
      </Grid>


		</div>)
	}
}


export default withStyles(styles)(withRouter(DownloadViewer))
