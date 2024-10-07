import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { login, signup } from '../../config/fireBase'

const Login = () => {


  const [currState,setCurrState] = useState('Sign up')

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    
    if (currState === 'Sign up') {
      signup(formData.username,formData.email,formData.password)
    }
    else{
      login(formData.email,formData.password)
    }
  }

  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className='logo' />
      <form className='login-form' onSubmit={handleSubmit}>
        <h2>{currState}</h2>
        {currState === 'Sign up' ? <input type="text" onChange={(event) => onChangeHandler(event)} value={formData.username} placeholder='username' name='username' className='login-input' required />
                                 : ``}
        <input type="email" onChange={(event) => onChangeHandler(event)} value={formData.email} placeholder='Email address' name='email' className='login-input' required />
        <input type="password" onChange={(event) => onChangeHandler(event)} value={formData.password} placeholder='password' name='password' className='login-input' required />
        <button type='submit'>{currState === 'Sign up' ? 'Create account' : 'Login'}</button>
        <div className="login-term">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
          {currState === 'Sign up' ? <p className='login-toggle'>Alreday have an account? <span onClick={() => setCurrState('Login')}>click here</span></p>
                                   : <p className='login-toggle'>Create an account? <span onClick={() => setCurrState('Sign up')}>click here</span></p> }
        </div>
      </form >
    </div>
  )
}

export default Login