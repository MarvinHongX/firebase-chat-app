import React from 'react'

export default function ChatMessageMe({ content, groupTimestamp, renderContents, timeFromNow }) {
  return (
    <div className='chat-message-me'>
      <div className='chat-message-content'>
        <div className='chat-message-content-body'>
          <div className='chat-message-content-body-text-wrapper-me'>
            {renderContents(content)}
            <div className='chat-message-content-body-time'>
              {timeFromNow(groupTimestamp)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
