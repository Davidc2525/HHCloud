//MkdirDialog.jsx
import React from 'react';
import {connect} from "react-redux"
import CreateNewFolder from '@material-ui/icons/CreateNewFolder';
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
import { withStyles } from '@material-ui/core/styles';
import * as utils from "./Util.js"
import CircularProgress from '@material-ui/core/CircularProgress';


import {
	tryNormalize,
	parsePath,
	getParent,
	mergePath
} from "./Util.js"

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});


function Transition(props) {
  return <Slide direction="up" {...props} />;
}

@withStyles(styles)
@connect((state, props) => {
	const paths = state.getIn(["explorer","paths"]);
	//const route = state.get("router"),
	//const location = tryNormalize(parsePath(router.location.hash))


  return {
    open: state.getIn(["explorer", "mkdirDialog","open"]),
    status: state.getIn(["explorer","mkdirDialog","status"]),
    errorMsg: state.getIn(["explorer","mkdirDialog","errorMsg"]),
    nameFile: state.getIn(["explorer","mkdirDialog","name"]),
    cantEdit: state.getIn(["explorer","mkdirDialog","cantEdit"]),
    path: utils.parsePath(state.getIn(["router"]).location.hash),
    paths,
    //location
  }
})
 class MkdirDialog extends React.Component {
  constructor(props) {
    super(props);
    this.defaultNameOfNewFolder = "Nueva carpeta"
    this.state = {
      open: false,
      value:"",
      cantEdit:true
    };

  }

  	/**Encontrar el ultimo numer usado en Nueva carpeta, para sugerencia de nombre de nueva carpeta*/
	findTheLastNumberUsed() {
		var last = 0;
		var paths = this.props.paths.getIn([this.props.path, "payload"], false);
		if (paths) {
			paths = paths.map(x => x.get("name"));
			var pathsFilters = paths.filter(x => x.startsWith(this.defaultNameOfNewFolder))
			pathsFilters = pathsFilters.map(x => x.match(/\d+$/ig));
			pathsFilters = pathsFilters.filter(x => x != null);
			var l = pathsFilters.last();
			if (l != undefined) {
				last = parseInt(l);
			}
		}

		return last == 0 ? 1 : last + 1
	}

	/**sugerir nuevo nombre de capeta
		si existe -> nueva carpeta 1
			sugerira -> nueva carpeta 2
		asi susesvivamente
	*/
	sugestNameNewFolder(){
		this.setState({value:this.defaultNameOfNewFolder+" "+this.findTheLastNumberUsed()})
	}
  
	getParent(path = "/") {
		return getParent(path)
		let p = path.split("/").filter(x => x != "")

		let parentPath = p.slice(0, p.length - 1).join("/")
		var start = "/"
		if (parentPath[0] == "/") {
			start = ""
		} else if (parentPath != "") {
			start = ""
		}
		return "/" + parentPath
	}

	newPath() {
		return mergePath(((this.props.path)), this.state.value)
		//return (this.getParent(this.props.path)+"/"+this.state.value).replace(/\/\/*/,"/")
	}

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ value: "" });
		store.dispatch({type:"CLOSE_MKDIR_DIALOG"})
		//this.props.onClose({ open: false });
	};

	handleChange = event => {
		let newValue = event.target.value.replace(/([\:\/#\?%\\$`])/ig,"")
		this.setState({ value: newValue});
	}

  handleRename() {

   store.dispatch({
      type: "STATUS_MKDIR_DIALOG",
      middle: "EXPLORER",
      status:"creating"
    })
   store.dispatch({
      type: "CANT_EDIT_MKDIR_DIALOG",
      middle: "EXPLORER",
      cantEdit:false
    })
    store.dispatch({
      type: "CREATING_PATH",
      middle: "EXPLORER",
      payload: {
        inPath: this.props.path,
        namePath: this.newPath()
      }
    })
   
    


  }
  render() {
    const {fullScreen,classes} = this.props;
    return (
      <div>
        
        <Dialog
          disableBackdropClick={!this.props.cantEdit}
          disableEscapeKeyDown={!this.props.cantEdit}
          
          TransitionComponent={Transition}
          fullScreen={fullScreen}
          open={this.props.open}
          onEnter={this.sugestNameNewFolder.bind(this)}
          onExit={_=>{this.setState({value:""})}}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Crear nueva carpeta</DialogTitle>
          <DialogContent>
            <DialogContentText>
             {this.props.status == "error"&&(<strong>A ocurrido un error ({this.props.errorMsg}), intente de nuevo!</strong>)}
            </DialogContentText>
            {this.props.status == "ready" || this.props.status == "error" ? (
                <TextField
	               onChange={this.handleChange}
	                disabled={!this.props.cantEdit}
	                autoFocus
	                margin="dense"
	                id="name"
	                label="Nombre"
	                type="text"
	                value={this.state.value}
	                fullWidth
	              />)
            :
            this.props.status =="creating" && (<div> <CircularProgress/></div>)
          }
          </DialogContent>
          <DialogActions>
            <Button disabled={!this.props.cantEdit} onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button
              variant="contained" size="small" color="primary"
              disabled={this.state.value.length==0||!this.props.cantEdit} 
              onClick={this.handleRename.bind(this)} 
              >
              <CreateNewFolder className={classes.leftIcon}r/>
              Crear
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}


export default withMobileDialog()(withStyles(theme=>({}),{withTheme:true})(MkdirDialog))