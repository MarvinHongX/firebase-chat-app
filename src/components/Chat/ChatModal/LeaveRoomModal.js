import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useDispatch, useSelector } from 'react-redux'
import { setShowLeaveRoom } from '../../../redux/actions/sta_action'
import { getDatabase, ref, remove, get, set, child, push } from 'firebase/database'
import { setCurrentRoom } from '../../../redux/actions/room_action'


export default function LeaveRoomModal() {
  const me = useSelector(state => state.user.currentUser)
  const room = useSelector(state => state.room.currentRoom)
  const show = useSelector(state => state.sta.showLeaveRoom)
  const messagesRef = ref(getDatabase(), 'messages')
  const dispatch = useDispatch()

  const handleClose = () => dispatch(setShowLeaveRoom(false))


  const handleSubmit = (event) => {
    event.preventDefault()
    leaveRoom()
  }

  const leaveMessage = (type, displayName) => {
    const message = {
      user: {
        id: type,
        name: displayName,
        image: null
      }
    }
    message['content'] = ``
    message['timestamp'] = new Date().toISOString()
    return message
  }

  const leaveRoom = async () => {
    try {
      const userRef = ref(getDatabase(), `users/${me.uid}`)
      const membersRef = ref(getDatabase(), `rooms/${room.id}/members`)
      const membersSnapshot = await get(membersRef)
      const members = membersSnapshot.val() || []


      const updatedMembers = {...members}
      delete updatedMembers[me.uid] 
      const newMessage = leaveMessage('sysLeave', me.displayName)
      await set(push(child(messagesRef, room.id)), newMessage)
      await Promise.all([
        remove(child(userRef, `rooms/${room.id}`)),
        set(membersRef, updatedMembers),

        
      ])

      dispatch(setShowLeaveRoom(false))
      dispatch(setCurrentRoom())
    } catch (error) {
      console.log('error')
    }

  }


  return (
    <div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Leave Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Are you sure you want to end this chat room now?</p>
            <p>You will not be able to recover it.</p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>Close</Button>
            <Button variant='primary' onClick={handleSubmit}>Leave</Button>
        </Modal.Footer>
        </Modal>
    </div>
  )
}