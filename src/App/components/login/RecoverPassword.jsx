//RecoverPassword.jsx
import React from "react";
import {connect} from "react-redux"
import {
  push
} from "react-router-redux";
import {store} from "../../redux/index.js"
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Slide from '@material-ui/core/Slide';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SwipeableViews from 'react-swipeable-views';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {Field, reduxForm} from 'redux-form/immutable'
import submit,{submitRegister} from "./submit.js"
import MaskedInput from 'react-text-mask';
import Tooltip from '@material-ui/core/Tooltip';
import {SubmissionError} from 'redux-form/immutable'
import api from "../../elements/API/v1/Api.js";
function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
		style = {
			{
				width: "100%",
				fontSize: "30px",
				"textAlign": "center",
				outline: "transparent",
				border: "none",
			}
		}
		{...other}
		ref={inputRef}
		mask={[/[A-Z0-9]/,'-',/[A-Z0-9]/,'-',/[A-Z0-9]/,'-',/[A-Z0-9]/,'-',/[A-Z0-9]/,'-',/[A-Z0-9]/,'-',/[A-Z0-9]/,'-',/[A-Z0-9]/,'-',/[A-Z0-9]/,'-',/[A-Z0-9]/,'-',/[A-Z0-9]/]}
		placeholderChar={'\u2000'}
		showMask
    />
  );
}
const renderFieldToken = ({disabled,showIn,className,index,input, label, type, meta: {touched, error, warning}}) => (
  <div>
    
    <Typography variant="subheading">Codigo de verificacion</Typography>
    <Tooltip
    	open={touched&&(showIn==index)&&(error&&error || warning && warning)}
    	title={touched&&(error&&error || warning && warning)}
    >
    <Input
		{...input}
		type={type}
		label={label}
		helperText={"Codigo de verificacion"}
		//placeholder={label}
		inputComponent={TextMaskCustom}
		onChange={event=>console.warn( event.target.value.split("-").join(""))}
		fullWidth
		margin="normal"
    	disabled={disabled}
    />
    </Tooltip>
  </div>
)


const renderField = ({showIn,disabled,index,input, label, type, meta: {touched, error, warning}}) => (
  <div>
    
    <Tooltip
    	open={touched&&(showIn==index)&&(error&&error || warning && warning)}
    	title={touched&&(error&&error || warning && warning)}
    >

    <TextField
      {...input}
      type={type}
      label={label}
      //helperText={touched&&(error&&error || warning && warning)}
      //placeholder={label}
      disabled={disabled}
      fullWidth
      margin="normal"
    />
    </Tooltip>
  </div>
)

const styles = theme => ({
	root: {
		margin: "0 auto",
		flexGrow: 1,
		backgroundColor: "#2196f3", ///"#f2f2f2",
		width: "100%",
		height: "80px",

	},
	paper: {
		//borderRadius:"1.3em",
		padding: theme.spacing.unit * 2,
		//textAlign: 'center',
		color: theme.palette.text.secondary,
	},
	gRoot: {
		[theme.breakpoints.up("md")]: {
			maxWidth: "40%"
		},
		//height:"400px",
		margin: "0 auto",
		padding: theme.spacing.unit * 2,
		justifyContent: "center",
	},
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative',
	},
	buttonSuccess: {
		backgroundColor: green[500],
		'&:hover': {
			backgroundColor: green[700],
		},
	},
	fabProgress: {
		color: green[500],
		position: 'absolute',
		top: -6,
		left: -6,
		zIndex: 1,
	},
	buttonProgress: {
		//color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
	},
	normalizeGrid:{
		height:"290px",
		//justifyContent:"center",
	},
	tokenInpput: {
		width:"100%",
		fontSize: "30px",
		"textAlign": "center",
	    outline: "transparent",
	    border: "none",
	}
});

const parseIndex = hash => {
	const index = hash.indexOf("#");
	var position = 0;
	if(index!=-1){
		position = parseInt(hash.substring(index+1))
	}
	return position;
}

