import React from 'react'
import moment from 'moment'
import ChatMessageMe from './ChatMessageMe'
import ChatMessageOthers from './ChatMessageOthers'
import ChatMessageSys from './ChatMessageSys'


export function AutoLink({ html }) {
  return <div dangerouslySetInnerHTML={ {__html: html} }/>;
}


export default function ChatMessage({ message, me }) {
  
  const timeFromNow = timestamp => moment(timestamp).fromNow();
  const isMessageMine = (message, me) => {
    if (me) {
      return message.user.id === me.uid
    }
  }
  const isMessageSystem = (message) => {
    return (message.user.id === 'sysLeave') || (message.user.id === 'sysJoin')
  }


  const autoLink = (content) => {
    var regURL = new RegExp('(^|[^"])(http|https|ftp|telnet|news|irc)://([-/.a-zA-Z0-9_~#%$?&=:200-377()]+)', 'gi');
    var regURL2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    return content.replace(regURL, '$1<a class="autoLink" href="$2://$3" target="_blank">$2://$3</a>')
      .replace(regURL2, '$1<a class="autoLink" href="http://$2" target="_blank">$2</a>');
      //.replace(regEmail, '$1<a class="autoLink" href="mailto:$2">$2</a>');
  }

  const renderContents = (contents) => {
    return (
      contents.length > 0 &&
      contents.map(content => (
        <div key={content.timestamp}>
        {
        content.image ?
          <div className='chat-message-content-body-image'>
            <a href={content.image} target='_blank'><img alt='image not found' src={content.image}/></a>
          </div>
          :
          <div className='chat-message-content-body-text'>
            <AutoLink html={autoLink(content.text)} />
          </div>  
        }
        </div>
      ))
    )
  }



  return (
    <div>
      { isMessageMine(message, me) &&
      <ChatMessageMe content={message.content} groupTimestamp={message.groupTimestamp} timeFromNow={timeFromNow} renderContents={renderContents}/>
      }
       { (isMessageSystem(message)) ?
       <ChatMessageSys message={message} timeFromNow={timeFromNow} />
        :
        !isMessageMine(message, me) &&
        <ChatMessageOthers image={message.user.image} name={message.user.name} content={message.content} groupTimestamp={message.groupTimestamp} timeFromNow={timeFromNow} renderContents={renderContents}/>
       }
    </div>
  )
}
