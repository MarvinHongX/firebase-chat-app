import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { getDatabase, ref, onChildAdded, onChildRemoved, set, push, child, update, off, get} from 'firebase/database'
import SearchBox from '../../../commons/components/SearchBox'
import { Container } from 'react-bootstrap'
import UserCheckBox from '../../../commons/components/UserCheckBox'
import { setCurrentRoom } from '../../../redux/actions/room_action'
import { setShowAddRoom, setUserSearchKeyword } from '../../../redux/actions/sta_action'
import { useDispatch, useSelector } from 'react-redux'


export default function CreateRoomModal() {
  const messagesRef = ref(getDatabase(), 'messages')
  const [usersRef] = useState(ref(getDatabase(), 'users'))
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState({})

  const me = useSelector(state => state.user.currentUser)
  const show = useSelector(state => state.sta.showAddRoom)
  const searchKeyword = useSelector(state => state.sta.userSearchKeyword)
  const dispatch = useDispatch()

  useEffect(() => {
    addUsersListeners()
    return () => {
      removeUsersListeners()
    }
  }, [])

  const addUsersListeners = () => {
    if (!me) return

    let usersArray = []

    onChildAdded(usersRef, DataSnapshot => {
      if (me.uid === DataSnapshot.key) return
      const addedUser = { 
        uid: DataSnapshot.key, 
        ...DataSnapshot.val() 
      }
      usersArray.push(addedUser)
      setUsers(usersArray)
    })

    onChildRemoved(usersRef, DataSnapshot => {
      if (me.uid === DataSnapshot.key) return
      const removedUser = { 
        uid: DataSnapshot.key, 
        ...DataSnapshot.val()
      }
      const newUsers = usersArray.filter(user => user.uid !== removedUser.uid)
      usersArray = newUsers
      setUsers(usersArray)
    })
  }

  const removeUsersListeners = () => {
    off(usersRef)
  }
  
  const handleClose = () => {
    dispatch(setShowAddRoom(false))
    setSelectedUsers({})
    dispatch(setUserSearchKeyword({value: '', loading: false}))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isFormValid()) {
      addRoom()
      setSelectedUsers({})
    }
  }

  const isFormValid = () => {
    const selectedUserKeys = Object.keys(selectedUsers)
    return selectedUserKeys && selectedUserKeys.length > 0
  }


  const joinMessage = (type, displayName, inviter) => {
    const message = {
      user: {
        id: type,
        name: displayName,
        image: null
      }
    }
    message['content'] = inviter
    message['timestamp'] = new Date().toISOString()
    return message
  }


  const addRoom = async () => {
    const roomsRef = ref(getDatabase(), 'rooms')
    const members = [...Object.keys(selectedUsers), me.uid].reduce(
      (acc, curr) => ({ ...acc, [curr]: {uid: curr} }),
      {}
    )

    const newRoomRef = push(roomsRef,)
    const newRoomId = newRoomRef.key

    const newRoom = {
      id: newRoomId,
      name: '',
      members: members,
      createdBy: {
        uid: me.uid,
      },
    }

    try {
      await update(child(roomsRef, newRoomId), newRoom)
      const displayNames = []
      for (const userId of Object.keys(members)) {
        const userRef = ref(getDatabase(), `users/${userId}`);
        const userSnapshot = await get(userRef);
        const user = userSnapshot.val();
      
        await update(child(userRef, `rooms`), {
          [newRoomId]: { 
            roomId: newRoomId,
            roomName: '',
          }
        });
        (me.uid !== userId) && displayNames.push(user.displayName);
      }
      const joinedNames = displayNames.join(', ');
      const newMessage = joinMessage('sysJoin', joinedNames, me.displayName)
      set(push(child(messagesRef, newRoomId)), newMessage)

      dispatch(setCurrentRoom(newRoom))
      dispatch(setShowAddRoom(false))
    } catch (error) {
      alert(error)
    }
  }

  const handleSearchChange = (event) => {
    dispatch(setUserSearchKeyword({value: event.target.value, loading: true}))
  }


  const searchedUsers = (users, searchKeyword) => {
    const newUsers = [...users]
    const regex = new RegExp(searchKeyword, 'gi')

    const searchResults = newUsers.reduce((acc, user) => {
      if (
        (user.displayName && user.displayName.match(regex)) || user.email.match(regex)
      ) {
        const checked = selectedUsers[user.uid] ? true : false
        acc.push({ ...user, checked })
      }
      return acc
    }, [])
    return searchResults
  }


  const renderUsers = (users) =>
    users.filter(user => user.uid !== me.uid).map(user => (
      <UserCheckBox
        key={user.uid}
        checked= {user.checked}
        user={{
          uid: user.uid,
          photoURL: user.photoURL,
          displayName: user.displayName,
          email: user.email,
        }}
        onCheckboxChange={handleCheckboxChange}
      />
    ))  

  const handleCheckboxChange = (uid, checked) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (checked) {
        return { ...prevSelectedUsers, [uid]: true }
      } else {
        const { [uid]: omit, ...rest } = prevSelectedUsers
        return rest
      }
    })
  }

  
  return (
      <div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>New chat</Modal.Title> 
          </Modal.Header>
          <Modal.Body>
            <Container>
              <SearchBox handleSearchChange={handleSearchChange}/>
            </Container>
            <div style={{height:'300px', overflowY:'auto'}}>
              {
                renderUsers(searchedUsers(users, searchKeyword.value))
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>Close</Button>
            <Button variant='primary' onClick={handleSubmit}>Add</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }

