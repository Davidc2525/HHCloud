import React from "react"
import('semantic-ui-css/semantic.min.css');
import {Advertisement,Responsive, Grid,Image,} from 'semantic-ui-react'
import Feed from "../Feed/index.js";



console.warn(Responsive)


const App = ()=>(
<div>
<Grid padded>

    <Grid.Row>
    <Responsive as={Grid.Column} width={3} minWidth={992}>

        <Image src='https://react.semantic-ui.com/assets/images/wireframe/image.png' />

    </Responsive>


      <Grid.Column computer={10} mobile={16} tablet={13}>
        <Feed/>
      </Grid.Column>

      <Responsive as={Grid.Column} width={3} minWidth={768}>
        <Grid.Column width={3}>
       <Advertisement unit='vertical banner' test='Vertical Banner 120x240' />
       <br/>
       <Advertisement unit='square button' test='Square Button 125x125' />
      </Grid.Column>
      </Responsive>

    </Grid.Row>
  </Grid>


</div>)

export default App;
