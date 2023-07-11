import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserBox from '../../../commons/components/UserBox'
import { setShowLeaveRoom, setShowAddPeople } from '../../../redux/actions/sta_action'
import AddPeopleModal from '../ChatModal/AddPeopleModal'
import LeaveRoomModal from '../ChatModal/LeaveRoomModal'

export default function ChatMainBodyDetail() {
  const showDetail = useSelector(state => state.sta.showDetail)
  const dispatch = useDispatch()
  const room = useSelector(state => state.room.currentRoom)

  const handleShowLeaveRoom = () => {
    dispatch(setShowLeaveRoom(true))
  }
  const handleShowAddPeople = () => {
    dispatch(setShowAddPeople(true))
  }

  const renderMembers = (members) => {
    if (Object.keys(members).length === 0) return null

    return Object.entries(members).map(([uid, {photoURL, displayName, email}]) => (
      <UserBox
        key={uid}
        user={{
          photoURL,
          displayName,
          email,
        }}
      />
    ))
  }

  return (
    <div>
      {
          showDetail &&            
          room?.members && renderMembers(room.members)
      }
      
      <div className='body-detail-show'>
          <div className='body-detail-show-button'>
          <input className='common-button' type='button' value='Add People' onClick={handleShowAddPeople} />
          </div>
          <div className='body-detail-show-button'>
          <input className='common-button2' type='button' value='Leave Chat' onClick={handleShowLeaveRoom} />
          </div>
          { room && <LeaveRoomModal room={room}/>}
          { room && <AddPeopleModal room={room}/>}
      </div>
    </div>
  )
}
