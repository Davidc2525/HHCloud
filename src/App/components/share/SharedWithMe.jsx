import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ApiInstance from "../../elements/API/v1/Api.js"
import Avatar from '@material-ui/core/Avatar';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import DeleteIcon from '@material-ui/icons/Delete';
import Refresh from '@material-ui/icons/Refresh';
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied';
import immutable, { fromJS } from "immutable";
import React from "react";
import { ContextMenuTrigger } from "react-contextmenu";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { ACTIONS as APP_ACTIONS } from "../../actions.js";
import { DownloadManagerInstance } from "../../elements/download_manager/index.js";
import { store } from "../../redux/index.js";
import { locationToObject, tryNormalize } from "../explorer/Util.js";
import { ACTIONS } from "./actions.js";
import { collect, ConnectedContextMenu, contextId } from "./ContextMenu.jsx";
import {
  ACTIONS as DIALOGS_ACTION
} from "../dialogs_share/actions.js";
import {
    getParent,
    isRoot,
    parsePath,
    getAppLocation,
    locationToData
} from "../explorer/Util.js";

import {mapActions} from "../dialogs_share/utils.js"
import CopyDialog from "../dialogs_share/CopyToUnity.jsx";
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

@connect((state, props) => {
    const littleMsg = state.getIn(["shared_with_me","littleMsg"]).toJS();
    var router = state.getIn(["router"]);
    var locationData = locationToData(router.location);
    
    return {locationData, sharewm: state.get("shared_with_me") ,littleMsg}
},mapActions(DIALOGS_ACTION.COPY))
@withStyles(styles,{withTheme:true})
class SharedWithMe extends React.Component {

    constructor(props) {
        super(props)
        if (props.sharewm.get("status") == "pristine") {
            store.dispatch(ACTIONS.FETCHING_SHARED.FUN());
        }

    }

    _toName(path) {
        return path.substring(path.lastIndexOf("/"));
    }

