import React from 'react'

export default function ChatMessageOthers({ image, name, content, groupTimestamp, renderContents, timeFromNow }) {
    return (
    <div className='chat-message'>
        <img className='chat-message-img'
        src={image}
        alt={name}
        /> 
    <div className='chat-message-content'>
        <div className='chat-message-content-name'>{name}</div>
        <div className='chat-message-content-body'>
        <div className='chat-message-content-body-text-wrapper'>
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
