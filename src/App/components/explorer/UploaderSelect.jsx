import React from "react";
import { connect } from "react-redux";
import { withStyles, withTheme } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import {UploadManagerInstance} from "../../elements/upload_manager/index.js";
import {ItemUpload} from "../../elements/upload_manager/ItemUpload";
import { getParent, isRoot, parsePath, tryNormalize } from "./Util.js";

const toFileList = (files: FileList): File[] => {
    let fileList: File[] = [];
    for (let x = 0; x < files.length; x++) {
        fileList.push(files.item(x));
    }
    return fileList;
}


const styles = theme => ({
    root:{
        padding:20,
    },
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
    containerInput:{
        cursor:"pointer",
        margin:5,
        background: "#e0e0e024",
        borderRadius: theme.shape.borderRadius,
        display: "flex",
        padding: 20,
        border: "1px",
        borderStyle: "dashed",
        borderColor: "grey",
    }
})

@withStyles(styles,{withTheme:true})
@connect(state => {
    var path = tryNormalize(parsePath(state.getIn(["router"]).location.hash));
    
    return {path}
})
class UploaderSelect  extends React.Component{

    _onChangeInput(event,type:string="file"){
        let files = toFileList(event.target.files);
        console.log(files)
        //	this.setState(p=>({files:[...p.files,...files]}));
        let item = new ItemUpload(this.props.path, files, type);
        UploadManagerInstance.instance.addUpload(item);
    }

    render(){
        const {classes} = this.props;
        return (
            <div className={classes.root}>
            <Grid container>
                <Grid item style={{ display: "flex" }} justify="center" xs={6}>
                    <input
                        accept="*/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        onChange={event=>this._onChangeInput(event,"file")}
                        type="file"
                    />
                    <label className={classes.containerInput} htmlFor="contained-button-file">
                        <Typography style={{margin:0}} variant="title" gutterBottom>
                            Archivos
                        </Typography>
                    </label>

                </Grid>

                <Grid item style={{ display: "flex" }} justify="center" alignContent="center" alignItems="center" xs={6}>
                    <div>
                        <input
                            className={classes.input}
                            id="contained-button-folder"
                            multiple
                            webkitdirectory="true"
                            onChange={event=>this._onChangeInput(event,"folder")}
                            type="file"
                        />
                        <label className={classes.containerInput} htmlFor="contained-button-folder">
                           <Typography style={{margin:0}} variant="title" gutterBottom>
                            Carpeta
                          </Typography>
                        </label>
                    </div>
                </Grid>                
            </Grid>
        </div>
           
        )
    }
}

export {UploaderSelect}
export default UploaderSelect