    _renderUps(item : immutable.Map): JSX.Element {
        const pathName = this._toName(item.get("path"))
        const owner = item.get("owner").toJS()
        const {locationData} = this.props;
        const currentOpenShareOwnerId = locationData.owner;
        const currentOpenShareSpath = locationData.spath
        var avatar = null;
        var hasAvatar = false;
        if(JSON.parse(owner.avatars.has)){
            hasAvatar = true;
            avatar = owner.avatars["50x50"];
        }else{
            avatar = owner.avatars["50x50"];
            
        }
        //console.error(owner)
        return (
           <ContextMenuTrigger
                //key={key}
                disabled={false}
                onItemClick={this.handleClickItemMenuContext}
                item={item}
                name={pathName}
                holdToDisplay={1000}
                collect={collect}

                id={contextId}>
                <ListItem selected={currentOpenShareOwnerId == owner.id && currentOpenShareSpath == pathName} button onClick={() => {                    
                   this.handeClickItem(item);
                }}>

                   <ListItemAvatar>
                      <Avatar
                        alt={`Avatar ${owner.id}`}
                        src={`${avatar}`}
                      />
                    </ListItemAvatar>

                    <ListItemText
                        primaryTypographyProps={{variant:"title"}}
                        primary={`${pathName}`}
                        secondary={`${owner.lastName} ${owner.firstName} (${owner.email})`}
                    />
                    {false&&
                        <ListItemSecondaryAction>
                            <IconButton aria-label="Delete"
                                onClick={_ => confirm(`Desea detener la subida de archivos?`)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    }
                </ListItem>
            </ContextMenuTrigger>
        )
    }

    _headList(count:number = 0){
        const status = this.props.sharewm.get("status");
        var msg = ""
        if(status!="loading"&&status!="error"){            
            if(count>1){
                msg = `${count} enlaces ${msg}`;
            }else{
                msg = `${count} enlace ${msg}`;
            }
        }else if(status=="loading"){
            msg = "Espere"
        }else if(status=="error"){
            msg = "Error"
        }

        return (
            <ListItem focusVisible dense={true} divider button onClick={() => { 
                const status = this.props.sharewm.get("status");    
                if(status!="loading"){
                    store.dispatch(ACTIONS.FETCHING_SHARED.FUN())
                }               
            }}>

                <ListItemIcon>
                     <Refresh />
                </ListItemIcon>

                <ListItemText
                    //primaryTypographyProps={{variant:"title"}}
                    //primary={`Refrescar`}
                    secondary={msg}
                />
            </ListItem>
            )
    }

    /**
     * Manejador de acciones para menu contextual
     */
    handleClickItemMenuContext = (e, data, target) => {

        if(data.action === "copy"){
            var owner = data.item.getIn(["owner","id"]);
            var spath = data.item.get("path");
            this.props.C_OPEN({owner,spath});
        }

        if (data.action === 'delete') {
            var idUser = data.item.getIn(["owner","id"]);
            var path = data.item.get("path");
            if(true/*confirm(`Seguro que quiere eliminar '${path}' de sus elnaces compartidos contigo?`)*/){
                store.dispatch(ACTIONS.DELETING_SHARE.FUN(idUser,path))
                return;
            }
        }

        if (data.action === 'download') {
            var idUser = data.item.getIn(["owner","id"]);
            var path = data.item.get("path");
            download(idUser,path);
            //store.dispatch(APP_ACTIONS.OPEN_LITTLE_MSG.FUN("Descarga en proceso."));
            
            return;
        }
    }

    handeClickItem = (data=null) => {
        if(data == null){
            return;
        }
        const idUser = data.getIn(["owner","id"]);
        const path = data.get("path");
        const query = btoa(`${idUser}::${path}`).replace(/=/ig,"");
        var newLocation = locationToObject();
            newLocation.pathname="/SC/open-share";
            newLocation.search=`?s=${query}`;
            newLocation.hash="";

        store.dispatch(push(newLocation))
    }

    render() {
        const status = this.props.sharewm.get("status");
        const msg = this.props.sharewm.get("msg");
        const {classes} = this.props;
        const shared = this.props.sharewm.get("shared");
        const count = shared.size;
        const isEmbedd = this.props.isEmbedd || false;
        const {littleMsg,locationData} = this.props;
        return (

            <div>

                {!isEmbedd&&<CopyDialog/>}
                {true&&<Typography variant="title" className={classes.title}>
                    Compartido conmigo
                </Typography>}
                
                <Grid item xs={12} md={12}>                  
                
                   
                   <div className={classes.demo}>
                       <List dense={isEmbedd}>
                            {this._headList(count)} 
                            {status == "loaded" &&shared.sort(x=>x.get("sharedAt")).map(x => this._renderUps(x))}
                       </List>
                   </div>

                   {count == 0&&status != "loading" &&status != "error"&&
                       <Grid style={{ height: "80%" }} container justify="center" alignItems="center">
                           <Grid item xs={6}>
                               <Typography variant="headline" gutterBottom>
                                   No se ha compartido ningun enalce contigo.
                               </Typography>
                           </Grid>
                       </Grid>
                   }
                    

                    {status == "loading" && 
                        <Grid style={{ height: "40%"}} direction="column" justify="center" alignItems="center" container>
                            <Grid item>
                                <Typography noWrap color="textSecondary" variant="title" >
                                    Cargando
                                </Typography>
                            </Grid>
                        <br/>
                            <Grid item><CircularProgress /></Grid>
                        </Grid> 
                    }

                    {status == "error" && 
                        <Grid style={{ }} direction="column" justify="center" alignItems="center" container>
                           <Grid item >
                                <SentimentDissatisfied color={"primary"} style={{ fontSize: 100 }} />
                            </Grid>

                            <Grid item >
                                <Typography noWrap color="textSecondary" variant="title" >
                                    Upss tenemos un problema
                                </Typography>
                            </Grid>

                            <Grid item >
                                <Typography variant="headline" component="h2" style={{cursor:"pointer"}}   noWrap={false}>
                                    {msg}
                                </Typography>
                            </Grid>
                       
                        </Grid> 
                    }
                </Grid>
                <ConnectedContextMenu/>

                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={littleMsg.open}
                  autoHideDuration={6000}
                  onClose={_=>store.dispatch(APP_ACTIONS.CLOSE_LITTLE_MSG.FUN())}
                  ContentProps={{
                    'aria-describedby': 'message-id',
                  }}
                  message={<span id="message-id">{littleMsg.msg}</span>}
                  
                />
            </div>

        );
    }
}


const toName= (path)=>{
    return path.substring(path.lastIndexOf("/"));
}

const download = (owner, spath, subpath = "") => {
    ApiInstance.instance.callOperation("fs::status", {
        owner,
        spath,
        subpath,
        thenCB: r => {
            var item = fromJS(r.payload);
            item = item.set("name", toName(tryNormalize(spath+"/"+subpath)).replace(/\/*/ig,"") );
            item = item.set("spath", spath);
            item = item.set("subpath", subpath);
            item = item.set("owner", owner);

            DownloadManagerInstance.instance.addDownload(item, "share")

        },
        catchCB: x => {
            store.dispatch(APP_ACTIONS.OPEN_LITTLE_MSG.FUN(x.msg));
        }
    });
}


export default SharedWithMe;
export { SharedWithMe, download };