const validateRecover = values => {
  // IMPORTANT: values is an Immutable.Map here!
  const errors = {}
  if (!values.get('password')) {
    errors.password = 'Requerido.'
  } else if(!/^([A-Za-z0-9_.,&%€@#~]){8,}$/.test(values.get("password"))){
  	errors.password = "Clave invalida."
  }else if(values.get("password")!=values.get("repeatedpassword")){
  	//errors.password = "La contraseñas no coniciden."
  	errors.repeatedpassword = "La contraseñas no coinciden."
  }

 
  if (!values.get('email')) {
    errors.email = 'Requerido.'
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.get('email'))
  ) {
    errors.email = 'La direccion de correo no es valida.';
  }
 
  return errors
}


@withStyles(styles,{withTheme:true})
@reduxForm({
  form: 'recoverPassword', 
  validate:validateRecover
})
class RecoverPassword extends React.Component{
	constructor(props){
		super(props);
		window.rc = this
		this.state = {
			step:0
		}
	}

	onSubmitEmail(values){
		const email = values.get("email");

		
		return new Promise((re,rej)=>{
			api.instance.callOperation("sendrecoveryemail", {
				email,
				thenCB: response => re(response),
				catchCB: response => rej(response),
			})
		})
		.then(x=>this.setState({step:1}))
		.catch(x => {
			if (x.error == "email_exception") {
				throw new SubmissionError({
					_error: "No se pudo enviar el email, intentelo de nuevo."
				})
			}
			throw new SubmissionError({
				email:x.msg,
				_error: x.msg
			})
		})
	}

	onSubmitNewPassword(values) {
		const email = values.get("email");
		const token = values.get("token")
		const password = values.get("password")

		return new Promise((re, rej) => {
				api.instance.callOperation("changepasswordbyrecover", {
					token,
					password,
					email,
					thenCB: response => re(response),
					catchCB: response => rej(response),
				})
			})
			.then(x => {
				this.setState({
					step: 2
				});
				this.props.reset();
			})
			.catch(x => {
				if (x.error == "token_exception") {
					throw new SubmissionError({
						token: x.msg,
						_error: x.msg
					})
				}

				if (x.error == "password_validation") {
					throw new SubmissionError({
						password: x.msg,
						_error: x.msg
					})
				}

				throw new SubmissionError({
					_error: x.msg
				})
			})
	}

	handleChangeIndex = index => {
		//this.setState({index });
		console.warn(push("/SC/login#"+index))
		this.props.dispatch(push("/SC/login#"+index))
	};
	render(){
		console.warn(this.props);
		const {classes,handleSubmit,invalid, pristine, reset,error, anyTouched,submitting,submitSucceeded} = this.props;
		const {index} = this.props;
		return (
		<div style={{height:"290px"}}>
			<div index={this.state.step}>
				{this.state.step==0&&<div >
					<Slide direction="up" mountOnEnter unmountOnExit in={this.state.step==0}>	
					
					<form autoComplete="on" onSubmit={handleSubmit(this.onSubmitEmail.bind(this))}>
				      <Grid className={classes.normalizeGrid} container  direction="column" justify="center" >
				      	<Grid item>
					      	 <Field
					      	 	disabled={submitting}
					      	 	index={index}
					      	 	showIn={2}
						        name="email"
						        type="text"
						        component={renderField}
						        label="Correo para enviar codigo de verificacion."
						      />
				      	</Grid>


				      	<Grid container direction="row" justify="flex-end" >
				      		<Grid item >	
							       <Tooltip
							       	 open={(!submitting&&anyTouched&&invalid&&index==2&&error)}
							       	 title={error}
							       >
							       <div className={classes.wrapper}>
							          <Button
							            variant="contained"
							            color="primary"
							            disabled={submitting}
							            type="submit"
							          >
							            Enviar
							          </Button>
							          {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
							        </div>
							       </Tooltip>
							</Grid>	
				      	</Grid>

				      </Grid>
				    </form>
				    </Slide>
				</div>}

				{this.state.step==1&&<div>
					<Slide direction="up" mountOnEnter unmountOnExit in={this.state.step==1}>	
					
				<form autoComplete="on" onSubmit={handleSubmit(this.onSubmitNewPassword.bind(this))}>
				      <Grid className={classes.normalizeGrid} container direction="column" justify="center" >
				      	<Grid item>
					      	 <Field
					      	 	disabled={submitting}
					      	 	index={index}
					      	 	showIn={2}
						        name="token"
						        type="text"
						        component={renderFieldToken}
						        label="Codigo de verificacion enviado a tu correo."
					      	 	className={classes.tokenInpput}
						      />
				      	</Grid>

				      	<Grid item>
					      	 <Field
					      	 	disabled={submitting}
					      	 	index={index}
					      	 	showIn={2}
						        name="password"
						        type="password"
						        component={renderField}
						        label="Nueva contraseña"
						      />
				      	</Grid>

				      	<Grid item>
					      	 <Field
					      	 	disabled={submitting}
					      	 	index={index}
					      	 	showIn={2}
						        name="repeatedpassword"
						        type="password"
						        component={renderField}
						        label="Repetir contraseña"
						      />
				      	</Grid>


				      	<Grid container direction="row" justify="flex-end" >
				      		<Grid item >	
							       <Tooltip
							       	 open={(!submitting&&anyTouched&&invalid&&index==2&&error)}
							       	 title={error}
							       >
							       <div className={classes.wrapper}>
							          <Button
							            variant="contained"
							            color="primary"
							            disabled={submitting}
							            type="submit"
							          >
							            Cambiar
							          </Button>
							          {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
							        </div>
							       </Tooltip>
							</Grid>	
				      	</Grid>

				      </Grid>
				    </form>
				    </Slide>
				</div>}


				{this.state.step==2&&<div>
					<Slide direction="up" mountOnEnter unmountOnExit in={this.state.step==2}>	
					
					<Grid className={classes.normalizeGrid} container direction="row" alignItems="center" justify="center"  >
			      		<Grid item >	
						       
				     
				          <Button
				          	onClick={_=>{this.setState({step:0}),this.props.dispatch(push("/SC/login#0"))}}
				            variant="contained"
				            color="primary"
				          >
				            Ingresar
				          </Button>
				       
			      		</Grid>	
						       
			      	</Grid>
			      	</Slide>
				</div>}
		    </div>

      	</div>

		)
	}
}



export {RecoverPassword}