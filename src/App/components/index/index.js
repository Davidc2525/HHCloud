
import React,{Component} from "react"
import {connect} from "react-redux"
import {
  push
} from "react-router-redux";
//import { RadialBarChart,RadialBar,Legend,Tooltip } from 'recharts';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import filesize from "filesize"
import numeral from "numeral"
import { Map } from "immutable";

const styles = theme => ({
  root: {
   	padding:theme.spacing.unit * 2,
    flexGrow: 1,
  },
   paper: {
    padding: theme.spacing.unit * 2,
    //textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  withCenterText:{

  	textAlign: 'center',
  },
  spaceConsumed:{
  	textAlign: 'center',
  //	margin: "0 auto",
    //width: "150px"
  },
  spaceConsumedTitleInner:{
  	top: "60px",
    position: "relative",
   // left: "39px"
  },
  progressTop:{
  	zIndex: 1,
    /* left: 37%; */
    position: "absolute",
    width: "100px",
    height: "100px",
  },
  progressButton:{
  	color:"rgb(242, 242, 242)"
  }
});

@withStyles(styles,{withTheme:true})
class MiDivider extends Component{
	render(){
		const {title} = this.props
		return (
			<div style={{margin:"20px"}}>
				<Typography variant="title">{title}</Typography>
				<Divider  />

			</div>
		)
	}
}


@withStyles(styles,{withTheme:true})
@connect((state : Map, props)=>{
	const user=state.getIn(["auth","dataUser","user"],null);
	const summary=state.getIn(["auth","dataUser","contentSummary"],null);

	if(summary==null||user==null){
		return {
			user:{emailVerified:true},
			summary: {
				"directoryCount": 0,
				"fileCount": 0,
				"length": 0,
				"spaceQuota": 0,
				"spaceConsumed": 0,
				"quota": -1
			}
		}
	}
	return {summary:summary.toJSON(),user:user.toJSON()}
})
class Nuevo extends Component{


	_toView(summary){
		return parseInt(summary.length*100/summary.spaceQuota)
	}

	render(){
		const {classes,summary,user} = this.props

		const {emailVerified} = user;

		return (

			<div className={classes.root}>
		    {
		    	!emailVerified&&
          <div>
            <MiDivider title="Verifica tu cuenta"/>
            <Grid alignItems="center" container spacing={24}>
              <Grid item xs={12} >
                <Typography variant="headline">No haz verificado tu cuenta, hazlo para que disfrutes de mas espacio de almacenamiento, hasta 30GB!</Typography>
                <Typography>Hasta entonces, solo tendras disponible 1GB de espacio.</Typography>
                <Typography>Ve a tu cuenta de correo y verifica tu cuenta, si aun no haz recibido el enlace, ve
                  <strong
                    style={{cursor:"pointer"}}
                    onClick={_=>this.props.dispatch(push("/SC/account"))}> aqui</strong> y haz click sobre tu email.
                </Typography>
              </Grid>
            </Grid>
          </div>
        }

        <MiDivider title="Espacio"/>

        <Grid alignItems="center" container spacing={24}>
          <Grid item xs={12} md={3}>
            <Paper id="spaceConsumed"  className={classes.spaceConsumed +" "+classes.paper}>
              <Typography className={classes.spaceConsumedTitleInner}>{this._toView(summary)}%</Typography>

              <div>
                <CircularProgress className={classes.progressTop} thickness={2} size={100} variant="static" value={this._toView(summary)}/>
                <CircularProgress className={classes.progressButton} thickness={2} size={100} variant="static" value={100}/>
              </div>

              <Typography variant="title">Espacio consumido</Typography>
            </Paper>
          </Grid>


          <Grid item xs={12} md={3}>
            <Paper id="countDirectory"  className={classes.paper+" "+classes.withCenterText}>

              <Typography variant="title">Espacio consumido</Typography>
              <Typography variant="display1">{filesize(summary.length)}</Typography>

            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper id="countDirectory"  className={classes.paper+" "+classes.withCenterText}>

              <Typography variant="title">Espacio restantes</Typography>
              <Typography variant="display1">{filesize(summary.spaceQuota - summary.length)}</Typography>

            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper id="countDirectory"  className={classes.paper+" "+classes.withCenterText}>

              <Typography variant="title">Tu espacio</Typography>
              <Typography variant="display1">{filesize(summary.spaceQuota)}</Typography>

            </Paper>
          </Grid>
        </Grid>


		    <MiDivider title="Archivos y carpetas"/>

        <Grid container spacing={24}>
          <Grid item xs={12} md={6}>
            <Paper id="countDirectory"  className={classes.paper+" "+classes.withCenterText}>
              <Typography variant="title">Archivos</Typography>
              <Typography variant="display1">{ numeral(summary.fileCount).format('0,0')}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper id="countDirectory"  className={classes.paper+" "+classes.withCenterText}>
              <Typography variant="title">Directorios</Typography>
              <Typography variant="display1">{ numeral(summary.directoryCount).format('0,0')}</Typography>
            </Paper>
          </Grid>

        </Grid>
			</div>

			)
	}
}

export default Nuevo;
