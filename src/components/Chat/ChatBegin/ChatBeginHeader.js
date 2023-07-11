import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useDispatch, useSelector } from 'react-redux'
import { setShowNav } from '../../../redux/actions/sta_action'


export default function ChatBeginHeader() {
  const windowSize = useSelector(state => state.size.windowSize)
  const visualSize = useSelector(state => state.size.visualSize)
  const dispatch = useDispatch()
  

  const handleHamburger = () => {
    dispatch(setShowNav(prev => !prev))
  }

  return (
    <div className='chat-main-header' 
      style={{
        top: `${windowSize?.height - visualSize?.height}px`,
      }}
    >
      
      <h2 className='chat-header-title'>
        
        <div className='chat-header-title-icons'>
          <span className='title-icons-hamburger' style={{ cursor: 'pointer' }} onClick={handleHamburger} >
            <GiHamburgerMenu size='30px' style={{ marginBottom: '4px' }} />
          </span>
        </div>
      </h2>
    </div>
  )
}


