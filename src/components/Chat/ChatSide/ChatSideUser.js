import React, { useState, useRef } from 'react'
import { RiBubbleChartLine } from 'react-icons/ri'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'react-bootstrap/Image'
import { useDispatch, useSelector } from 'react-redux'
import { setPhotoURL, setDisplayName } from '../../../redux/actions/user_action'
import { getDatabase, ref, update } from 'firebase/database'
import { getAuth, signOut, updateProfile } from 'firebase/auth'
import { getStorage, ref as strRef, getDownloadURL, uploadBytesResumable } from 'firebase/storage'

export default function ChatSideUser() {
  const me = useSelector(state => state.user.currentUser)
  const dispatch = useDispatch()
  const avatarUploadRef = useRef()
  const [show, setShow] = useState(false)
  const [showName, setShowName] = useState(me?.displayName)
  const [showErrors, setShowErrors] = useState({name: {type: ''}})

  const handleShowName = (event) => {
    const newShowName = event.target.value
    setShowName(newShowName)

    if (newShowName === '') {
      setShowErrors({name: {type: 'required'}})
    }else if (newShowName?.length > 15) {
      setShowErrors({name: {type: 'minLength'}})
    }else {
      setShowErrors({name: {type: ''}})
    }
  }

  const editName = async () => {
    if (showName === '') return
    if (me?.uid === '') return

    try {
      dispatch(setDisplayName(showName))
      await update(ref(getDatabase(), `users/${me.uid}`), { displayName: showName })
      setShow(false)
    } catch (error) {
      console.log('error')
    }
  }


  const handleSignOut = () => {
    const auth = getAuth()

    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    })
  }

  const handleAvatarUploadRef = () => {
    avatarUploadRef.current.click()
  }


  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    const auth = getAuth()
    const me = auth.currentUser

    const metadata = { contentType: file.type }
    const storage = getStorage()
    try {
      let uploadTask = uploadBytesResumable(strRef(storage, `user_image/${me.uid}`), file, metadata)

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
            default:
              console.log('Sorry')
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break
            case 'storage/canceled':
              // User canceled the upload
              break
            // ...
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break
            default:
              console.log('Sorry')
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((newPhotoURL) => {
            updateProfile(me, {
              photoURL: newPhotoURL
            })

            dispatch(setPhotoURL(newPhotoURL))

            update(ref(getDatabase(), `users/${me.uid}`), { photoURL: newPhotoURL })
          })
        }
      )
    } catch (error) {
      // console.log(error)
    }
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleSubmit = (event) => {
    if (showErrors.name?.type !== '') return
    event.preventDefault()
    if (isFormValid()) editName()
    
  }

  const isFormValid = () => showName

  return (
    <div className='chat-side-user'>
      <h3 className='chat-side-user-logo'>
        <RiBubbleChartLine /> Bloosh
      </h3>
      <div className='chat-side-user-body'>
        <Image src={me?.photoURL} roundedCircle />
        <Dropdown>
          <Dropdown.Toggle id='dropdown-basic'>
            {me?.displayName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleAvatarUploadRef}>Change an avatar</Dropdown.Item>
            <Dropdown.Item onClick={handleShow}>Edit Profile</Dropdown.Item>
            <Dropdown.Divider></Dropdown.Divider>
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
             <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form autoComplete='off'>
              <Form.Group controlId='formBasicName'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  onChange={handleShowName}
                  type='text'
                  value={showName}
                />
              {showErrors.name?.type === 'required' && <p style={{color: '#FF8964'}}>This name field is required</p>}
              {showErrors.name?.type === 'maxLength' && <p style={{color: '#FF8964'}}>Your input exceed maximum length</p>}
              </Form.Group>
              <Form.Group controlId='formBasicFoo' style={{display: 'none'}}>
                <Form.Control type='text'/>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>Close</Button>
            <Button variant='primary' onClick={handleSubmit}>Edit</Button>
          </Modal.Footer>
        </Modal>
      </div>
      <input 
        className='chat-side-user-avatarUpload'
        onChange={handleAvatarUpload}
        accept='image/jpeg, image/png'
        ref={avatarUploadRef}
        type='file'
      />
    </div>
  )
}
