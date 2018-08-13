//index.jsx
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
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SwipeableViews from 'react-swipeable-views';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {Field, reduxForm} from 'redux-form/immutable'
import submit,{submitRegister} from "./submit.js"
import MaskedInput from 'react-text-mask';
import Tooltip from '@material-ui/core/Tooltip';


import {RecoverPassword} from "./RecoverPassword.jsx" 

import { bindKeyboard } from 'react-swipeable-views-utils';

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);
const validate = values => {
  // IMPORTANT: values is an Immutable.Map here!
  const errors = {}
  if (!values.get('password')) {
    errors.password = 'Requerido.'
  } else if (values.get('password').length < 1) {
    errors.password = 'Must be 8 characters or more'
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
const warn = values => {
  const warnings = {}
  if (values.age < 19) {
    warnings.age = 'Hmm, you seem a bit young...'
  }
  return warnings
}

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[/[A-Z]/,'-',/[A-Z]/,'-',/[A-Z]/,'-',/[1-9]/,'-',/[1-9]/,'-',/[1-9]/,'-',/[1-9]/,'-',/[1-9]/,'-',/[1-9]/,'-',/[1-9]/,'-',/[1-9]/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}
const renderFieldToken = ({showIn,index,input, label, type, meta: {touched, error, warning}}) => (
  <div>
    
    <Tooltip
    	open={touched&&(showIn==index)&&(error&&error || warning && warning)}
    	title={touched&&(error&&error || warning && warning)}
    >

    <Input
      {...input}
      type={type}
      label={label}
      //helperText={touched&&(error&&error || warning && warning)}
      //placeholder={label}
      inputComponent={TextMaskCustom}
      onChange={event=>console.warn( event.target.value.split("-").join(""))}
      fullWidth
      margin="normal"
    />
    </Tooltip>
  </div>
)
const renderField = ({showIn,index,input, label, type, meta: {touched, error, warning}}) => (
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

      fullWidth
      margin="normal"
    />
    </Tooltip>
  </div>
)
const renderFieldChekbox = ({input, label, type, meta: {touched, error, warning}}) => (
	<div>
	
	  <Grid style={{width:"100%",
					alignItems: "center",
				    width: "100%",
				    justifyContent: "left"}} 
			container spacing={8}>
					
		    <Grid item >
				<Typography variant="body1" gutterBottom>{label}</Typography>
		    </Grid>
		     
			<Grid item >		
				<Switch
					{...input}
					checked={input.value ? true : false}
					onCheck={input.onChange}
					type={type}
					//label={label}
					//placeholder={label}
					fullWidth
					margin="normal"
				/>
			</Grid>	

	    </Grid>
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
		color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
	},
});

const parseIndex = hash => {
	const index = hash.indexOf("#");
	var position = 0;
	if(index!=-1){
		position = parseInt(hash.substring(index+1))
	}
	return position;
}

@withStyles(styles,{withTheme:true})
@reduxForm({
  form: 'login', // a unique name for this form
  validate
})
@connect((state,props)=>{
	const router = state.get("router",null);
	if(true||router!=null){
		const hash = router.location.hash
		return {index:parseIndex(hash)}
	}
	return {index:0}
})
class Login extends React.Component{

	constructor(props){
		super(props);
		this.state = {index:0,NULL:1}//0 login, 1 register
	}

	setIndex(index){
		//this.setState({index})
		this.props.dispatch(push("/SC/login#"+index))
	}
	handleChangeIndex = index => {
		//this.setState({index });
		console.warn(push("/SC/login#"+index))
		this.props.dispatch(push("/SC/login#"+index))
	};

	render(){
		console.warn(this.props);
		const {classes,handleSubmit,invalid, pristine, reset,error, anyTouched,submitting} = this.props;
		
		return (
		  <div className={classes.root}>
		      <Grid className={classes.gRoot} container spacing={8}>
		       
		        <Grid item xs={12}>
		          <Paper elevation={4} className={classes.paper}>
		         	<Grid container direction="row" alignItems="center" justify="center" >
		         		<Grid item>
		         			 <Typography variant="headline">
					          	HHCloud
					          </Typography>
		         		</Grid>
		         	</Grid>
		          <SwipeableViews
		          	style={{height:"auto"}}
		          	animateHeight
			         // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
			          index={this.props.index}
			          onChangeIndex={this.handleChangeIndex}
			        >
		          
		          	<div>
						<form autoComplete="on" onSubmit={handleSubmit(submit)}>
					      <Grid container direction="column" justify="flex-start" >
					      	<Grid item>
						      	 <Field
						      	 	index={this.props.index}
						      	 	showIn={0}
							        name="email"
							        type="text"
							        component={renderField}
							        label="Correo"
							         InputProps={{
							          startAdornment: (
							            <InputAdornment position="start">
							              <AccountCircle />
							            </InputAdornment>
							          ),
							        }}
							      />
					      	</Grid>

					      	<Grid item>
					      		 <Field 
					      		 	index={this.props.index}
					      		 	showIn={0}
							      	name="password" 
							      	type="password" 
							      	component={renderField} 
							      	label="Clave" />
					      	</Grid>

					      	<Grid item>
						      	 <Field 
							      	name="remember" 				      
							      	component={renderFieldChekbox} 
							      	label="Recordar" />
						     
					      	</Grid>

					      	<Grid container direction="row" justify="flex-end" >
					      		<Grid item >	
								       <Tooltip
								       	 open={(!submitting&&anyTouched&&invalid&&this.props.index==0&&error)}
								       	 title={error}
								       >
								       <div className={classes.wrapper}>
								          <Button
								            variant="contained"
								            color="primary"
								            disabled={submitting}
								            type="submit"
								          >
								            Ingresar
								          </Button>
								          {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
								        </div>
								       </Tooltip>
								</Grid>	
					      	</Grid>

					      </Grid>
					    </form>
		          	</div>
				    
				    	{true&&<Register index={this.props.index}/>}
				    
				    	{true&&<RecoverPassword index={this.props.index}/>}
				    
				    </SwipeableViews>
		          </Paper>
		        </Grid>
		      
		      </Grid> 
		      {true&&
		      	<Grid style={{width:"100%",justifyContent:"center"}} container spacing={8}>
				
		        <Grid item >
					{this.props.index!=2&&<Button onClick={_=>this.setIndex(2)}>Olvide mi contraseña</Button>}
		        </Grid>
		         
				<Grid item >		
					{this.props.index!=1&&
						<Button onClick={_=>this.setIndex(1)} type="button" variant="contained" color="secondary" className={classes.button}>
							Registrarte
						</Button>
					}
 				</Grid>	
 				<Grid item >
					{this.props.index!=0&&
						<Button onClick={_=>this.setIndex(0)} type="button" variant="contained" color="secondary" className={classes.button}>
							Ingresar
						</Button>
					}
 				</Grid>

		      </Grid>}
		</div>

		)
	}
}

const validateRegister = values => {
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

  if (!values.get('username')) {
    errors.username = 'Requerido.'
  } else if (
    !/^([-_A-Za-z0-9]){5,25}$/.test(values.get('username'))
  ) {
    errors.username = 'El nombre de usuario no es valido.';
  }


  if (!values.get('firstname')) {
    errors.firstname = 'Requerido.'
  } else if (
    !/^([-_A-Za-z0-9]){2,20}$/.test(values.get('firstname'))
  ) {
    errors.firstname = 'Nombre no valido.';
  }
  
  if (!values.get('lastname')) {
    errors.lastname = 'Requerido.'
  } else if (
    !/^([-_A-Za-z0-9]){2,20}$/.test(values.get('lastname'))
  ) {
    errors.lastname = 'Apellido no valido.';
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
  form: 'register', 
  validate:validateRegister
})
class Register extends React.Component{
	render(){
		console.warn(this.props);
		const {classes,handleSubmit,invalid, pristine, reset,error, anyTouched,submitting,submitSucceeded} = this.props;
		const {index} = this.props;
		return (
		<div>
			<form autoComplete="on" onSubmit={handleSubmit(submitRegister)}>
		      <Grid container direction="column" justify="flex-start" >
		      	<Grid item>
			      	 <Field
			      	 	index={index}
			      	 	showIn={1}
				        name="email"
				        type="text"
				        component={renderField}
				        label="Correo"
				      />
		      	</Grid>

		      	<Grid item>
			      	 <Field
			      	 	index={index}
			      	 	showIn={1}
				        name="username"
				        type="text"
				        component={renderField}
				        label="nombre de usuario"
				      />
		      	</Grid>

		      	<Grid item>
			      	 <Field
			      	 	index={index}
			      	 	showIn={1}
				        name="firstname"
				        type="text"
				        component={renderField}
				        label="Nombre"
				      />
		      	</Grid>

		      	<Grid item>
			      	 <Field
			      	 	index={index}
			      	 	showIn={1}
				        name="lastname"
				        type="text"
				        component={renderField}
				        label="Apellido"
				      />
		      	</Grid>

		      	<Grid item>
		      		 <Field 
		      		 	index={index}
		      		 	showIn={1}
				      	name="password" 
				      	type="password" 
				      	component={renderField} 
				      	label="Contraseña" />
		      	</Grid>

		      	<Grid item>
		      		 <Field 
		      		 	index={index}
		      		 	showIn={1}
				      	name="repeatedpassword" 
				      	type="password" 
				      	component={renderField} 
				      	label="Repita contraseña" />
		      	</Grid>

		      	<Grid container direction="row" justify="flex-end" >
		      		<Grid item >	
					       <Tooltip
					       	 open={(!submitting&&anyTouched&&invalid&&index==1&&error)}
					       	 title={error}
					       >
					       <div className={classes.wrapper}>
					          <Button
					            variant="contained"
					            color="primary"
					            disabled={submitting}
					            type="submit"
					          >
					            Registrarme
					          </Button>
					          {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
					        </div>
					       </Tooltip>
					</Grid>	
		      	</Grid>

		      </Grid>
		    </form>
      	</div>

		)
	}
}


export default Login;