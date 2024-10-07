import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import Login from '../src/pages/login/Login'
import Profile from '../src/pages/profile-update/Profile'
import Chat from '../src/pages/chat/Chat'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <>
      <Router>
        <div>
          <ToastContainer/>
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/chat' element={<Chat/>}/>
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
