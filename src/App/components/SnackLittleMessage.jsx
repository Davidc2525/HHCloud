import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {connect} from 'react-redux'
import {ACTIONS} from "../actions.js"

const styles = theme => ({
  close: {
  	padding: theme.spacing.unit / 2,
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

@connect((state,props)=>{

  const littleMsg = state.get("app").get("littleMsg");
  return {littleMsg}

})
class SnackLittleMessage extends React.Component { 

	handleClose = (_, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		store.dispatch(ACTIONS.CLOSE_LITTLE_MSG.FUN())
	}
	render() {
		const { classes ,littleMsg} = this.props;
		return (
		  	<Snackbar

		      anchorOrigin={{
		        vertical: 'top',
		        horizontal: 'left',
		      }}
		      open={littleMsg.get("open")}
		      autoHideDuration={5000}
		      onClose={this.handleClose}
		      ContentProps={{
		        'aria-describedby': 'message-id',
		      }}
		      message={<span id="message-id">{littleMsg.get("msg")}</span>}
		      action={[
		        <IconButton
		          key="close"
		          aria-label="Close"
		          color="inherit"
		          className={classes.close}
		          onClick={this.handleClose}
		        >
		          <CloseIcon />
		        </IconButton>,
		      ]}   
		  />
		);
}
}

SnackLittleMessage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SnackLittleMessage);