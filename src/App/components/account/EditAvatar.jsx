import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {AvatarContext} from "./AccountAvatar.jsx"
import ApiInstance from "../../elements/API/v1/Api.js"
import AvatarEditor from 'react-avatar-editor'
import LinearProgress from '@material-ui/core/LinearProgress';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import Slider from 'react-rangeslider'
import './slideCss.css'


const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  progress:{
  	...theme.mixins.toolbar,
  	width: "100%",
    //height:" 56px",
    position: "absolute",
    overflow: "hidden"
  },
  slide:{

  	width: 380,
    top: -80,
    /* left: 30px, */
    bottom: 0,
    display: "block",
    position: "relative",
    marginLeft: 20,
  },
   button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

@withStyles(styles,{withTheme:true})
class EditAvatar extends React.Component {
 
	constructor(props) {
		super(props)
		window.ea = this
		const user = this.props.props.user;
		this.src = `${ApiInstance.instance.urlService}avatar?id=${user.get("id")}`
		this.state = {
			status:"pristine",//pristine ok loading saving error
			edited:false,
			preview: null,
			src:null,
			scale:1
		}
		
		this.onCrop = this.onCrop.bind(this)
		this.onClose = this.onClose.bind(this)
		this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this)
	}

	onEntered = _=>{
		this.streamgImg(this.src);
	}

	onExited = _ => {
		this.setState({
			status: "ok", //ok loading saving error
			edited: false,
			preview: null,
			src: null,
			scale: 1
		});
	}

	streamgImg = (url) => {
		this.setState({status:"loading"})
		var xhr = new XMLHttpRequest();
		// load `document` from `cache`
		xhr.open("GET", url, true);
		xhr.responseType = "blob";
		xhr.onload = (e) => {
			if (xhr.status === 200) {
				// `blob` response
				
				var reader = new FileReader();
				reader.onload = (ee)=> {
					// `data-uri`
					setTimeout(_=>{
						this.setState({src:ee.target.result})
						this.setState({status:"pristine",edited:true,preview:ee.target.result})
					},500)
				};
				reader.readAsDataURL(xhr.response);
			};
		};
		xhr.onerror = e => {
			this.setState({status:"error"})
		}
		xhr.send();
	}
	
	onClose() {
		this.setState({
			preview: null
		})
	}

	onCrop(preview) {

		this.setState({
			preview
		})
	}

	onBeforeFileLoad(elem) {
		if (elem.target.files[0].size > 71680*2) {
			alert("File is too big!");
			elem.target.value = "";
		};
	}
	handleClickOpen = () => {
		// this.setState({ open: true });
	};

	handleClose = () => {
		this.props.handleClose()

	};
	setEditorRef = (editor) => this.editor = editor

	handleSave = data => {
		const img = this.editor.getImageScaledToCanvas().toDataURL()
		this.setState({
			preview: img
		})
	}

	onImageReady = _ => {
		this.handleSave();
	}

	handleNewImage = e => {
		this.setState({
			status:"ok",
			scale: 1,
			edited: true,
			src: e.target.files[0]
		})
		//setTimeout(_=>{this.handleSave();},500)
	}
	onImageChange = _ => {
		this.handleSave()
	}
	onPositionChange = _ => {
		console.log(_)
		this.handleSave()
	}

	handleSclae= e => {
		this.setState({status:"ok",scale:e});
		this.handleSave();
	}

	setAvatar = _ => {
		this.setState({status:"saving"})
		//const img = this.editor.getImageScaledToCanvas().toDataURL()
		
		const c = this.editor.getImage();
		var original = null;
		if(this.state.src != null){
			original = this.state.src;
		}
		c.toBlob(b => {
			
			ApiInstance.instance.callOperation("avatar::set", {
				data: b,
				//original,
				catchCB: x => {this.setState({status:"ok"});alert("No se pudo cambiar el avatar, Intentelo de nuevo.\n"+x.msg)},
				thenCB: _ => {this.handleClose();this.setState({status:"ok"});setTimeout(_=>{/*location.reload()*/},2000);}
			})
		})
	}
  render() {
    const { classes } = this.props;
    const open = this.props.state.editAvatarOpen
    const user = this.props.props.user;
    const preview = !this.state.edited ? this.src : this.state.preview
    const status = this.state.status;
    return (
      <div>
        {/*<Button onClick={this.handleClickOpen}>Open full-screen dialog</Button>*/}
        <Dialog
          onEntered={this.onEntered}	
          onExited={this.onExited}
          fullScreen
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
          	{	(status=="loading"||status=="saving")&&
          		<LinearProgress className={classes.progress}  />
      		}
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                Editar tu avatar
              </Typography>
              <Button disabled={(status=="loading"||status=="pristine"||status=="error"||status=="saving")} color="inherit" onClick={this.setAvatar}>
                Guardar
              </Button>
            </Toolbar>
          </AppBar>

          <DialogContent>
          	{(status=="pristine"||status=="ok"||status=="saving")&&
          		<Grid container justify={"flex-start"} alignItems={"center"}>
	          		{/*edit*/}	          		
	          		<Grid item xs={12} md={6}>
	          			<div style={{width:420,height:420,margin:"0 auto"}}>
		          			<AvatarEditor
		          				onImageReady={this.onImageReady}
				            	onPositionChange={this.onPositionChange}
				            	handleNewImage={this.handleNewImage}
				            	allowZoomOut={true}
				             	ref={this.setEditorRef}
						        image={this.state.src}
						        width={400}
						        height={400}
						        border={20}
						        color={[100, 100, 100, 0.6]} // RGBA
						        scale={this.state.scale}
						        rotate={0}
						    />
						    <div className={classes.slide}>
								<Grid container>
									<Grid item xs={2}>

									      <input 
									        className={classes.input}
									        accept="image/*"
									      	name="newImage" 
									      	type="file" 
									      	id="icon-button-file"
									      	onChange={this.handleNewImage} />
									      <label htmlFor="icon-button-file">
									        <IconButton  className={classes.button} component="span">
									          <PhotoCamera />
									        </IconButton>
									      </label>
									      
									</Grid>

									<Grid item xs={10} style={{marginTop:5}}>
									 	 <Slider
									 	 	style={{width:100}}
											min={0.1}
											max={3}
											step={0.001}
											tooltip={false}
									        value={this.state.scale}									        
									        onChange={this.handleSclae}
									        orientation='horizontal'
									      />
										{/*<input  value={this.state.scale} onChange={this.handleSclae} type="range" step="0.001" min="0.1'" max="3" name="scale" />*/}
									</Grid>
								</Grid>
						    	

						    	
						    </div>
	          			</div>
	          		</Grid>

	          		{/*preview*/}
	          		<Grid item xs={12} md={6} style={{padding:20}}>
	          			<Grid container spacing={8} justify={"center"} alignItems={"center"}>
							<Grid container spacing={8} justify={"center"} alignItems={"center"}>
			          			<Grid item xs={2}>
			          				<Typography variant="title">Previa </Typography>
			          			</Grid>
			          		</Grid>
	          				<Grid item style={{border: "1px solid #bebebe"}}>
								<img style={{width: 250, height: 250}} src={preview} alt="Preview" />	
	          				</Grid>
	          					
	          			</Grid>
	          		</Grid>

	          	</Grid>
          	}

          	{
          		status=="loading"&&

          		<Grid container justify={"center"}>
	          		<Grid item xs={12}>
	          			<Typography variant="title">Cargando </Typography>
	          		</Grid>
	          	</Grid>
          	}

          	{
          		status=="error"&&

          		<Grid container justify={"center"}>
	          		<Grid item xs={12}>
	          			<Typography variant="title">Error al momento de cargar tu avatar. </Typography>
	          		</Grid>
	          	</Grid>
          	}
          </DialogContent>
          
        </Dialog>
      </div>
    );
  }
}

/*EditAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
};*/


const Edit = _=>(
	<AvatarContext.Consumer>
		{(nc) => (
       		<EditAvatar {...nc}/>
      	)}
	</AvatarContext.Consumer>
	)


export default Edit
