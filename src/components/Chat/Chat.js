import React, { useRef } from 'react'
import ChatMain from './ChatMain/ChatMain'
import ChatSide from './ChatSide/ChatSide'
import { useDispatch, useSelector } from 'react-redux'
import { setShowNav } from '../../redux/actions/sta_action'
import ChatBegin from './ChatBegin/ChatBegin'


function Chat() {
  const currentUser = useSelector(state => state.user.currentUser)
  const currentRoom = useSelector(state => state.room.currentRoom)
  const showNav = useSelector(state => state.sta.showNav)
  const dispatch = useDispatch()
  const main = useRef()


  const handleCloseNav = async (event) => {
    const isChildren = main.current.contains(event.target)

    if (showNav && isChildren) await dispatch(setShowNav(false));
  }

  return (
    <div className='chat-container'>
      <div className={`chat-wrapper-side ${showNav && 'side-show-nav'}`}>
        <ChatSide 
          key={currentUser && currentUser.uid}
        />
      </div>
        {
          showNav &&
          <div className='chat-wrapper-main-block' ref={main} onClick={handleCloseNav} >
          </div>
        }
        <div className='chat-wrapper-main'>
        { currentRoom ?
        <ChatMain
          key={currentRoom && currentRoom.id}
        />
        :
        <ChatBegin/>
        }     
        </div>
    </div>
  )
}

export default Chat