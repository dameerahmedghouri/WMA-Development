import React from 'react'
import TruncateText from '../common/TruncateText'

function ContactDetails(props) {
  return (
    <li className="contact-item">
      <div className="icon-box">
        <ion-icon name={props.icon}></ion-icon>
      </div>

      <div className="contact-info">
        <p className="contact-title">{props.title}</p>

        <TruncateText
          as="address"
          text={props.info}
          maxLength={18}
          singleLine={true}
        />
      </div>
    </li>
  )
}

export default ContactDetails