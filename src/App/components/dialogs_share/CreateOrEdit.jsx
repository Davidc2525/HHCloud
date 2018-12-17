import React from "react";
import { push } from "react-router-redux";
import { store } from "../../redux/index.js";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import ApiInstance from "../../elements/API/v1/Api.js";
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import TimeIcon from '@material-ui/icons/AccessTime';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import FolderIcon from '@material-ui/icons/Folder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import PeopleIcon from '@material-ui/icons/People';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LinkIcon from '@material-ui/icons/Link';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Suggetter from "./InputSuggetUsers.jsx"
import {locationToObject,tryNormalize} from "../explorer/Util.js"

import frenchStrings from 'react-timeago/lib/language-strings/es'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import {List} from "immutable";
import TimeAgo from "react-timeago"

import Avatar from '@material-ui/core/Avatar';
const formatter = buildFormatter(frenchStrings)
const styles = theme => ({
	appBar: {
		position: 'relative',
	},
	flex: {
		flex: 1,
	},
	root: {
		display: 'flex',
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		flexBasis: '33.33%',
		flexShrink: 0,
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary,
	},
	formControl: {
		margin: theme.spacing.unit * 2,
	},
	group: {
		margin: `${theme.spacing.unit}px 0`,
	},
	separate:{
		marginTop:"20px"
	},
	sizeIcons:{
		fontSize:"50px"
	},
	contentIcon:{
		display: "flex",
    	justifyContent: "center",
	},
	row: {
		marginTop:20,
		display: 'flex',
		justifyContent: 'left',
	},
	avatar: {
		margin: 5,
	},
	progress: {
		...theme.mixins.toolbar,
		width: "100%",
		//height:" 56px",
		position: "absolute",
		overflow: "hidden"
	}
});

import {
	ACTIONS
} from "./actions.js";
import {ACTIONS as APP_ACTIONS} from "../../actions.js"

import {mapActions} from "./utils.js"


function Transition(props) {
  return <Slide direction="up" {...props} />;
}


@withStyles(styles,{withTheme:true})
@connect((state,props)=>{
	const createDialog = state.getIn(["dialogs_share","create_edit"]);
	const owner = state.getIn(["auth","dataUser","user","id"]);

	return {createDialog,owner}

},mapActions(ACTIONS.CREATE_EDIT,mapActions(APP_ACTIONS)))
class CreateOrEdit extends React.Component {
	constructor(props){
		super(props);

	}

	handleClose = event => {
		if(this.disabledEscape()){
			if(confirm("Tiene algunos datos que guardar, desea salir?")){
				this.props.CLOSE()
			}
		}else{

		this.props.CLOSE()
		}
	}

	handleSave = event => {
		const type = this.props.createDialog.get("type");
		const PATH = this.props.createDialog.get("path");
		if(type=="edit"||type=="create"){
			this.props.SAVE_CONF_SHARE();
			this.props.OPEN_LITTLE_MSG(`Ruta compartida '${PATH}'`);
		}
		if(type=="create"){
			setTimeout(_=>{
				const path = this.props.createDialog.get("path");
			 	const {owner} = this.props;
			 	this.props.OPEN({owner,path,dtype:"edit"})
			},800)
		}

		if(type=="delete"){
			this.props.DELETE_SHARE(PATH);
			this.props.OPEN_LITTLE_MSG(`Se dejo de compartir la rruta. '${PATH}'`);
		}
	}

	disabledEscape = _=> {
		const modfMode = this.props.createDialog.get("mode");
		const modfUsers = this.props.createDialog.get("users");

		const status = this.props.createDialog.get("status");
		return status=="loading"||status=="saving"||status=="deleting"||modfMode||modfUsers;
	}
	render(){
		const status = this.props.createDialog.get("status");
		const open = this.props.createDialog.get("open");
		const path = this.props.createDialog.get("path");
		const type = this.props.createDialog.get("type");
		const {classes} = this.props;


		const modfMode = this.props.createDialog.get("mode");
		const modfUsers = this.props.createDialog.get("users");


		return (
			<div>
				<Dialog
					//disableEscapeKeyDown={this.disabledEscape()}
					fullScreen={true}
					open={open}
					TransitionComponent={Transition}
					keepMounted
					onClose={this.handleClose}
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
		        >
		        	<AppBar color="secondary" className={classes.appBar}>
						{	(status=="loading"||status=="saving"||status=="deleting")&&
							<LinearProgress className={classes.progress}  />
						}
			            <Toolbar>
			              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
			                <CloseIcon />
			              </IconButton>
			              <Typography variant="title" color="inherit" className={classes.flex}>
			                {type=="create"&&"Compartir rruta"}
							{type=="edit"&&"Editar rruta compartida"}
							{type=="delete"&&"Dejar de compartir"}
			              </Typography>
			              {
			              	(status=="ok"||status=="error")&&
				              <Button  color="inherit" onClick={this.handleSave}>
				                {type=="create"&&"Compartir"}
								{type=="edit"&&"Guardar"}
								{type=="delete"&&"Eliminar"}
				              </Button>
			          		}

			          		{false&&
			          			<CircularProgress style={{ color: "#2196F3"}}/>
			          		}
			            </Toolbar>
			        </AppBar>


					{(type=="create"||type=="edit")&&<ContentCreateEdit {...this.props}/>}
					{(type=="delete")&&<ContentDelete {...this.props}/>}

					<DialogActions>
						{type=="delete"&&
							<Button color="secondary" variant="contained" onClick={_=>{
							this.props.OPEN({owner:"david",path,dtype:"edit"})
							}} color="primary">
							  Editar
							</Button>
						}
						{type=="edit"&&
							<Button color="secondary" variant="contained" onClick={_=>{
								this.props.OPEN({owner:"david",path,dtype:"delete"})
							}} color="primary">
							  Dejar de compartir
							</Button>
						}
					</DialogActions>

		        </Dialog>
			</div>
		)
	}
}

