import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { getDatabase, ref, set } from 'firebase/database'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import md5 from 'md5'
import { RiBubbleChartLine } from 'react-icons/ri'

function SignUp() {
  const { register, watch, formState: { errors }, handleSubmit } = useForm()
  const [errorFromSubmit, setErrorFromSubmit] = useState('')
  const [loading, setLoading] = useState(false)

  const password = useRef()
  password.current = watch('password')
  const onSubmit = async (data) => {
    try {
      setLoading(true)
      console.log(data)
      const auth = getAuth()
      let createdUser = await createUserWithEmailAndPassword(auth, data.email, data.password)

      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
      })

      // //Firebase 데이터베이스에 저장해주기 
      if (auth.currentUser) {
        set(ref(getDatabase(), `users/${createdUser.user.uid}`), {
          displayName: createdUser.user.displayName,
          email: createdUser.user.email,
          photoURL: createdUser.user.photoURL,
          online: true,
        })
      }
      
      setLoading(false)        
    } catch (error) {
      setErrorFromSubmit(error.message)
      setLoading(false)
      setTimeout(() => {
        setErrorFromSubmit('')
      }, 50000)
    }
  }
  return (
    <div className='auth-container'>
      <div className='auth-wrapper'>
        <div className='auth-header'><p className='auth-header-logo'>
          <RiBubbleChartLine />
          Bloosh</p>Sign up to live chat with your friends.
        </div>
        <form className='auth-body' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <div className='auth-body-inputGroup'>
            <label>Email</label>
            <input 
              name='email' 
              type='email'
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            />
            {errors.email && <p>This email field is required</p>}
          </div>
          <div className='auth-body-inputGroup'>
            <label>Name</label>
            <input
              name='name'
              {...register('name', { required: true, maxLength: 15 })}
            />
            {errors.name?.type === 'required' && <p>This name field is required</p>}
            {errors.name?.type === 'maxLength' && <p>Your input exceed maximum length</p>}
          </div>
          <div className='auth-body-inputGroup'>
            <label>Password</label>
            <input
              name='password'
              type='password'
              {...register('password', { required: true, minLength: 6 })}
            />
            {errors.password?.type === 'required' && <p>This password field is required</p>}
            {errors.password?.type === 'minLength' && <p>Password must have at least 6 characters</p>}
          </div>
          <div className='auth-body-inputGroup'>
            <label>Password Confirm</label>
            <input
              name='password_confirm'
              type='password'
              {...register('password_confirm', {
                required: true,
                validate: (value) =>
                  value === password.current
              })}
            />
            {errors.password_confirm?.type === 'required' && <p>This password confirm field is required</p>}
            {errors.password_confirm?.type === 'validate' && <p>The passwords do not match</p>}

          </div>
          <div className='auth-body-inputGroup'>
            <input  className= 'common-button' type='submit' disabled={loading} value='Sign up'/>
          </div>
        </form>
        <div className='auth-bottom'>
          Have an account? <Link to='/login'>Log in</Link>
        </div>
        <div className='auth-body-error'>
          {errorFromSubmit &&
            <p>{errorFromSubmit}</p>
          }
        </div>
      </div>
    </div>
  )
}

export default SignUp