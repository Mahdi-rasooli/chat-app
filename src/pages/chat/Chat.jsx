import React, { useContext, useEffect, useState } from 'react'
import './Chat.css'
import LeftSideBar from '../../components/leftSideBar/LeftSideBar'
import ChatBox from '../../components/chatBox/ChatBox'
import RightSideBar from '../../components/rightSideBar/RightSideBar'
import { AppContext } from '../../context/AppContext'

const Chat = () => {

  const { userData, chatData } = useContext(AppContext)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (chatData && userData) {
      setLoading(false)
    }

  },[userData,chatData])

  return (
    <div className='chat'>
      {
        loading
          ? <p className='loading'>Loading...</p>
          : <div className="chat-container">
            <LeftSideBar />
            <ChatBox />
            <RightSideBar />
          </div>
      }


    </div>
  )
}

export default Chat