@withStyles(styles,{withTheme:true})
class ContentCreateEdit extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			expanded: null,
		};
	}

	handleChange = mode => (event, expanded) => {
		this.props.SET_MODE_SHARE(mode)

	};

	 handleChange2 = event => {
	 	this.props.SET_MODE_SHARE(event.target.value)
	    //this.setState({ value: event.target.value });
	  };

	render(){
		const status = this.props.createDialog.get("status");
		const msg = this.props.createDialog.get("msg");
		const path = this.props.createDialog.get("path");
		const type = this.props.createDialog.get("type");
		const data = this.props.createDialog.get("data",null);
		const mode = data.get("mode","P");
		const {owner} = this.props;
		const { classes } = this.props;
    	const { expanded } = this.state;
    	const cantEdit = !(status == "ok" || status == "error")

    	//var location = locationToObject();
    	const query = btoa(`${owner}::${path}`).replace(/=/ig,"");
        var newLocation = new URL(location);
            newLocation.pathname="/SC/open-share";
            newLocation.search=`?s=${query}`;
            newLocation.hash="";
		return(
			<DialogContent style={{paddingTop:"24px"}}>
            	<DialogContentText id="alert-dialog-slide-description">
            	  	{false&&(status=="loading")&&
	            		<div>
	            			Cargando
	            	  	</div>
	            	}

	            	{false&&(status=="saving")&&
	            		<div>
	            			Guardando
	            	  	</div>
	            	}

	            	{status=="error"&&
	            		<div>
	            			{msg}
	            	  	</div>
	            	}

            	 	{true&&
	            		<div>
	            	  		{/*data.get("shareWith").get("users").map(u=>(<p>{u.get("username")}</p>))*/}

	            	  		<div className={classes.root}>
	            	  			<Grid container>
	            	  				<Grid container>
	            	  					<Grid item xs={12} sm={1} className={classes.contentIcon}>
											{true&&<FolderSharedIcon className={classes.sizeIcons}/>}
			            	  			</Grid>

	            	  					<Grid item item xs={12} sm={11}>
				            	  			<FormControl disabled={cantEdit} component="fieldset" required className={classes.formControl}>
									          <FormLabel component="legend">Modo de compartir</FormLabel>
									          <RadioGroup
									          	row={true}
									            aria-label="mode"
									            name="mode"
									            className={classes.group}
									            value={mode}
									            onChange={this.handleChange2}
									          >
									            <FormControlLabel value="P" control={<Radio />} label="Publico" />
									            <FormControlLabel value="U" control={<Radio />} label="A usuarios" />

									          </RadioGroup>
									        </FormControl>
		            	  				</Grid>
		            	  			</Grid>

		            	  			<Grid container >
			            	  			<Grid item xs={12} sm={1} className={classes.contentIcon}>
											<PeopleIcon className={classes.sizeIcons}/>
			            	  			</Grid>
			            	  			<Grid item xs={12} sm={11}>
											<Suggetter {...this.props}/>
			            	  			</Grid>
		            	  			</Grid>

		            	  			<Grid container className={classes.separate}>
			            	  			<Grid item xs={12} sm={1} className={classes.contentIcon}>
				            	  			{mode=="P"&&<VisibilityIcon className={classes.sizeIcons}/>}
			            	  				{mode=="U"&&<VisibilityOffIcon className={classes.sizeIcons}/>}
			            	  			</Grid>

			            	  			<Grid item xs={12} sm={11} >
			            	  				<Typography variant="title">Visibilidad: </Typography>
				            	  			{mode=="P"&&<Typography>En modo publico podra ver lo que compartes todos los usuarios que tengan el enlace, puedes añadir usuarios a los que quieres que le aparesca el enlace en su vandeja: Compartido conmigo.</Typography>}
			            	  				{mode=="U"&&<Typography>En modo privado podra ver lo que compartes solo los usuarios espesificos, a esos usuarios se les mostrar el enlace en sus vandeja: Compartido conmigo.</Typography>}
			            	  			</Grid>
		            	  			</Grid>

		            	  			{type=="edit"&&
			            	  			<Grid container className={classes.separate}>
				            	  			<Grid item xs={12} sm={1} className={classes.contentIcon}>
					            	  			<LinkIcon className={classes.sizeIcons}/>
				            	  			</Grid>
				            	  			<Grid item xs={12} sm={11} >
				            	  				<Typography variant="title">Enlace: </Typography>
				            	  				<Typography style={{wordWrap: "break-word"}}><a target="_new" href={newLocation.toString()}>{newLocation.toString()}</a></Typography>
				            	  			</Grid>

			            	  			</Grid>
			            	  		}

			            	  		<Grid container className={classes.separate}>
			            	  			<Grid item xs={12} sm={1} className={classes.contentIcon}>
				            	  			<FolderIcon className={classes.sizeIcons}/>
			            	  			</Grid>
			            	  			<Grid item xs={12} sm={11} >
			            	  				<Typography variant="title">Ruta: </Typography>
			            	  				<Typography>{path}</Typography>
			            	  			</Grid>

			            	  		</Grid>

			            	  		{
			            	  			type=="edit"&&
			            	  			<Grid container className={classes.separate}>
				            	  			<Grid item xs={12} sm={1} className={classes.contentIcon}>
					            	  			<TimeIcon className={classes.sizeIcons}/>
				            	  			</Grid>
				            	  			<Grid item xs={12} sm={11} >
				            	  				<Typography variant="title">Compartido: </Typography>
				            	  				<Typography><TimeAgo formatter={formatter} date={data.get("sharedAt")}/></Typography>
				            	  			</Grid>
				            	  		</Grid>
			            	  		}

	            	  			</Grid>


	            	  		</div>
	            	  	</div>
	            	}

            	</DialogContentText>
          	</DialogContent>
		)
	}
}


