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
import AssignmentInd from '@material-ui/icons/AssignmentInd';
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress"
import green from '@material-ui/core/colors/green';
function Transition(props) {
  return <Slide direction="up" {...props} />;
}

@withMobileDialog()
class AfterRegisterDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sended: false,
      sending: false,
      error: false,
      msg: ""
    }
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
            Has sido registrado
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Grid justify="center" alignItems="center" container>
                <Grid item>
                  {sending && <CircularProgress color="primary" size={100} />}
                  {!sending && <AssignmentInd color={"primary"} style={{ fontSize: 100 }} />}
                </Grid>

                <Grid item style={{ marginTop: 30 }}>
                  <strong>!Enhorabuena¡</strong>
                  <Typography>
                  	 Has sido registrado, te pedimos que vayas a tu cuenta de correo y des click en el enlace para que puedas verificar tu cuenta y poder gozar de algunos veneficios y mayor seguridad.
                  </Typography>
                </Grid>
              </Grid>

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled={sending} onClick={_ => this.onClose()} color="primary">
              iniciar session
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default AfterRegisterDialog
