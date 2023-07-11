import React, { Component } from 'react'
import { FaPlusSquare } from 'react-icons/fa'
import Badge from 'react-bootstrap/Badge'
import { connect } from 'react-redux'
import { setCurrentRoom } from '../../../redux/actions/room_action'
import { setShowAddRoom, setGoToEnd } from '../../../redux/actions/sta_action'
import { getDatabase, ref, onChildAdded, get, onChildRemoved, onValue, child, off } from 'firebase/database'
import CreateRoomModal from '../ChatModal/CreateRoomModal'

export class ChatSideRooms extends Component {
  
  state = {
    messagesRef: ref(getDatabase(), 'messages'),
    usersRef: ref(getDatabase(), 'users'),
    roomsRef: ref(getDatabase(), 'rooms'),
    rooms: [],
    firstLoad: true,
    notifications: [] 
  }

  componentDidMount() {
    this.addRoomsListeners()
  }

  componentWillUnmount() {
    this.removeRoomsListeners()
  }

  addRoomsListeners = () => {
    if (!this.props.user) return

    const userId = this.props.user.uid
    const { usersRef, roomsRef, notifications } = this.state
    let roomsArray = []

    onChildAdded(child(usersRef, `${userId}/rooms`), DataSnapshot => {
      if (DataSnapshot.exists()) {
        const roomKey = DataSnapshot.key
        const roomData = DataSnapshot.val()
        const roomRef = child(roomsRef, roomKey) 
        
        get(child(roomRef, "members")).then((snapshot) => {    
          const roomMembers = snapshot.val() || {}
          const membersPromise = Object.keys(roomMembers).map((memberId) => {
            return get(child(usersRef, memberId)).then((userSnapshot) => {
              const userData = userSnapshot.val()
              return {id: memberId, displayName: userData.displayName, email: userData.email, photoURL: userData.photoURL}
            })
          })

          Promise.all(membersPromise).then((members) => { 
            const roomMembersObj = members.reduce((acc, curr) => {
              acc[curr.id] = curr
              return acc
            }, {})
            
            const room = { id: roomKey, name: roomData.roomName, members: roomMembersObj  }
            roomsArray.push(room)
            this.setState({ rooms: roomsArray })
            if (!notifications[roomKey]) {
              this.addNotificationListener(roomKey)
            }
          })
        })
        this.addMembersListener(roomKey)
      }
    })

    onChildRemoved(child(usersRef, `${userId}/rooms`), DataSnapshot => {
      const removedRoom = { id: DataSnapshot.key, ...DataSnapshot.val() }
      const newRooms = roomsArray.filter(room => room.id !== removedRoom.id)
      roomsArray = newRooms
      this.setState({
        rooms: roomsArray,
      }, () => {
      })
    })
  }


  removeRoomsListeners = () => {
    if (!this.props.user) return

    const userId = this.props.user.uid
    const { usersRef, messagesRef, rooms } = this.state

    off(child(usersRef, `${userId}/rooms`))
    rooms.forEach(room => off(child(messagesRef, room.id)))    
  }

  addMembersListener = (roomId) => {
    const { roomsRef, usersRef } = this.state
    const membersRef = child(roomsRef, `${roomId}/members`)

    onChildAdded(membersRef, async (snapshot) => {
      const userId = snapshot.key
      const userRef = child(usersRef, userId)
  
      try {
        const userSnapshot = await get(userRef)
        const { displayName, email, photoURL } = userSnapshot.val()
        const member = { id: userId, displayName, email, photoURL }
  
        this.setState((prevState) => {
          const { rooms } = prevState
          const roomIndex = rooms.findIndex((room) => room.id === roomId)
          if (roomIndex !== -1) {
            const room = rooms[roomIndex]
            const newMembers = {...room.members, [userId]: member}
            const updatedRoom = { ...room, members: newMembers }
            const updatedRooms = [...rooms]
            updatedRooms[roomIndex] = updatedRoom
            if (this.props?.room?.id === updatedRoom.id) {
              this.props.dispatch(setCurrentRoom(updatedRoom))
            }
            return { rooms: updatedRooms }
          }
          return null
        })
      } catch (error) {
        console.error(error)
      }
    })
  
    onChildRemoved(membersRef, (snapshot) => {
      const memberId = snapshot.key
      this.setState((prevState) => {
        const { rooms } = prevState
        const roomIndex = rooms.findIndex((room) => room.id === roomId)
        if (roomIndex !== -1) {
          const room = rooms[roomIndex]
          const newMembers = {...room.members}
          delete newMembers[memberId] // 삭제된 멤버에 대한 정보를 객체에서 삭제

          // const newMembers = room.members.filter((member) => member.id !== memberId)
          const updatedRoom = { ...room, members: newMembers }
          const updatedRooms = [...rooms]
          updatedRooms[roomIndex] = updatedRoom
          if (this.props?.room?.id === updatedRoom.id) {
            this.props.dispatch(setCurrentRoom(updatedRoom))
          }
          return { rooms: updatedRooms }
        }
        return null
      })
    })
  }

