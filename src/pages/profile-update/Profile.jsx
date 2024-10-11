import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import assets from '../../assets/assets'
import upload from '../../lib/upload'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../config/fireBase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'


const Profile = () => {

  const navigate = useNavigate()

  const [image, setImage] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    uid: '',
    prevImage: '',
  })
  const { setUserData } = useContext(AppContext)


  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value })
  }

  const submitHandler = async (event) => {
    event.preventDefault()

    try {

      if (!formData.prevImage && !image) {
        toast.error('please upload profile image')
      }
      const docRef = doc(db, 'users', formData.uid)


      if (image) {
        const imgUrl = await upload(image)
        setFormData((formData) => ({ ...formData, prevImage: imgUrl }));
        
        await updateDoc(docRef, {
          name: formData.name,
          bio: formData.bio,
          avatar: imgUrl
        })
      }

      else {
        await updateDoc(docRef, {
          name: formData.name,
          bio: formData.bio,
        })
      }
      const snap = getDoc(docRef)
      setUserData(snap.data())
      navigate('/chat')

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {

      /* if (user) {
         try {
           const docRef = doc(db, 'users', user.uid);
           const docSnap = await getDoc(docRef);
 
           if (docSnap.exists()) {
             const data = docSnap.data();
             setFormData((prev) => ({
               ...prev,
               uid: user.uid,
               name: data.name || '',
               bio: data.bio || '',
               prevImage: data.avatar || '',
             }));
             console.log(formData.uid);
 
           }
           else {
             await updateDoc(docRef, {
               name: '',
               bio: '',
               avatar: '',
             });
             setFormData({
               uid: user.uid,
               name: '',
               bio: '',
               prevImage: '',
             });
           }
 
         } catch (error) {
           console.error('Error fetching user data:', error);
         }*/
      if (user) {

        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        setFormData((prev) => ({ ...prev, uid: user.uid }));

        /*if (docSnap.data().name) {
          setFormData((prev) => ({ ...prev, name: docSnap.data().name }));
        }
        if (docSnap.data().bio) {
          setFormData((prev) => ({ ...prev, bio: docSnap.data().bio }));          
        }
        if (docSnap.data().avatar) {
          setFormData((prev) => ({ ...prev, prevImage: docSnap.data().avatar }));
        }*/
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData((prev) => ({
            ...prev,
            uid: user.uid,
            name: data.name || '',
            bio: data.bio || '',
            prevImage: data.avatar || '',
          }));
        }
        else {
          await updateDoc(docRef, {
            name: '',
            bio: '',
            avatar: '',
          });
          setFormData({
            uid: user.uid,
            name: '',
            bio: '',
            prevImage: '',
          });
        }
      }

      else {
        navigate('/')
      }
    })
  }, [])

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={submitHandler}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(event => setImage(event.target.files[0]))} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
            Upload profile image
          </label>
          <input onChange={(event) => onChangeHandler(event)} name='name' value={formData.name} type="text" placeholder='Your name' required />
          <textarea onChange={(event) => onChangeHandler(event)} name='bio' value={formData.bio} placeholder='Profile bio' required></textarea>
          <button type='submit'>Save</button>
        </form>
        <img className='profile-pic' src={image ? URL.createObjectURL(image) : formData.prevImage ? formData.prevImage : assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default Profile