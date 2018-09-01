
import SendVerifyEmailDialog from "./SendVerifyEmailDialog.jsx"
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


const renderSelectField = ({
  input,
  label,
  meta: {touched, error},
  children,
  ...custom
}) => (
  <FormControl /*className={classes.formControl}*/>
    <Select      
      onChange={(event, index, value) => input.onChange(event.target.value)}
      inputProps={{
          name: 'gender',
          ...input
      }}
    >
      {children}
    </Select>
  </FormControl>
)

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

const genders = [{name:"n",value:"No deseo espesificar"},{name:"m",value:"Hombre"},{name:"f",value:"Mujer"}];
const Gender = ({name}) => {
  const thisGender = genders.find(item => item.name == name)
  return thisGender != null ? thisGender.value : "None";
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

// @ts-ignore
@withStyles(style,{withTheme:true})
@connect( (state : Map, props)=>{
  const stateLogin = state.getIn(["auth","state"],null);
  const user = state.getIn(["auth","dataUser","user"],null);

  if(user == null){
    return {user:null,state:STATES[0]}
  }
  return {user,state:stateLogin,initialValues:user};
} )
@reduxForm({
  form:"profile"
})
class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit:false,
      dialogEmailVerifyOpen:false,
    }
  }
  
  _OpenDialogEmailVerifay(){
    this.setState({dialogEmailVerifyOpen:true})
  }
  _CloseDialogEmailVerifay(){
    this.setState({dialogEmailVerifyOpen:false})
  }
  _onSendEmailVerification(){
    const email = this.props.user.get("email");
    return new Promise((resolve,reject)=>{
      ApiInstance.instance.callOperation("sendverifyemail",
      {
        email,
        thenCB:payload=>resolve(payload),
        catchCB:x=>reject(x)
      })
    })
  }

  _onSubmit(values){
    return new Promise((resolve,reject)=>{

      ApiInstance.instance.callOperation("updateuser",{
        user:new User(values.toJSON()),
        thenCB:user => {
          this.setState(p=>({edit:false}))
          this.props.dispatch({type:"AUTH_SETUSERDATA_USER",payload:{user:values.toJSON()}})
          resolve(user)

        },
        catchCB:x=>{
          reject(x);
        }
      })

    })
    .then()
    .catch(x=>{
      var errors = {...x.errors};
      if(x.errors.hasOwnProperty("lastname")){
        errors["lastName"] = x.errors["lastname"]
      }
      if(x.errors.hasOwnProperty("firstname")){
        errors["firstName"] = x.errors["firstname"]
      }
      throw new SubmissionError({
        ...errors,
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
        <SendVerifyEmailDialog
          isOpen={dialogEmailVerifyOpen}
          open={this._OpenDialogEmailVerifay.bind(this)}
          close={this._CloseDialogEmailVerifay.bind(this)}
          send={this._onSendEmailVerification.bind(this)}
        />
        {
          isLogin&&
          <div>
            <Grid container spacing={24}>
              <Grid item style={{display:"flex"}} justify="center" alignItems="center" xs={3}>
                <Typography variant="title">Tus datos</Typography>
              </Grid>
              <Grid item xs={3}>
                <div>
                  <FormControlLabel
                    //labelPlacement="start"
                    control={
                      <Switch checked={this.state.edit} onChange={_=>{this.setState(p=>({edit:!p.edit}))}}/>
                    }
                    label={
                      <span><Typography>Editar</Typography></span>
                    }
                  />
                </div>
              </Grid>

              <form className={classes.root} onSubmit={handleSubmit(this._onSubmit.bind(this))}>
                <Grid  spacing={24} container>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={3}>
                        <Typography>E-mail</Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <Tooltip title={isVerified?"Cuenta verificada":"Cuenta no verificada, presiona aqui para enviar correo de verificacion."}>
                          <Chip
                            onClick={_=>{if(!isVerified)this._OpenDialogEmailVerifay()}}
                            avatar={
                              isVerified?
                                (
                                  <Avatar>
                                    <VerifiedUserIcon />
                                  </Avatar>
                                )
                              :
                              (
                                <Avatar>
                                  <WarningIcon />
                                </Avatar>
                              )
                            }
                            label={user.get("email")}
                          />
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={3}>
                        <Typography>Nombre</Typography>
                      </Grid>
                      <Grid item xs={9}>
                        {!edit&&<Typography variant="title">{user.get("firstName")}</Typography>}
                        {edit&&
                          <Field
                            name="firstName"
                            component={renderField}
                            type="text"
                            placeholder="Nombre"
                          />}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={3}>
                        <Typography>Apellido</Typography>
                      </Grid>
                      <Grid item xs={9}>
                        {!edit&&<Typography variant="title">{user.get("lastName")}</Typography>}
                        {edit&&
                          <Field
                            name="lastName"
                            component={renderField}
                            type="text"
                            placeholder="Apellido"
                          />}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={3}>
                        <Typography>Nombre de usuario</Typography>
                      </Grid>
                      <Grid item xs={9}>
                        {!edit&&<Typography variant="title">{user.get("username")}</Typography>}
                        {edit&&
                          <Field
                            name="username"
                            component={renderField}
                            type="text"
                            placeholder="Nombre de usuario"
                          />}
                      </Grid>
                    </Grid>
                  </Grid>


                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={3}>
                        <Typography>Sexo</Typography>
                      </Grid>
                      <Grid item xs={9}>
                        {!edit&&<Typography variant="title"><Gender name={user.get("gender")}/></Typography>}
                        {
                          edit&&
                          <Field name="gender"  component={renderSelectField}>
                            {genders.map(gender => (
                              <MenuItem value={gender.name} key={gender.name}>
                                {gender.value}
                              </MenuItem>
                            ))}
                          </Field>
                        }
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
                              Guardar Cambios
                            </Button>
                            {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
                          </div>
                        </Tooltip>

                      </Grid>
                    </Grid>
                  </Grid>}


                </Grid>

              </form>
            </Grid>
          </div>
        }
        {
          !isLogin&&
          <div>
            debe iniciar session
          </div>
        }
      </div>
    )
  }
}

export default Account;
