import React, { useContext, useState } from 'react'
import './LeftSideBar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../config/fireBase'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'

const LeftSideBar = () => {

  const navigate = useNavigate()
  const { userData, chatData, messagesId, setMessagesId, chatUser, setChatUser } = useContext(AppContext)
  const [user, setUser] = useState(null)
  const [showSearch, setShowSearch] = useState(false)

  const inputHandler = async (event) => {
    try {
      const input = event.target.value
      if (input) {
        setShowSearch(true)
        const userRef = collection(db, 'users')
        const q = query(userRef, where('username', '==', input))
        const querySnap = await getDocs(q)
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {

          let userExist = false
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true
            }
          })

          if (!userExist) {
            setUser(querySnap.docs[0].data())
          }

        }
        else {
          setUser(null)
        }
      }
      else {
        setShowSearch(false)
      }

    } catch (error) {
      console.log(error);
    }
  }


  const showUserChat = async () => {
    const messageRef = collection(db, 'messages')
    const chatRef = collection(db, 'chats')

    try {
      const newMessageRef = doc(messageRef)
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        message: []
      })

      await updateDoc(doc(chatRef, user.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: '',
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      })

      await updateDoc(doc(chatRef, userData.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: '',
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      })

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const setChat = async (item) => {

    try {
      setMessagesId(item.messageId)
      setChatUser(item)
      const userChatsRef = doc(db, 'chats', userData.id)
      const userChatsSnapShot = await getDoc(userChatsRef)
      const userChatData = userChatsSnapShot.data() 
      const chatIndex = userChatData.chatData.findIndex((c) => c.messageId === item.messageId)
      userChatData.chatData[chatIndex].messageSeen = true
      await updateDoc(userChatsRef, {
        chatData: userChatData.chatData
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='ls'>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className='logo' alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate('/profile')}>Profile edit</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input onChange={(event) => inputHandler(event)} type="text" placeholder='Search' />
        </div>
      </div>

      <div className="ls-list">
        {showSearch && user
          ? <div onClick={showUserChat} className="contacts add-user">
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
          : (chatData && chatData.length > 0 ?
            (chatData.map((item, index) => (
              <div onClick={() => setChat(item)} className={`contacts ${item.messageSeen || item.messageId === messagesId ? '' : 'border'}`} key={index}>
                <img src={item.userData.avatar} alt="" />
                <div>
                  <p>{item.userData.name}</p>
                  <span>{item.lastMessage}</span>
                </div>
              </div>
            ))
            ) : null
          )
        }
      </div>
    </div>
  )
}

export default LeftSideBar