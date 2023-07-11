import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Chat from './components/Chat/Chat'
import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'

import { getDatabase, ref, set, onValue, onDisconnect, child } from 'firebase/database'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from './firebase'

import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser, clearOnlineUser } from './redux/actions/user_action'
import { setCurrentRoom } from './redux/actions/room_action'
import useWindowSize from './hook/useWindowSize'
import useVisualViewportSize from './hook/useVisualViewportSize'

function App() {
  const navigate = useNavigate()
  let dispatch = useDispatch()
  const isLoading = useSelector((state) => state.user.isLoading)
  const onlineUser = useSelector((state) => state.user.onlineUser)
  const connectedRef = ref(getDatabase(), '.info/connected')
  const windowSize = useWindowSize()
  const viewportSize = useVisualViewportSize()


  onValue(connectedRef, (snap) => {
    if (!onlineUser) return
    const onlineRef = ref(child(getDatabase(), `users/${onlineUser.uid}`),'online')

    if (snap.val() === true) {
      set(onlineRef, true);
      onDisconnect(onlineRef).set(false);
    } else {
    }
  });
  

  useEffect(() => {
    
    const auth = getAuth(app)
    
    onAuthStateChanged(auth, (user) => {
      if (user) { 
        navigate('/')
        dispatch(setUser(user))
      } else { //signed out              
        navigate('/login')
        dispatch(clearUser())
        dispatch(clearOnlineUser())
        dispatch(setCurrentRoom())       
      }
    })
  }, [])
  if (isLoading) {
    return <div>loading...</div>
  } else {
    return (
      <Routes>
        <Route path='/' element={<Chat />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    )
  }
}

export default App
