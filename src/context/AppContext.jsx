import { doc, getDoc, updateDoc , onSnapshot} from 'firebase/firestore';
import React, { createContext, useState , useEffect} from 'react'
import { auth, db } from '../config/fireBase';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)
    const [chatData, setChatData] = useState(null)


    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid)
            const userSnap = await getDoc(userRef)
            const userData = userSnap.data()
            setUserData(userData)
            if (userData.avatar && userData.name) {
                navigate('/chat')
            } else {
                navigate('/profile')
            }
            await updateDoc(userRef, {
                lastseen: Date.now()
            })
            setInterval(async () => {
                if (auth.chatUser) {
                    await updateDoc(userRef, {
                        lastseen: Date.now()
                    })
                }
            }, 60000)


        } catch (error) {
            console.log(error);

        }
    }

    useEffect(()=>{

        if (userData) {
            const chatRef = getDoc(db,'chats',userData.id)
            const unSub = onSnapshot(chatRef,async (res) => {
                const chatItems = res.data().chatData
                const tempData = []
                for(const item of chatItems){
                    const userRef = doc(db,'users',item.rId)
                    const docSnap = await getDoc(userRef)
                    const userData = docSnap.data()
                    tempData.push({...item,userData})
                }
                setChatData(tempData.sort((a,b) => a.updatedAt - b.updatedAt))
            })
            return () => {
                unSub()
            }
        }
    },[])

    const value = {
        userData, setUserData,
        chatData, setChatData,
        loadUserData
    }

    return (
        <>
            <AppContext.Provider value={value}>
                {props.children}
            </AppContext.Provider>
        </>
    )
}

export default AppContextProvider;