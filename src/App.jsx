import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import Login from '../src/pages/login/Login'
import Profile from '../src/pages/profile-update/Profile'
import Chat from '../src/pages/chat/Chat'


function App() {

  return (
    <>
      <Router>
        <div>
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
