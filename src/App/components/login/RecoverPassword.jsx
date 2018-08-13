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
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SwipeableViews from 'react-swipeable-views';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {Field, reduxForm} from 'redux-form/immutable'
import submit,{submitRegister} from "./submit.js"
import MaskedInput from 'react-text-mask';
import Tooltip from '@material-ui/core/Tooltip';

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
	normalizeGrid:{
		height:"290px",
		//justifyContent:"center",
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

@withStyles(styles,{withTheme:true})
@reduxForm({
  form: 'recoverPassword', 
  //validate:validateRegister
})
class RecoverPassword extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			step:0
		}
	}

	onSubmitEmail(){
		return new Promise((re,rej)=>{
			re()
		})
		.then(x=>this.setState({step:1}))
	}

	onSubmitNewPassword(){
		return new Promise((re,rej)=>{
			re()
		})
		.then(x=>this.setState({step:2}))
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
					<form autoComplete="on" onSubmit={handleSubmit(this.onSubmitEmail.bind(this))}>
				      <Grid className={classes.normalizeGrid} container  direction="column" justify="center" >
				      	<Grid item>
					      	 <Field
					      	 	index={index}
					      	 	showIn={2}
						        name="email"
						        type="text"
						        component={renderField}
						        label="Correo para enviar token de verificacion."
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
				</div>}

				{this.state.step==1&&<div>
				<form autoComplete="on" onSubmit={handleSubmit(this.onSubmitNewPassword.bind(this))}>
				      <Grid className={classes.normalizeGrid} container direction="column" justify="center" >
				      	<Grid item>
					      	 <Field
					      	 	index={index}
					      	 	showIn={2}
						        name="token"
						        type="text"
						        component={renderField}
						        label="Codigo de verificacion enviado a tu correo."
						      />
				      	</Grid>

				      	<Grid item>
					      	 <Field
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
					      	 	index={index}
					      	 	showIn={2}
						        name="repeatePassword"
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
				</div>}


				{this.state.step==2&&<div>
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
				</div>}
		    </div>

      	</div>

		)
	}
}



export {RecoverPassword}