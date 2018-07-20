import React from 'react';
import ApiInstance from "../../elements/API/v1/Api.js"
import {getParent,mergePath} from "./Util.js"

import {Map,List as ListI,fromJS} from "immutable"

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Typography from "@material-ui/core/Typography"
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';

import Slide from '@material-ui/core/Slide';
import {store} from "../../redux/index.js"
import {connect} from "react-redux";
function Transition(props) {
  return <Slide direction="up" {...props} />;
}


@withMobileDialog()
@connect((state, props) => {

   return {
    open: state.getIn(["explorer", "moveOrCopyDialog","open"]),
    op: state.getIn(["explorer","moveOrCopyDialog","op"]),
    status: state.getIn(["explorer","moveOrCopyDialog","status"]),
    errorMsg: state.getIn(["explorer","moveOrCopyDialog","errorMsg"]),
    nameFile: state.getIn(["explorer","moveOrCopyDialog","name"]),
    cantEdit: state.getIn(["explorer","moveOrCopyDialog","cantEdit"]),
    path: state.getIn(["explorer","moveOrCopyDialog","path"]),
   
    paths: state.getIn(["explorer","moveOrCopyDialog","path"]),
    fetchingPath: state.getIn(["explorer","moveOrCopyDialog","fetchingPath"]),
    currentPath: state.getIn(["explorer","moveOrCopyDialog","currentPath"]),
    pathSelectedToMoveOrCopy: state.getIn(["explorer","moveOrCopyDialog","pathSelectedToMoveOrCopy"]),
  }
})
class MoveOrCopyDialog extends React.Component {
  state = {
    open: true,
    paths:  Map(),
    currentPath:"/",
    pathSelectedToMoveOrCopy:null,
    fetchingPath:false,
    history:[],
    status:"ok",
    cantEdit:true,

    inProgress:false,
    progress:0,
  };


  onEnter(){
    this.loadPaths("/")
  }

  loadPaths(path="/"){
    
    var paths = this.state.paths
    var cPathContent = paths.get(path)
    if(cPathContent!=null){

    }else{   
      this.setState({fetchingPath:true})   
      ApiInstance.instance.callOperation("list",{
        path:path,
        thenCB:(payload)=>{
              paths = this.state.paths
              paths = paths.set(path,fromJS(payload))
          this.setState({paths:paths,status:"ok"})
          this.setState({fetchingPath:false})
          console.warn(payload)
        },
        catchCB:(payload)=>{
          this.setState({status:"error",errorMsg:payload.errorMsg})
        }
      });
    }
  }

  setCurretPath(path="/",push=true){
    this.setState({currentPath:path})
    this.loadPaths(path)
    //push &&  this.historyPush(path)
  }


  historyBack(cPath = "/") {

    this.setCurretPath(getParent(cPath), false)
    this.pathSelect(getParent(cPath))
    return
    var ch = this.state.history
    ch.splice(ch.indexOf(cPath), ch.length)

    this.setState({
      history: ch
    })
    if (ch.length > 0) {
      this.setCurretPath(ch[ch.length] - 1, false)

    } else {

      this.setCurretPath("/", false)
    }

  }

  historyPush(path){

    this.setState(s=>{
      var ch = s.history
          ch.push(path)

        return {history:ch}
    })
    this.pathSelect(path)
  }

  pathSelect(path=null){
      if(path==null){

        this.setState({pathSelectedToMoveOrCopy:null})
      }else{

        this.setState({pathSelectedToMoveOrCopy:mergePath(path,this.props.nameFile)})
      }
  
  }

  onClose(){
    store.dispatch({type:"CLOSE_MOVE_OR_COPY_DIALOG"})
    this.setState(({paths:new Map(),currentPath:"/",pathSelectedToMoveOrCopy:null}))
  }

  onOperation(){

    this.setState({inProgress:true,cantEdit:false})
    ApiInstance.instance.callOperation(this.props.op,{
        path:this.props.path,
        dstPath:this.state.pathSelectedToMoveOrCopy,
        onProgress:(_,progress)=>{this.setState({progress})},
        //onReady
        thenCB:(payload)=>{
            
          console.warn(payload)
          store.dispatch({type:"CLOSE_MOVE_OR_COPY_DIALOG"})
          this.setState(({inProgress:false,cantEdit:true,paths:new Map(),currentPath:"/",pathSelectedToMoveOrCopy:null}))
        },
        catchCB:(payload)=>{
          this.setState({inProgress:false,cantEdit:true,status:"error",errorMsg:payload.errorMsg})
        }
      })
  }

