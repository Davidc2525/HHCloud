//Login.jsx
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import MaskedInput from 'react-text-mask';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import { auth } from "../../elements/auth/index.js";


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
const renderFieldChekbox = ({input,disabled, label, type, meta: {touched, error, warning}}) => (
	<div>

	  <Grid style={{width:"100%",
          alignItems: "center",
          width: "100%",
          justifyContent: "left"}}
	      container spacing={8}
	  >

      <Grid item >
				<Typography variant="body1" gutterBottom>{label}</Typography>
      </Grid>

			<Grid item >
			   
				<Switch
					{...input}
					disabled={disabled}
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
		//color: green[500],
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
	return {}
})
class Login extends React.Component{

	constructor(props){
		super(props);
		this.state = {successLogin:!true,index:0,NULL:1}//0 login, 1 register
	}

	setIndex(index){
		//this.setState({index})
		this.props.dispatch(push("/SC/login#"+index))
	}
	handleChangeIndex = index => {
		//this.setState({index });
		//console.warn(push("/SC/login#"+index))
		this.props.dispatch(push("/SC/login#"+index))
	};
	handleSubmitForm(values){
		return auth.Auth.signIn(values.get("email"),values.get("password"),values.get("remember"))
		.then(authObject => {
			console.log("session iniciada", authObject)
			setTimeout(_=>{auth.Auth.setStateLogin()},1000)
			this.setState({successLogin:true})
			setTimeout(_=>{this.setState({successLogin:false})},3000)
		}).catch(x => {
			if (x.username != null) {
				throw new SubmissionError({
					email: x.username,
					_error: x.msg
				})
			} else if (x.password != null) {
				throw new SubmissionError({
					password: "Clave incorrecta.",
					_error: x.msg
				})
			}else{
				throw new SubmissionError({
					_error: x.msg
				})
			}

		})
	}
	render(){
		console.warn(this.props);
		const {classes,handleSubmit,invalid, pristine, reset,error, anyTouched,submitting} = this.props;

		return (
          	<div>
          		{this.state.successLogin&&
	          		<Slide direction="up" mountOnEnter unmountOnExit in={this.state.successLogin}>
	          			<div>
		          			<Grid container direction="column" alignItems="center" justify="space-evenly"
                      style={{justifyContent:"space-evenly",height:"260px"}}>
		          				<Grid item>
                        <Typography variant="display3">
                          Bienvenido!
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="title">
                          Estamos cargando tu informacion.
                        </Typography>
                      </Grid>
                      <Grid style={{marginTop:"15px"}} item>
                        <CircularProgress size={40} />
                      </Grid>
                    </Grid>
	          			</div>
	          		</Slide>
          		}
              {!this.state.successLogin &&
                <Slide direction="up" mountOnEnter unmountOnExit in={!this.state.successLogin}>
                  <form autoComplete="on" onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
                    <Grid container direction="column" justify="flex-start" >
                      <Grid item>
                        <Field
                          disabled={submitting}
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
                          disabled={submitting}
                          index={this.props.index}
                          showIn={0}
                          name="password"
                          type="password"
                          component={renderField}
								      	label="Contraseña" />
                      </Grid>

                      <Grid item>
                        <Field
                          disabled={submitting}
                          name="remember"
                          type="checkbox"
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
                </Slide>
              }
          	</div>
        )
	}
}


export { Login };

