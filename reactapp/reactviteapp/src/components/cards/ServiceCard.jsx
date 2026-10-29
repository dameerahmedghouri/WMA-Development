import React from 'react'
import TruncateText from '../common/TruncateText'

function ServiceCard({ title, icon, description }) {
  return (
    <li className="service-item">
      <div className="service-icon-box">
        <img src={icon} alt={title} width="40" />
      </div>

      <div className="service-content-box">
        <h4 className="h4 service-item-title">{title}</h4>

        <TruncateText
          as="p"
          className="service-item-text"
          text={description}
          maxLength={60}
        />
      </div>
    </li>
  )
}

export default ServiceCard