import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ArchiveIcon from '@material-ui/icons/Archive';
import DraftsIcon from '@material-ui/icons/Drafts';
import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportIcon from '@material-ui/icons/Report';
import {connect} from "react-redux"
import {Link} from "react-router-dom"
import {withRouter} from "react-router"
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import CloudDownload from '@material-ui/icons/CloudDownload';
import {store} from "../../redux/index.js"
import {push} from "react-router-redux"
import LinearProgress from '@material-ui/core/LinearProgress';
import Fade from '@material-ui/core/Fade';
import filesize from "filesize"

const style = theme => ({
  button: {
    ...theme.palette.unidadButtom,
    //borderRadius: 3,
    border: 0,
    color: 'white',
    width: "100%",
    height: 48,
    padding: '0 30px',

  },
   buttonBlue: {
     background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
     boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
   },
   buttonPink: {
     background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
     boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
   },
 })


const ButtonLink = withRouter(({ history ,...rest}) => (
  <Button 
  {...rest}
   onClick={() => { store.dispatch(push("/SC/unidad#/"))}}
   variant="extendedFab" color="primary" aria-label="unidad" >   
    Mi Unidad
  </Button>
 
));

/*
dls = store.getState().get("downloads").get("downloads").toJS()

size = Object.keys(dls).map(x=>dls[x]).map(x=>({size:x.payload.size,loaded:x.payload.loaded})).reduce((a,c)=>( a+=c.size),0)

loaded = Object.keys(dls).map(x=>dls[x]).map(x=>({size:x.payload.size,loaded:x.payload.loaded})).reduce((a,c)=>( a+=c.loaded),0)
;

(loaded/size)*100
*/
@connect((state,props)=>{
  var dl = state.get("downloads").get("downloads")
  var count = dl.count()
  return {count,dl};
})
class SideVarContent extends React.Component{


  getTotalProgress(){
     
      var dls = this.props.dl.toJS();

      var data = Object.keys(dls).map(x=>dls[x]).map(x=>({size:x.payload.size,loaded:x.payload.loaded}));

      var size = data.reduce((a,c)=>( a+=c.size),0);

      var loaded = data.reduce((a,c)=>( a+=c.loaded),0);

      return (loaded / size) * 100;
  }

  getTotalSpeedDownload() {

    var dls = this.props.dl;

    const speeds = dls.toList().map(x => x.getIn(["speed"]))

    const speedAvg = speeds.reduce((a, n) => (a + n), 0);// / speeds.count();

    return speedAvg;

  }


  render(){
    const {location,history,count,classes} = this.props; 
    return (

      <div>
        {/*ir a unidad*/}
        <ListItem>  

          <ButtonLink className={classes.button}  {...this.props}/>
          
        </ListItem>      

        {/*descargas*/}
        <ListItem button onClick={()=>{
           store.dispatch(push("/SC/download"))
          }}>
          <ListItemIcon>
            <CloudDownload />
          </ListItemIcon>

          {count>0?
            <ListItemText primary="Descarga" secondary={`${count}, (${filesize(this.getTotalSpeedDownload())}/s)`} />
            :
            <ListItemText primary="Descarga"  />
          }
        </ListItem>
       {count>0&& <LinearProgress value={this.getTotalProgress()} variant="determinate"/>}

        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Starred" />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="Send mail" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItem>
      </div>
      )
  }
}
export default (withRouter(withStyles(style)(SideVarContent)))

export const mailFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary="Descargas" secondary="1" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <StarIcon />
      </ListItemIcon>
      <ListItemText primary="Starred" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText primary="Send mail" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DraftsIcon />
      </ListItemIcon>
      <ListItemText primary="Drafts" />
    </ListItem>
  </div>
);

export const otherMailFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <MailIcon />
      </ListItemIcon>
      <ListItemText primary="All mail" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary="Trash" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ReportIcon />
      </ListItemIcon>
      <ListItemText primary="Spam" />
    </ListItem>
  </div>
);