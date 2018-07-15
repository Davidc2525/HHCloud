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
 

 const style = {
   button: {
     background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
     borderRadius: 3,
     border: 0,
     color: 'white',
     width:"100%",
     height: 48,
     padding: '0 30px',
     boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
   }
 }


const ButtonLink = withRouter(({ history ,...rest}) => (
  <Button 
  {...rest}
   onClick={() => { history.push('/SC/unidad#/') }}
   variant="extendedFab" color="primary" aria-label="delete" >   
    Mi Unidad
  </Button>
 
));


@connect((state,props)=>{
  var dl = state.get("downloads").get("downloads")
  var count = dl.count()
  return {count};
})
class SideVarContent extends React.Component{
  render(){
    const {location,history,count,classes} = this.props; 
    return (

      <div>
        {/*descargas*/}
        <ListItem  onClick={()=>{
            history.push("/SC/unidad#/")
          }}>
        

         <ButtonLink className={classes.button}  {...this.props}/>
          
        </ListItem>      

        {/*descargas*/}
        <ListItem button onClick={()=>{
            history.push("/SC/download")
          }}>
        <ListItemIcon>
            <ArchiveIcon />
          </ListItemIcon>

         { count>0?
            <ListItemText primary="Descarga" secondary={count} />
            :
            <ListItemText primary="Descarga"  />
          }
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