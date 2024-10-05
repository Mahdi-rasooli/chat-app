import React from 'react'
import './RightSideBar.css'
import assets from '../../assets/assets'

const RightSideBar = () => {
  return (
    <div className='rs'>
      <div className="rs-profile">
        <img src={assets.profile_img} alt="" />
        <h3>RIchard stanford<img src={assets.green_dot} alt=""  className='dot'/></h3>
        <p>Hey i am using messagner</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic1} alt="" />
        </div>
      </div>
      <button>Logout</button>
    </div>
  )
}

export default RightSideBar