  render() {
    const {fullScreen} = this.props;
    return (
      <div>
       
        <Dialog
          disableBackdropClick={!this.state.inProgress}
          disableEscapeKeyDown={!this.state.inProgress}
          fullScreen={fullScreen}
          //style={{minWidth:"500px"}}
          open={this.props.open}
          onEnter={this.onEnter.bind(this)}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.onClose.bind(this)}
          //onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {this.props.op=="move"?"Mover":"Copiar"} '{this.props.nameFile}'
          </DialogTitle>
          <DialogContent>
          
          <div>
            <ListItem onClick={_=>{this.historyBack(this.state.currentPath)}} button>
              <ListItemIcon>
                <ChevronLeftIcon />
              </ListItemIcon>
              <ListItemText  primary={this.state.currentPath} />
            </ListItem>         
          </div>

          <Grid  container justify="center" alignItems="center">
            {(!this.state.inProgress  && !this.state.fetchingPath && this.state.status=="ok")&&
              <Grid item xs><ListPath 
                loadPaths={this.loadPaths.bind(this)}
                currentPath={this.state.currentPath}
                paths={this.state.paths}
                setCurretPath={this.setCurretPath.bind(this)}
                pathSelect={this.pathSelect.bind(this)}
              />
              </Grid>
              }
              {
                (this.state.fetchingPath && this.state.status=="ok")&&
                <Grid item lg={24}> <CircularProgress  size={50} /> </Grid>
              }

               {
                (this.state.inProgress )&&
                <Grid item lg={24}> 
                  <Typography variant="display3" >{this.props.op=="move"?"Moviendo":"Copiando"}</Typography>
                  <Typography variant="title">{Math.ceil(this.state.progress)}%</Typography>
                  <CircularProgress variant="static" value={this.state.progress} /> 
                </Grid>
              }

               {
                this.state.status=="error"&&
                <Grid item lg={24}>
                  <Typography variant="display3">Ups tenemos probelmas :/</Typography>
                  <Typography color="secondary" variant="display1">{this.state.errorMsg}</Typography>
                  </Grid>
              }

          </Grid>

            
             
               
          </DialogContent>
          <DialogActions>
             {this.state.pathSelectedToMoveOrCopy!=null&&
              <div style={{"flexGrow":"1",display:"flex","justifySelf":"flex-start"}}>
                <Typography color="secondary" variant="body2">
                  {this.props.op == "move"?"Mover a ":"Copiar en "} 
                  {this.state.pathSelectedToMoveOrCopy}
                </Typography>      
              </div>}
            <Button onClick={this.onClose.bind(this)} disabled={!this.state.cantEdit} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.onOperation.bind(this)} disabled={(!this.state.cantEdit||this.state.pathSelectedToMoveOrCopy==null)}  variant="contained" size="small" color="primary"   >
               {this.props.op=="move"?"Mover":"Copiar"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}


@withMobileDialog()
class ListPath extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
   
    const {paths,loadPaths,currentPath}=this.props;
    const cPath = paths.get(currentPath)
    var dirList = new ListI()

    if(cPath){
      dirList = cPath.get("data").toArray().sort(x=>x.get("file")?1:-1)//.filter(x=>!x.get("file"));
    }
    const {fullScreen} = this.props

    return (
      <div >
         

          <List  dense={!fullScreen} component="nav">
            {dirList.map(x=>(
               <ListItem disabled={x.get("file")}
                  onDoubleClick={
                    _=>this.props.setCurretPath(x.get("path"))
                  }
                  onClick={_=>this.props.pathSelect(x.get("path"))} button>
                <ListItemText primary={`${x.get("path")}`} />
                
                {!x.get("file")&&<ListItemSecondaryAction>
                  <IconButton aria-label="Abrir" onClick={
                    _=>this.props.setCurretPath(x.get("path"))
                  }>
                    <ChevronRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>}
            </ListItem>

              ))}          

          </List>
      </div>)
  }
}

export default MoveOrCopyDialog;