import React from 'react'
import ChatMainFooterBottom from './ChatMainFooterBottom'
import { AiOutlineArrowDown } from 'react-icons/ai'
import { setGoToEnd } from '../../../redux/actions/sta_action'
import { useDispatch, useSelector } from 'react-redux'

export default function ChatMainFooter() {
  const dispatch = useDispatch()
  
  const handleGoToEnd = () => {
    dispatch(setGoToEnd(true))
  }

  const searching = useSelector(state => state.sta.searching)
  return (
    <div className='chat-main-footer'>
        { !searching && 
        <div>
            <div className='chat-main-footer-top'>
                <div className='chat-down'>
                <button>
                    <AiOutlineArrowDown style={{ color: 'white' }} onClick={handleGoToEnd} />
                </button>
                </div>
            </div>
            <ChatMainFooterBottom />
        </div>
        }
    </div>
  )
}

