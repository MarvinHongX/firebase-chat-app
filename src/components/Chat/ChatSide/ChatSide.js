import React, { Component } from 'react'
import ChatSideRooms from './ChatSideRooms'
import ChatSideUser from './ChatSideUser'

export class ChatSide extends Component {
  render() {
    return (
      <div className='chat-side-wrapper'>
        <div className='chat-side-container'>
          <ChatSideUser />
          <ChatSideRooms />
          
        </div>
      </div>
    )
  }
}

export default ChatSide