@withStyles(styles,{withTheme:true})
class ContentDelete extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			expanded: null,
		};
	}

	handleChange = mode => (event, expanded) => {
		this.props.SET_MODE_SHARE(mode)

	};

	 handleChange2 = event => {
	 	this.props.SET_MODE_SHARE(event.target.value)
	    //this.setState({ value: event.target.value });
	  };

	render(){
		const status = this.props.createDialog.get("status");
		const msg = this.props.createDialog.get("msg");
		const path = this.props.createDialog.get("path");
		const type = this.props.createDialog.get("type");
		const data = this.props.createDialog.get("data",null);
		const users = data.getIn(["shareWith", "users"],new List());
		const mode = data.get("mode","P");
		const {owner} = this.props;
		const { classes } = this.props;
    	const { expanded } = this.state;

    	//var location = locationToObject();
    	const query = btoa(`${owner}::${path}`).replace(/=/ig,"");
        var newLocation = new URL(location);
            newLocation.pathname="/SC/open-share";
            newLocation.search=`?s=${query}`;
            newLocation.hash="";
		return(
			<DialogContent style={{paddingTop:"50px"}}>
            	<DialogContentText id="alert-dialog-slide-description">

	            	{status=="error"&&
	            		<div>
	            			{msg}
	            	  	</div>
	            	}

            	 	{true&&
	            		<div>
	            	  		{/*data.get("shareWith").get("users").map(u=>(<p>{u.get("username")}</p>))*/}

	            	  		<div className={classes.root}>
	            	  			<Grid container justify={"center"}>
	            	  				<Grid item xs={12} sm={4}  justify={"center"} style={{display:"flex"}} className={classes.separate}>
			            	  			<div>
			            	  			 <ErrorIcon style={{fontSize:100}}/>
			            	  			</div>
		            	  			</Grid>

		            	  			<Grid item xs={12} sm={8}  className={classes.separate}>
										<p>
											<Typography variant="display2">
												Desea dejar de compartir
											</Typography>
										</p>
										<p>
											<Typography variant="title">
											{path} ?
											</Typography>
										</p>
										{users.size>0&&
										<p>
											<Typography >
												Esta rruta esta compartida con {users.size} usuarios.
											</Typography>
											<div className={classes.row}>
												{
													users.map(u=>{

														const id = u.get("id")
														return (
															<Avatar
																className={classes.avatar}
													        	alt={`Avatar ${id}`}
													        	src={`${ApiInstance.instance.urlService}avatar?id=${id}&size=50x50`}
													        />
														)

													})
												}
											</div>

										</p>}
		            	  			</Grid>

		            	  			<Grid item xs={8}>

		            	  			</Grid>
	            	  			</Grid>


	            	  		</div>
	            	  	</div>
	            	}

            	</DialogContentText>
          	</DialogContent>
		)
	}
}

export {CreateOrEdit}
