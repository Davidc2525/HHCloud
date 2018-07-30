//Player.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import Pause from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import LinearProgress from '@material-ui/core/LinearProgress';


const styles = theme => ({
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  buffered:{
  	height:5,
  	position:"absolute",
  	display:"inline-block",
  	backgroundColor:"grey"
  }
});

class Player extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			play:true,
			progress:0,
			buffers:[]
		}
		this.ae = null;
		window.p = this
	}

	handlePay(){
		if(this.state.play){
			this.setState({play:false})
			this.ae.pause()
		}else{
			this.setState({play:true})
			this.ae.play()

		}
	}

	onTimeUpdate() {
		const duration = this.ae.duration;
		const currentTime = this.ae.currentTime;

		const progress = (currentTime / duration) * 100

		
		this.setState({
			progress,
			//buffers
		})
	}
	onProgress() {
		
		const buffers = [];
		for (var x = 0; x < this.ae.buffered.length; x++) {
			//console.log(this.ae.buffered.start(x) + " - " + this.ae.buffered.end(x))
			buffers.push({s:p.ae.buffered.start(x),e:p.ae.buffered.end(x)})
		}
		this.setState({
			//progress,
			buffers
		})
	}
	render(){

		const { classes, theme ,style,item,contentValue} = this.props;
		const mimeContent = item.getIn(["mime"])
		const name = item.get("name")
		const size = item.get("size")
		return (
			<div style={{...style}}>
			  <Card className={classes.card}>
			    <div className={classes.details}>
			      <CardContent className={classes.content}>
			        <Typography variant="headline">{name}</Typography>
			        <Typography variant="subheading" color="textSecondary">
			          {size}
			        </Typography>

			        <video
			        	style={{width:"100%"}} 
			        	ref={ae => this.ae = ae}
			        	id="uniaudio" autoPlay={true}
			        	controls 
			        	//style={{width:"0",display:"none"}}
			        	src={contentValue}
			        	onProgress={this.onProgress.bind(this)}
			        	onTimeUpdate={this.onTimeUpdate.bind(this)}
			        	>
							<source src={contentValue} type={mimeContent}/>
					</video>
					<div>
						<LinearProgress onClick={_=>{var a = _.target;console.log(_,_.layerX,_.layerY) }} value={this.state.progress} variant={"determinate"}/>
					
						<div style={{position:"relative",height:5,width:"100%"}} id="bufered">
							{
								this.state.buffers.map((x,i,a)=>{
									const s=(x.s / this.ae.duration) * 100
									const e=(x.e / this.ae.duration) * 100
									return (<div key={i+"-"+i} className={classes.buffered}  style={{left:`${s}%`,width:`calc(${e}% - ${s}%)`}}></div>)
								})
							}
						</div>
					</div>
			      </CardContent>
			      <div className={classes.controls}>
			        {false&&<IconButton aria-label="Previous">
			          {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
			        </IconButton>}
			       
			        <IconButton aria-label="Play/pause" onClick={this.handlePay.bind(this)}>
			          {this.state.play&&<Pause className={classes.playIcon} />}
			          {!this.state.play&&<PlayArrowIcon className={classes.playIcon} />}
			        </IconButton>
			       
			        {false&&<IconButton aria-label="Next">
			          {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
			        </IconButton>}
			      </div>
			    </div>
			    <CardMedia
			      className={classes.cover}
			      image="/static/images/cards/live-from-space.jpg"
			      title="Live from space album cover"
			    />
			  </Card>
			</div>
		);
	}
}

Player.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Player);