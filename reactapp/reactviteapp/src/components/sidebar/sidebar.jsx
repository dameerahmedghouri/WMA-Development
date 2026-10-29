import React from 'react'
import { ContactDetailsData, SocialIconData } from '../constants/sidebarconstant'
import ContactDetails from '../sidebarcomponent/ContactDetails'
import SocialIcon from '../sidebarcomponent/SocialIcon'
import myAvatar from '../../assets/images/my-avatar.png'

function Sidebar() {
  return (
     <aside className="sidebar" data-sidebar>

      <div className="sidebar-info">

        <figure className="avatar-box">
          <img src={myAvatar} alt="Richard hanrick" width="80"/>
        </figure>

        <div className="info-content">
          <h1 className="name" title="Richard hanrick">Richard hanrick</h1>

          <p className="title">Web developer</p>
        </div>

        <button className="info_more-btn" data-sidebar-btn>
          <span>Show Contacts</span>

          <ion-icon name="chevron-down"></ion-icon>
        </button>

      </div>

      <div className="sidebar-info_more">

        <div className="separator"></div>

        <ul className="contacts-list">
        {ContactDetailsData.map((item, index) => (
            <ContactDetails key={index} icon={item.icon} title={item.title} info={item.info} />
        ))}
         

        </ul>

        <div className="separator"></div>

        <ul className="social-list">

          {SocialIconData.map((item, index) => (
            <SocialIcon key={index} icon={item} />
          ))}

        </ul>

      </div>

    </aside>
  )
}

export default Sidebar