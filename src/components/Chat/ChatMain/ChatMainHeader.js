import React from 'react'
import { FaInfoCircle } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
import { AiOutlineSearch } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { setSearching, setSearchKeyword, setShowNav, setShowAddPeople, setShowLeaveRoom, setShowDetail } from '../../../redux/actions/sta_action'
import SearchBox from '../../../commons/components/SearchBox'



export default function ChatMainHeader() {
  const windowSize = useSelector(state => state.size.windowSize)
  const visualSize = useSelector(state => state.size.visualSize)
  const searching = useSelector(state => state.sta.searching)
  const showDetail = useSelector(state => state.sta.showDetail)
  const dispatch = useDispatch()
  const room = useSelector(state => state.room.currentRoom)

  
  const handleHamburger = () => {
    dispatch(setShowNav(prev => !prev))
  }
  const handleShowDetail = () => {
    dispatch(setShowDetail(true))
  }
  const handleCloseDetail = () => {
    dispatch(setShowDetail(false))
  }

  const handleShowSearch = () => {
    dispatch(setSearching(true))
  }

  const handleCloseSearch = () => {
    dispatch(setSearching(false))
    dispatch(setSearchKeyword({value: '', loading: false}))
  }

  const handleSearchChange = (event) => {
    dispatch(setSearchKeyword({value: event.target.value, loading: true}))
  }

  const handleShowLeaveRoom = () => dispatch(setShowLeaveRoom(true))
  const handleShowAddPeople = () => dispatch(setShowAddPeople(true))


  return (
    <div className='chat-main-header' 
      style={{
        top: `${searching ? 0 : windowSize?.height - visualSize?.height}px`,
      }}
    >
      
      { searching ?
      <div className='chat-header-search'>
        <SearchBox handleSearchChange={handleSearchChange}/>
        <span className='chat-header-search-cancel' onClick={handleCloseSearch}>Cancel</span>
      </div>
            :
      <h2 className='chat-header-title'>
        
        <div className='chat-header-title-icons'>
          <span className='title-icons-hamburger' style={{ cursor: 'pointer' }} onClick={handleHamburger} >
            <GiHamburgerMenu size='30px' style={{ marginBottom: '4px' }} />
          </span>

        </div>
        <div className='chat-header-profile' >
          <div className='chat-header-profile-wrapper' >
          </div>
        </div>
        <div className='chat-header-name'>
          { showDetail &&
          'Details'
          ||
          room?.members &&
            Object.values(room.members)
            .map(member => member.displayName)
            .join(', ')
          }

        </div>

        <div className='chat-header-title-icons'>
        { !showDetail  &&
          <span className='title-icons-span' style={{ cursor: 'pointer' }} onClick={handleShowSearch}>
            <AiOutlineSearch size='30px'/>
          </span>
        }
          <span className='title-icons-span' style={{ cursor: 'pointer' }}>
              { showDetail ? 
                <FaInfoCircle size='30px' onClick= {handleCloseDetail} style={{ 
                  marginBottom: '4px' ,
                  color: 'green',      
                }} />                 
               :
               <FaInfoCircle size='30px' onClick= {handleShowDetail} style={{ 
                marginBottom: '4px' ,
                color: 'gray',
              }} />
              }
  
            </span>
        </div>
        
      </h2>
      }
        
    </div>
  )
}


