//@ts-check
import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import filesize from "filesize";

import { connect } from "react-redux";
import { Map } from "immutable";
import { UploadManagerInstance } from "../../elements/upload_manager/index.js";

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

const toType = type => (type=="file"?"Archivo(s)":"Carpeta")


//@ts-ignore
@connect((state: Map, props) => {
    //let downloadState = state.get("downloads")
    let uploads = state.get("uploads").get("uploads")

    return { count: uploads.count(), uploads: uploads.toJS() }
})
@withStyles(styles,{withTheme:true})
class UploadView extends Component {
    constructor(props) {
        super(props);
    }

    _currentFileProgressUpload(file:File,round = false){
        let progress = 0;
        if(file.hasOwnProperty("progress")){
            progress = file.progress
        }

        return round ? Math.round(progress) :  progress;
    }

    _renderUps(id: string): JSX.Element {
        let up = UploadManagerInstance.instance.getUpload(id);
        if(up==null){
            return <div></div>
        }

        let files = up.getFiles();
        let currentFile = up.getCurrentFile();
        return (
            <div>
                <ListItem button onClick={() => {                    
                   // history.push("/SC/unidad#" + data.getIn(["path"]))
                }}>

                    <ListItemText
                        primary={`${up.getName()}, ${toType(up.getType())}`}
                        secondary={`(T ${files.length}, U ${up.getUploaded().length}, E ${up.getUploadedFilesWithError().length}), ${up.getCurrentFile().name} `}
                    />
                    <ListItemSecondaryAction>
                        <IconButton aria-label="Delete"
                            onClick={_ => confirm(`Desea detener la subida de archivos?`) && up.cancelUpload()}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                {true &&
                    <LinearProgress value={this._currentFileProgressUpload(currentFile,false)}  valueBuffer={(up.getUploaded().length/files.length )*100} variant={"buffer"} />}

            </div>
        )
    }

    render() {
        const { count, uploads ,classes} = this.props;

        return (
            
            <div /*style={{height:this.props.h,overflow:"auto"}}*/ className={classes.root}>
                <Typography variant="title" className={classes.title}>
                    Subiendo
                </Typography>
                {(count > 0) &&
                    <Typography className={classes.title} variant="body2" gutterBottom>
                        <span>Subidas en proceso <strong>{count}.</strong></span>
                    </Typography>}
                <Grid item xs={12} md={12}>
                    {count == 0 &&
                        <Grid style={{ height: "100%" }} container justify="center" alignItems="center">
                            <Grid item xs={6}>
                                <Typography variant="headline" gutterBottom>
                                    No hay subidas en proceso.
                                </Typography>
                            </Grid>
                        </Grid>
                    }
                    <div className={classes.demo}>
                        <List dense={false}>
                            {Object.keys(uploads).map(x => this._renderUps(x))}
                        </List>
                    </div>
                </Grid>


            </div>
        )
    }
}

export { UploadView };
export default UploadView