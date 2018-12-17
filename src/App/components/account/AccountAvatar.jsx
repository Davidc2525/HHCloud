import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {connect} from "react-redux"
import ApiInstance from "../../elements/API/v1/Api.js"
import EditAvatar from "./EditAvatar.jsx"
const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '100%', // 16:9
  },
};
const AvatarContext = React.createContext({open:false});
export {AvatarContext}
@connect( (state : Map, props)=>{
  const stateLogin = state.getIn(["auth","state"],null);
  const user = state.getIn(["auth","dataUser","user"],null);

  if(user == null){
    return {user:null,state:STATES[0]}
  }
  return {user,state:stateLogin};
} )
class AccountAvatar extends React.Component{
	constructor(props){
		super(props);
		this.state={
			editAvatarOpen:false
		}
	}
	handleClickOpen = () => {
		this.setState({
			editAvatarOpen: true
		});
	};

	handleClickDelete = () => {
		if(confirm("Desea dejar de mostrar tu avatar?")){
			ApiInstance.instance.callOperation("avatar::delete", {
			catchCB: x => alert(JSON.stringify(x,null,2)),
			thenCB: _ => {setTimeout(_=>{/*location.reload()*/},1000);}
		})
		}
	};

	handleClose = () => {
		
		this.setState({
			editAvatarOpen: false
		});
	};

	render() {
	  const { classes ,user,state} = this.props;
	  const {editAvatarOpen} = this.state;
	  const avatar = user.get("avatars").get("290x290")
	  return (
	    <div>
	    	<AvatarContext.Provider value={this}>
	      		<EditAvatar/>
	    	</AvatarContext.Provider>
	      <Card className={classes.card}>
	        <CardMedia
	          className={classes.media}
	          image={`${avatar}`}
	        />
	        <CardContent>
	          <Typography gutterBottom variant="headline" component="h2">
	            {user.get("lastName").capitalize(true)} {user.get("firstName").capitalize(true)}
	          </Typography>
	          
	        </CardContent>
	        <CardActions>
	          <Button size="small" color="primary" onClick={this.handleClickOpen}>
	            Editar
	          </Button>

	          <Button size="small" color="primary" onClick={this.handleClickDelete}>
	            Eliminar
	          </Button>
	        </CardActions>
	      </Card>
	    </div>
	  );
	}
}

AccountAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AccountAvatar);