import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setShowAddRoom } from '../../../redux/actions/sta_action'
import ChatBeginHeader from './ChatBeginHeader'

export class ChatBegin extends Component {
  handleShow = () => this.props.dispatch(setShowAddRoom(true))

  render() {
    return (
      <div className='chat-main-wrapper'>
        <div className='chat-main-container'>
            <ChatBeginHeader />
            <div className='chat-main-body'>
              <div className='chat-body-begin-wrapper'>
                <div className='chat-body-begin'>
                <h3>Your Messages</h3>
                <p>Send private photos and messages to a friend or group.</p>
                <input className='common-button' type='button' value='Send Message' onClick={this.handleShow} />
                </div>
              </div>
            </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
    room: state.room.currentRoom
  }
}

export default connect(mapStateToProps)(ChatBegin)
