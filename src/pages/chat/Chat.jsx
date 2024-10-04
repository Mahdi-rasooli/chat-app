import React from 'react'
import  './Chat.css'
import LeftSideBar from '../../components/leftSideBar/LeftSideBar'
import ChatBox from '../../components/chatBox/ChatBox'
import RightSideBar from '../../components/rightSideBar/RightSideBar'

const Chat = () => {
  return (
    <div className='chat'>
      <div className="chat-container">
        <LeftSideBar />
        <ChatBox />
        <RightSideBar />
      </div>
    </div>
  )
}

export default Chat