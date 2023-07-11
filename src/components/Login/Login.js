import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { RiBubbleChartLine } from 'react-icons/ri'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [errorFromSubmit, setErrorFromSubmit] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const auth = getAuth()
      await signInWithEmailAndPassword(auth, data.email, data.password)

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
      <div className='auth-wrapper auth-wrapperShort'>
        <div className='auth-header'>
          <p className='auth-header-logo'>
            <RiBubbleChartLine />
            Bloosh
          </p>
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
            <label>Password</label>
            <input
                name='password'
                type='password'
                {...register('password', { required: true, minLength: 6 })}
            />
            {errors.password && errors.password.type === 'required' && <p>This password field is required</p>}
            {errors.password && errors.password.type === 'minLength' && <p>Password must have at least 6 characters</p>}
          </div>
          <div className='auth-body-inputGroup'>
            <input className='common-button' type='submit' disabled={loading} value='Log in'/>
          </div>
        </form>
        <div className='auth-bottom'>
          Don't have an account? <Link to='/signup'>Sign up</Link>
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