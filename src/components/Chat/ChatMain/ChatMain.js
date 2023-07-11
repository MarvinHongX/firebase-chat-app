import React from 'react';
import ChatMainHeader from './ChatMainHeader'
import ChatMainBody from './ChatMainBody'
import ChatMainFooter from './ChatMainFooter'


export default function ChatMain() {
  return (
    <div className='chat-main-wrapper'>
      <div className='chat-main-container'>
        <ChatMainHeader/>
        <ChatMainBody/>
        <ChatMainFooter/>
      </div>
    </div>
  )
}