  addNotificationListener = (roomId) => {
    let { messagesRef, notifications } = this.state
    onValue(child(messagesRef, roomId), DataSnapshot => {
      if (this.props.room) {
        this.handleNotification(
          roomId,
          this.props.room.id,
          notifications,
          DataSnapshot
        )
      }
    })
  }
  
  handleNotification = (roomId, currentRoomId, notifications, DataSnapshot) => {

    let lastTotal = 0

    // 이미 notifications state 안에 알림 정보가 들어있는 채팅방과 그렇지 않은 채팅방을 나눠주기 
    let index = notifications.findIndex(notification => notification.id === roomId)

    //notifications state 안에 해당 채팅방의 알림 정보가 없을 때 
    if (index < 0) {
      notifications.push({
        id: roomId,
        total: DataSnapshot.size,
        lastKnownTotal: DataSnapshot.size,
        count: 0
      })
    }
    // 이미 해당 채팅방의 알림 정보가 있을 떄 
    else {
      //상대방이 채팅 보내는 그 해당 채팅방에 있지 않을 때 
      if (roomId !== currentRoomId) {
        //현재까지 유저가 확인한 총 메시지 개수 
        lastTotal = notifications[index].lastKnownTotal

        //count (알림으로 보여줄 숫자)를 구하기 
        //현재 총 메시지 개수 - 이전에 확인한 총 메시지 개수 > 0
        //현재 총 메시지 개수가 10개이고 이전에 확인한 메시지가 8개 였다면 2개를 알림으로 보여줘야함.
        if (DataSnapshot.size - lastTotal > 0) {
          notifications[index].count = DataSnapshot.size - lastTotal
        }
      }
      //total property에 현재 전체 메시지 개수를 넣어주기
      notifications[index].total = DataSnapshot.size
    }
    //목표는 방 하나 하나의 맞는 알림 정보를 notifications state에 넣어주기 
    this.setState({ notifications })
  }
  handleShow = () => this.props.dispatch(setShowAddRoom(true))


  changeRoom = (room) => {
    this.props.dispatch(setCurrentRoom(room))
    this.clearNotifications(room.id)
    this.props.dispatch(setGoToEnd(false))
  }


  clearNotifications = (roomId) => {
    const { notifications } = this.state
    let index = notifications.findIndex(
      notification => notification.id === roomId
    )

    if (index > -1) {      
      let newNotifications = [...notifications]
      newNotifications[index].lastKnownTotal = newNotifications[index].total
      newNotifications[index].count = 0
      this.setState({ notifications: newNotifications })
    }
  }

  getNotificationCount = (room) => {
    const { notifications } = this.state
    let count = 0
    
    notifications.forEach(notification => {
      if (notification.id === room.id) {
        count = notification.count
      }
    })
    if (count > 0) return (count > 99 ? '+99' : count)
  }



  renderRooms = (rooms) => 
    rooms.length > 0 &&
    rooms.map(room => (
      <li
        key={room.id}
        style={{
          color: room.id === this.props.room?.id && '#669DF6',
          backgroundColor: room.id === this.props.room?.id && 'rgb(255, 255, 255,0.2)'
        }}
        onClick={() => this.changeRoom(room)}
      >
        <div>
          {room?.members ? 
            Object.values(room.members)
            .map(member => member.displayName)
            .join(', ')
            :
          ''
          }
        </div>
        <Badge style={{ marginTop: '4px' }} variant='danger'>
          {this.getNotificationCount(room)}
        </Badge>
        
      </li>
    ))
  
  render() {
    return (
      <div className='chat-side-rooms'>
        <div className='chat-side-rooms-wrapper'>
          <div className='chat-side-rooms-header'>
              <span>Chats ({this.state.rooms.length})</span>
            <FaPlusSquare
              onClick={this.handleShow}
              style={{
                right: 15, cursor: 'pointer'
              }} 
            />
          </div>
          <div className='chat-side-rooms-body'>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {this.renderRooms(this.state.rooms)}          
            </ul>
          </div>
          <CreateRoomModal />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
    room: state.room.currentRoom
  }
}

export default connect(mapStateToProps)(ChatSideRooms)
