import React from 'react';
import {connect} from "react-redux"
import CreateNewFolder from '@material-ui/icons/CreateNewFolder';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SendVerifyEmailDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error:false,
      msg:""
    }
  }

  onSendVerifyEmail(){
    const {open,close,send} = this.props;
    send()
    .then(payload=>close())
    .catch(x=>{
      this.setState({error:true,msg:x.msg})
    })
  }
  onClose(){
    this.setState({error:false,msg:""})
    this.props.close();
  }
  render(){
    const {isOpen,open,close,send} = this.props;
    return (
      <div>
        <Dialog
          open={isOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={_=>this.onClose()}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            Verificar tu cuenta.
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Una vez hallas presionado el boton de enviar, se enviara un mensaje a tu correo, donde recibiras un enlace para poder verificar tu cuenta.
              {this.state.error&&
                <Typography variant="display1">{this.state.msg}</Typography>
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={_=>this.onClose()} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.onSendVerifyEmail.bind(this)} color="primary">
              Enviar
              <SendIcon style={{marginLeft:10}}/>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default SendVerifyEmailDialog
