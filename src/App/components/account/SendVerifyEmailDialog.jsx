import React from 'react';
import { connect } from "react-redux"
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
import withMobileDialog from '@material-ui/core/withMobileDialog';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress"
import green from '@material-ui/core/colors/green';
function Transition(props) {
  return <Slide direction="up" {...props} />;
}

@withMobileDialog()
class SendVerifyEmailDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sended: false,
      sending: false,
      error: false,
      msg: ""
    }
  }

  onSendVerifyEmail() {
    this.setState({ error: false, msg: "", sending: true });
    const { open, close, send } = this.props;
    send()
      .then(payload => {
        this.setState({ sending: false })
        this.setState({ sended: true })
        setTimeout(_ => {
          this.onClose();
        }, 2000)
      })
      .catch(x => {
        this.setState({ sending: false })
        this.setState({ error: true, msg: x.msg })
      })
  }
  onClose() {
    this.setState({ error: false, msg: "", sended: false, sending: false })
    this.props.close();
  }
  render() {
    const { isOpen, open, close, send, fullScreen } = this.props;
    const { sending, sended } = this.state;
    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={isOpen}
          TransitionComponent={Transition}
          //keepMounted
          onClose={_ => this.onClose()}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            Verificar tu cuenta.
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Grid justify="center" alignItems="center" container>
                <Grid item>
                  {sending && <CircularProgress color="primary" size={100} />}
                  {!sending && <VerifiedUserIcon color={"primary"} style={{ fontSize: 100 }} />}
                </Grid>

                <Grid item style={{ marginTop: 30 }}>
                  Una vez presionado el botón <strong>enviar</strong>, se enviara un mensaje a tu correo, donde recibirás un enlace para poder verificar tu cuenta.
                  {this.state.error &&
                    <Typography variant="display1">{this.state.msg}</Typography>
                  }
                </Grid>
              </Grid>

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled={sending} onClick={_ => this.onClose()} color="primary">
              {sended ? "Listo" : "Cancelar"}
            </Button>
            {!sended && <Button disabled={sending || sended} onClick={this.onSendVerifyEmail.bind(this)} color="primary">
              Enviar
              <SendIcon style={{ marginLeft: 10 }} />
            </Button>}
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default SendVerifyEmailDialog
