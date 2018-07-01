import React from "react";

import { Input, Menu, } from 'semantic-ui-react'


import {Dimmer,Responsive,Dropdown,Icon, Image,Button, Label,Sticky } from 'semantic-ui-react'

const options = [
  { key: 1, text: 'This is a super long item', value: 1 },
  { key: 2, text: 'Dropdown direction can help', value: 2 },
  { key: 3, text: 'Items are kept within view', value: 3 },
]
class DimmerAvatar extends React.Component {
  state = {}

  handleShow = () => this.setState({ active: true })
  handleHide = () => this.setState({ active: false })

  render() {
    const { active } = this.state
    const content = (
        <Icon size="small" name="setting"/>
    )

    return (
      <Dimmer.Dimmable
        as={Image}
        dimmed={active}
        dimmer={{ active, content }}
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
        avatar
        src='https://react.semantic-ui.com/assets/images/avatar/small/elliot.jpg'
      />
    )
  }
}


const Avatar = () => (
  <div>

    <Image src='https://react.semantic-ui.com/assets/images/avatar/small/elliot.jpg' avatar />

  </div>
)



export default class MenuExampleSecondary extends React.Component {
  state = { activeItem: 'home',dOpen:false }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  handleContextRef = contextRef => this.setState({ contextRef })
  render() {
    const { activeItem } = this.state

    return (
       <div style={{height: "50px"}}>
        <div style={{position: "relative",zIndex:"1000"}}  ref={this.handleContextRef}>


          <Menu fixed="top" inverted borderless>
              <Menu.Item>

                     <Button color="purple" icon labelPosition='left'>
                      <Icon name='circle notched' />
                      Orchi
                    </Button>
              </Menu.Item>

               <Menu.Menu position='left'>
                  <Menu.Item>


                      <Label color= "purple">
                        <Icon name="talk"/>
                        2
                        <Label.Detail>Ver todos</Label.Detail>

                      </Label>


                      <Label as="a" onClick={()=>{this.setState({dOpen:!this.state.dOpen})}} color="pink">
                           <Dropdown closeOnChange={true} open={this.state.dOpen} icon="alarm" className='icon'>
                                <Dropdown.Menu>
                                  <Input icon='search' iconPosition='left' className='search' />
                                  <Dropdown.Divider />
                                  <Dropdown.Header icon='tags' content='Tag Label' />
                                  <Dropdown.Menu scrolling>
                                    <Dropdown.Item text='New' />
                                    <Dropdown.Item text='Open...' description='ctrl + o' />
                                    <Dropdown.Item text='Save as...' description='ctrl + s' />
                                    <Dropdown.Item text='Rename' description='ctrl + r' />
                                    <Dropdown.Item text='Make a copy' />
                                    <Dropdown.Item icon='folder' text='Move to folder' />
                                    <Dropdown.Item icon='trash' text='Move to trash' />
                                    <Dropdown.Divider />
                                    <Dropdown.Item text='Download As...' />
                                    <Dropdown.Item text='Publish To Web' />
                                    <Dropdown.Item text='E-mail Collaborators' />
                                  </Dropdown.Menu>
                                </Dropdown.Menu>
                            </Dropdown>
                            14
                      </Label>

                   </Menu.Item>
                </Menu.Menu>

                <Menu.Menu >
                  <Responsive as={Menu.Item}  {...Responsive.onlyComputer}>

                    <Input icon='search' placeholder='Search...' />

                  </Responsive>
                </Menu.Menu>

                <Menu.Item>
                     <Avatar/>
                </Menu.Item>


          </Menu>


      </div>
      </div>
    )
  }
}
class Nav extends React.Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu>
        <Menu.Item
          name='editorials'
          active={activeItem === 'editorials'}
          onClick={this.handleItemClick}
        >
          Editorials
        </Menu.Item>

        <Menu.Item
          name='reviews'
          active={activeItem === 'reviews'}
          onClick={this.handleItemClick}
        >
          Reviews
        </Menu.Item>

        <Menu.Item
          name='upcomingEvents'
          active={activeItem === 'upcomingEvents'}
          onClick={this.handleItemClick}
        >
          Upcoming Events
        </Menu.Item>
      </Menu>
    )
  }
}

//export default Nav;
