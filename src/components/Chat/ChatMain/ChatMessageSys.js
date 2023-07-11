import React from 'react'

export default function ChatMessageSys({ message: {user, content, groupTimestamp }, timeFromNow }) {


  const renderContents = (contents, user) => {
    return (
      contents.length > 0 &&
      contents.map(content => (
        <div key={content.timestamp}>        
          <div className='chat-message-content-body-text'>
            {content.text}
            {(user.id === 'sysJoin') && ' invited '}
            {user?.name === null ? '' : user?.name}
            {(user?.id === 'sysLeave') && ' left this chatroom.'}
          </div>  
        </div>
      ))
    )
  }

    return (
    <div className='chat-message-sys'>
    <div className='chat-message-content'>
        <div className='chat-message-content-body'>
        <div className='chat-message-content-body-text-wrapper-sys'>
            {renderContents(content, user)}
            <div className='chat-message-content-body-time'>
            {timeFromNow(groupTimestamp)}
            </div>
        </div>
        </div>
    </div>
    </div>
    )
}
