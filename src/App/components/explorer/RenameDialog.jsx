import React from 'react';
import {connect} from "react-redux"
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {store} from "../../redux/index.js"
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Slide from '@material-ui/core/Slide';

import CircularProgress from '@material-ui/core/CircularProgress';
function Transition(props) {
  return <Slide direction="up" {...props} />;
}


@connect((state, props) => {

  return {
    open: state.getIn(["explorer", "renameDialog","open"]),
    status: state.getIn(["explorer","renameDialog","status"]),
    nameFile: state.getIn(["explorer","renameDialog","name"]),
    cantEdit: state.getIn(["explorer","renameDialog","cantEdit"]),
    path: state.getIn(["explorer","renameDialog","path"])
  }
})
 class RenameDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      value:"",
      cantEdit:true
    };

  }
  componentDidMount() {
    this.setState({value:this.props.nameFile}) 
  }
  componentWillReceiveProps(nextProps) {
     this.setState({value:nextProps.nameFile}) 
  }
  getParent(path = "/") {
    let p = path.split("/").filter(x => x != "")
    let start = "/"
    if (path[0] != "/") {
      start = "/"
    }
    return start + p.slice(0, p.length - 1).join("/")
  }

  newPath(){
    return this.getParent(this.props.path)+"/"+this.state.value
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ value: "" });
    store.dispatch({type:"CLOSE_RENAME_DIALOG"})
   //this.props.onClose({ open: false });
  };

  handleChange = event => {
    let newValue = event.target.value.replace(/([\/#\?%\\$`])/ig,"")
    this.setState({ value: newValue});
  }

  handleRename() {

   store.dispatch({
      type: "STATUS_RENAME_DIALOG",
      middle: "EXPLORER",
      status:"renaming"
    })
   store.dispatch({
      type: "CANT_EDIT_RENAME_DIALOG",
      middle: "EXPLORER",
      cantEdit:false
    })
    store.dispatch({
      type: "RENAMING_PATH",
      middle: "EXPLORER",
      payload: {
        oldName: this.props.nameFile,
        newName: this.state.value,
        oldPath: this.props.path,
        newPath: this.newPath()
      }
    })
   
    


  }
  render() {
    const {fullScreen} = this.props;
    return (
      <div>
        
        <Dialog
          TransitionComponent={Transition}
          fullScreen={fullScreen}
          open={this.props.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Renombrar archivo o carpeta</DialogTitle>
          <DialogContent>
            <DialogContentText>
             Cambiar de nombre '{this.props.path}'
             <br/>
             {this.props.status == "error"&&(<strong>a ocurrido un error, intente de nuevo!</strong>)}
            </DialogContentText>
            {this.props.status == "ready" || this.props.status == "error" ? (
                <TextField
               onChange={this.handleChange}
                disabled={!this.props.cantEdit}
                autoFocus
                margin="dense"
                id="name"
                label="Nuevo nombre"
                type="text"
                value={this.state.value}
                fullWidth
              />)
            :
            this.props.status =="renaming" && (<div> <CircularProgress/></div>)
          }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.value.length==0||!this.props.cantEdit} 
              onClick={this.handleRename.bind(this)} 
              color="primary">
              Cambiar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}


export default withMobileDialog()(RenameDialog)