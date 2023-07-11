import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { AiOutlineArrowUp } from 'react-icons/ai'
import { setGoToEnd } from '../../../redux/actions/sta_action'
import { useDispatch, useSelector } from 'react-redux'
import { getDatabase, ref, set, remove, push, child } from 'firebase/database'
import { getStorage, ref as strRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export default function ChatMainFooter() {
  const room = useSelector(state => state.room.currentRoom)
  const user = useSelector(state => state.user.currentUser)
  const showDetail = useSelector(state => state.sta.showDetail)
  const { register, watch, formState: { errors }, handleSubmit, setValue } = useForm()
  const [loading, setLoading] = useState(false)
  const inputOpenImageRef = useRef()
  const [percentage, setPercentage] = useState(0)
  const content = useRef()
  content.current = watch('content')
  const messagesRef = ref(getDatabase(), 'messages')
  const typingRef = ref(getDatabase(), 'typing')
  const isPrivateRoom = useSelector(state => state.room.isPrivateRoom)
  const dispatch = useDispatch()
  
  const handleGoToEnd = () => {
    dispatch(setGoToEnd(true))
  }

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'content') {
        if (value.content !== '') {
          set(ref(getDatabase(), `typing/${room.id}/${user.uid}`), createTypingMessage())
        } else {
          remove(ref(getDatabase(), `typing/${room.id}/${user.uid}`))
        }
      }
      
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const createTypingMessage = () => {
    const message = {
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL
      }
    }
    message['content'] = 'Typing...'
    message['timestamp'] = new Date().toISOString()
    return message
  }

  const createMessage = (fileUrl = null) => {
    const message = {
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL
      }
    }

    if (fileUrl !== null) {
      message['image'] = fileUrl
    } else {
      message['content'] = content.current
    }
    message['timestamp'] = new Date().toISOString()
    return message
  }

  const onSubmit = async () => {
    if (loading) return
    if (!content) return

    await setLoading(true)

    try {
      await set(push(child(messagesRef, room.id)), createMessage())

      await remove(child(typingRef, `${room.id}/${user.uid}`))
      await setLoading(false)
      await setValue('content', '')
      handleGoToEnd()
    } catch (error) {
      setLoading(false)
    }
  }

  const handleOpenImageRef = () => {
      inputOpenImageRef.current.click()
  }

  const getPath = () => {
    if (isPrivateRoom) {
      return `/message/private/${room.id}`
    } else {
      return `/message/public`
    }
  }

  const handleUploadImage = (event) => {
    const file = event.target.files[0]
    const storage = getStorage()

    const filePath = `${getPath()}/${file.name}`
    console.log('filePath', filePath)
    const metadata = { contentType: file.type }
    setLoading(true)
    try {
      // https://firebase.google.com/docs/storage/web/upload-files#full_example
      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = strRef(storage, filePath)
      const uploadTask = uploadBytesResumable(storageRef, file, metadata)

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setPercentage(progress)
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
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
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log('File available at', downloadURL)
            set(push(child(messagesRef, room.id)), createMessage(downloadURL))
            setLoading(false)
          })
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='chat-main-footer-bottom'>
        { !showDetail &&
        <form className='chat-footer' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <span
            className='chat-footer-image'
            onClick={handleOpenImageRef}
            disabled={loading ? true : false}
          />
          <input className='chat-footer-input'
            name='content' 
            type='text'
            placeholder='Message'
            {...register('content', { required: true })}
          />
          <div 
            className= {
              content.current == '' ? 
                'chat-footer-submit'
              :
                'chat-footer-submit-typing'
            }
          >
            <button type='submit'>
              <AiOutlineArrowUp style={{ color: 'white' }} />
            </button>
          </div>
        </form>
        }
        {
          !(percentage === 0 || percentage === 100) &&
          <ProgressBar animated variant='warning' label={`${percentage}%`} now={percentage} />
        }
      
        <input
          accept='image/jpeg, image/png'
          style={{ display: 'none' }}
          type='file'
          ref={inputOpenImageRef}
          onChange={handleUploadImage}
        />
    </div>
    
  )
}
