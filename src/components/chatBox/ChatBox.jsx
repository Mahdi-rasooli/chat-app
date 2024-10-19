import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../config/fireBase'
import { toast } from 'react-toastify'
import upload from '../../lib/upload'

const ChatBox = () => {

  const { userData, messagesId, setMessagesId, chatUser, messages, setMessages } = useContext(AppContext)
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    try {

      if (input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          message: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date()
          })
        })

        const userIds = [chatUser.rId, userData.id]

        userIds.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id)
          const userChatsSnpShots = await getDoc(userChatsRef)

          if (userChatsSnpShots.exists()) {
            const userChatData = userChatsSnpShots.data()
            const chatIndex = userChatData.chatData.findIndex((c) => c.messageId === messagesId);

            userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30)
            userChatData.chatData[chatIndex].updatedAt = Date.now()



            if (userChatData.chatData[chatIndex].rId === userData.id) {
              userChatData.chatData[chatIndex].messageSeen = false
            }
            await updateDoc(userChatsRef, {
              chatData: userChatData.chatData
            })
          }
        })
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

    setInput('')
  }

  const sendImage = async (event) => {

    try {
      const image = event.target.files[0]
      const fileUrl = await upload(image)

      if (fileUrl && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          message: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date()
          })
        })
        const userIds = [chatUser.rId, userData.id]

        userIds.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id)
          const userChatsSnpShots = await getDoc(userChatsRef)

          if (userChatsSnpShots.exists()) {
            const userChatData = userChatsSnpShots.data()
            const chatIndex = userChatData.chatData.findIndex((c) => c.messageId === messagesId);

            userChatData.chatData[chatIndex].lastMessage = 'image'
            userChatData.chatData[chatIndex].updatedAt = Date.now()



            if (userChatData.chatData[chatIndex].rId === userData.id) {
              userChatData.chatData[chatIndex].messageSeen = false
            }
            await updateDoc(userChatsRef, {
              chatData: userChatData.chatData
            })
          }
        })
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const convertTimeStamp = (Timestamp) => {
    const date = Timestamp.toDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    if (hours > 12) {
      return hours - 12 + ':' + minutes + 'PM'
    }
    else {
      return hours + ':' + minutes + 'AM'
    }
  }


  useEffect(() => {
    if (messagesId) {
      const onSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
        setMessages(res.data().message.reverse())
      })
      return () => {
        onSub()
      }
    }
  }, [messagesId])

  return chatUser ? (
    <div className='chat-box'>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>{chatUser.userData.name} <img className='dot' src={assets.green_dot} alt="" /></p>
        <img src={assets.help_icon} className='help' alt="" />
      </div>


      <div className="chat-msg">

        {messages.map((msg, index) => (
          <div key={index} className={msg.sId === userData.id ? 's-msg' : 'r-msg'}>
            {msg['image'] 
             ? <img className='msg-image' src={msg.image} alt="" />
             : <p className='msg'>{msg.text}</p>}
            <div>
              <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
              <p>{convertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input onChange={(event => setInput(event.target.value))} value={input} type="text" placeholder='Send message' />
        <input onChange={sendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) :
    <div className="chat-welcome">
      <img src={assets.logo_icon} alt="" />
      <p>Chat anytime, anywhere</p>
    </div>
}

export default ChatBox