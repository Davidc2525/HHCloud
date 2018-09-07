
import {STATES} from "../../elements/auth/state.js"
import React from "react";
import {connect} from "react-redux"
import {
  push
} from "react-router-redux";
import User from "../../elements/API/v1/user/User.js"
import ApiInstance from "../../elements/API/v1/Api.js"
import {store} from "../../redux/index.js"
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import EditIcon from '@material-ui/icons/Edit';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import WarningIcon from '@material-ui/icons/Warning';
import {Field, reduxForm,SubmissionError} from 'redux-form/immutable';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import {Map} from "immutable"
const renderField = ({showIn,disabled,index,input, label, type, meta: {touched, error, warning}}) => (
  <div>

    <Tooltip
      open={touched&&(showIn==index)&&(error&&error || warning && warning)}
    	title={touched&&(error&&error || warning && warning)}
    >

      <TextField
        style={{margin:0}}
        {...input}
        type={type}
        label={label}
        //helperText={touched&&(error&&error || warning && warning)}
        //placeholder={label}
        disabled={disabled}

        margin="normal"
      />
    </Tooltip>
  </div>
)

const validateChangePassword = values => {
  // IMPORTANT: values is an Immutable.Map here!
  const errors = {}
  if(!values.get("currentPassword")){
    errors.currentPassword = 'Requerido.'
  }else if(!/^([A-Za-z0-9_.,&%€@#~]){8,}$/.test(values.get("currentPassword"))){
    errors.currentPassword = "Clave invalida."
  }

  if (!values.get('password')) {
    errors.password = 'Requerido.'
  } else if(!/^([A-Za-z0-9_.,&%€@#~]){8,}$/.test(values.get("password"))){
  	errors.password = "Clave invalida."
  }else if(values.get("password")!=values.get("repeatedPassword")){
  	//errors.password = "La contraseñas no coniciden."
  	errors.repeatedPassword = "La contraseñas no coinciden."
  }
  return errors
}

const style = theme => ({
  root:{
    padding:theme.spacing.unit * 2,
    flexGrow: 1,
  },
  wrapper: {
		margin: theme.spacing.unit,
		position: 'relative',
	},
  buttonProgress: {
		//color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
	},
})


@withStyles(style,{withTheme:true})
@connect( (state,props)=>{
  const stateLogin = state.getIn(["auth","state"],null);
  const user = state.getIn(["auth","dataUser","user"],null);

  if(user == null){
    return {user:null,state:STATES[0]}
  }
  return {user,state:stateLogin};
} )
@reduxForm({
  form:"profile-password",
  validate:validateChangePassword
})
class ChangePassword extends React.Component {
  constructor(props){
    super(props);
    this.state={edit:false}
  }
  _onSubmit(values){
    const id = this.props.user.get("id");
    return new Promise((resolve,reject)=>{
      ApiInstance.instance.callOperation("changepassword",{
        id,
        currentPassword: values.get("currentPassword"),
        password: values.get("password"),
        thenCB: user => {
          resolve(user);
        },
        catchCB: x => {
          reject(x);
        }
      })
    })
    .then(x=>{
      this.setState({ edit: false });
    })
    .catch(x=>{
      throw new SubmissionError({
        _error: x.msg
      })
    })
  }
  render(){
    const {handleSubmit,invalid, pristine, reset,error, anyTouched,submitting} = this.props;
    const {classes,user,state} = this.props;
    const isLogin = state != null ? state == STATES[1] : false;
    const {edit} = this.state;
    const isVerified = user!=null?user.get("emailVerified"):false;
    const {dialogEmailVerifyOpen} = this.state;
    return(
      <div className={classes.root}>
        {
          isLogin&&
          <div>
            <Grid container spacing={24}>
              <Grid item style={{display:"flex"}} justify="center" alignItems="center" xs={3}>
                <Typography variant="title">Cambiar contraseña</Typography>
              </Grid>
              <Grid item xs={3}>
                <div>
                  <FormControlLabel
                    labelPlacement="start"
                    control={
                      <Switch checked={this.state.edit} onChange={_=>{this.setState(p=>({edit:!p.edit}))}}/>
                    }
                    label={
                      <span><Typography>Cambiar</Typography></span>
                    }
                  />
                </div>
              </Grid>

              {edit&&<form className={classes.root} onSubmit={handleSubmit(this._onSubmit.bind(this))}>
                <Grid  spacing={24} container>

                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={3}>
                        <Typography>Contraseña actual</Typography>
                      </Grid>
                      <Grid item xs={9}>

                        {edit&&
                          <Field
                            name="currentPassword"
                            component={renderField}
                            type="password"
                            placeholder="Nombre"
                          />}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={3}>
                        <Typography>Nueva contraseña</Typography>
                      </Grid>
                      <Grid item xs={9}>
                        {edit&&
                          <Field
                            name="password"
                            component={renderField}
                            type="password"
                            placeholder="Apellido"
                          />}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={3}>
                        <Typography>Repita contraseña</Typography>
                      </Grid>
                      <Grid item xs={9}>

                        {edit&&
                          <Field
                            name="repeatedPassword"
                            component={renderField}
                            type="password"
                            placeholder="Nombre de usuario"
                          />}
                      </Grid>
                    </Grid>
                  </Grid>



                  {edit&&<Grid item xs={12}>
                    <Grid container >
                      <Grid item xs={3}>

                      </Grid>
                      <Grid item xs={9}>
                        <Tooltip
                          open={(!submitting&&anyTouched&&invalid&&error)}
                          title={error}
                        >
                          <div className={classes.wrapper}>
                            <Button
                              variant="contained"
                              color="primary"
                              disabled={!edit||(pristine||submitting)}
                              type="submit"
                            >
                              Cambiar
                            </Button>
                            {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
                          </div>
                        </Tooltip>

                      </Grid>
                    </Grid>
                  </Grid>}


                </Grid>

              </form>}
            </Grid>
          </div>
        }
      </div>
    )
  }
}

export default ChangePassword;
