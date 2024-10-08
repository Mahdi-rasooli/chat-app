import React, { useContext, useEffect } from "react";
import {
  Route,
  Routes,
} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from '../src/pages/login/Login'
import Profile from '../src/pages/profile-update/Profile'
import Chat from '../src/pages/chat/Chat'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "./config/fireBase";
import { onAuthStateChanged } from "firebase/auth";
import { AppContext } from "./context/AppContext";


function App() {

  const navigate = useNavigate();
  const {loadUserData} = useContext(AppContext)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate('/chat')
        await loadUserData(user.uid)
      } else {
        navigate('/')
      }
    })
  }, [])

  return (
    <>
      <div>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/chat' element={<Chat />} />
        </Routes>
      </div>
    </>
  )
}

export default App
