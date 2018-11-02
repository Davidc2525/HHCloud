import React from 'react';
import ApiInstance from "../../elements/API/v1/Api.js"
import {fetchingPath} from "../explorer/actions"
import {getParent,mergePath,getName} from "../explorer/Util.js"

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

import {
  ACTIONS
} from "./actions.js";

import {mapActions} from "./utils.js"
import {ACTIONS as APP_ACTIONS} from "../../actions.js"
function Transition(props) {
  return <Slide direction="up" {...props} />;
}


@withMobileDialog()
@connect((state, props) => {

  const copy = state.getIn(["dialogs_share", "copy"]);
  return {
    copy
  }
},mapActions(ACTIONS.COPY,mapActions(APP_ACTIONS)))
class CopyToUnity extends React.Component {

  constructor(props) {
    super(props)



    const {
      copy
    } = props;
    const owner = copy.get("owner");
    const spath = copy.get("spath");
    const subpath = copy.get("subpath");

    this.state = {
      open: true,
      paths: Map(),
      currentPath: "/",
      pathSelectedToMoveOrCopy: null,
      fetchingPath: false,
      history: [],
      status: "ok",
      cantEdit: true,

      owner,
      spath,
      subpath,

      inProgress: false,
      progress: 0,
    };
  }

  


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
          this.setState({status:"error",errorMsg:payload.msg})
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
        var name="";
        const {
          copy
        } = this.props;
        const owner = copy.get("owner");
        const spath = copy.get("spath");
        const subpath = copy.get("subpath");
        if(subpath!=null && subpath!=""&& subpath!="/"){
          name = getName(subpath)
        }else{
          name = getName(spath);
        }
        this.setState({pathSelectedToMoveOrCopy:mergePath(path,name)})
      }
  
  }

  onClose(){
    this.props.C_CLOSE();
    this.setState(({paths:new Map(),currentPath:"/",pathSelectedToMoveOrCopy:null,status:"ok"}))
  }

  onOperation(){
   debugger
    const { pathSelectedToMoveOrCopy } = this.state;
   const {
        copy
      } = this.props;
      const owner = copy.get("owner");
      const spath = copy.get("spath");
      var subpath = copy.get("subpath");

      subpath = subpath == null ? "":subpath;
      

    this.setState({inProgress:true,cantEdit:false})
    ApiInstance.instance.callOperation("user::copy",{
        owner,
        spath,
        srcpath:subpath,
        dstpath: pathSelectedToMoveOrCopy,
        onProgress:(_,progress)=>{this.setState({progress})},
        //onReady
        thenCB:(payload)=>{
         
            
          console.warn("onOperation", this.props, payload)
          this.props.C_CLOSE();
          
         

          //store.dispatch(fetchingPath(getParent(this.props.path)))
          store.dispatch(fetchingPath(getParent( pathSelectedToMoveOrCopy )))
          this.setState(({inProgress:false,cantEdit:true,paths:new Map(),currentPath:"/",pathSelectedToMoveOrCopy:null}))
        },
        catchCB:(payload)=>{
         
          this.setState({inProgress:false,cantEdit:true,status:"error",errorMsg:payload.msg})
        }
      })
  }

  render() {
    const {fullScreen} = this.props;
    return (
      <div>
       
        <Dialog
          disableBackdropClick={this.state.inProgress}
          disableEscapeKeyDown={this.state.inProgress}
          fullScreen={fullScreen}
          //style={{minWidth:"500px"}}
          open={this.props.copy.get("open")}
          onEnter={this.onEnter.bind(this)}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.onClose.bind(this)}
          //onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            Copiar a mi unidad, selecciona destino.
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
              <Grid item xs>
                <ListPath 
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
                  <Typography variant="display3" >{"Copiando"}</Typography>
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
                  {"Copiar "}{this.state.pathSelectedToMoveOrCopy}
                </Typography>      
              </div>}
            <Button onClick={this.onClose.bind(this)} disabled={!this.state.cantEdit} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.onOperation.bind(this)} disabled={(!this.state.cantEdit||this.state.pathSelectedToMoveOrCopy==null)}  variant="contained" size="small" color="primary"   >
               Copiar
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
      dirList = cPath.get("payload").toArray().sort(x=>x.get("file")?1:-1)//.filter(x=>!x.get("file"));
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

export default CopyToUnity;