// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore"
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyBirxel1emKA21Rbbp20b7xNN5MIN8G6VU",
  authDomain: "chat-app-2375e.firebaseapp.com",
  projectId: "chat-app-2375e",
  storageBucket: "chat-app-2375e.appspot.com",
  messagingSenderId: "407194016412",
  appId: "1:407194016412:web:8373438da5d4a78abc6b59",
  measurementId: "G-JY5FMH7ZGM"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)


const signup = async (username,email,password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth,email,password)
        const user = res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey, There i am using chat app",
            lastseen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatData:[]
        })

    } catch (error) {
        console.error(error)
        toast.error(error.code)
    }
}

export { signup }
