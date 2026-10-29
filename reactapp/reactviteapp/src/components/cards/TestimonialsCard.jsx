import React from 'react'
import TruncateText from '../common/TruncateText'

function TestimonialsCard(props) {
  return (
    <li className="testimonials-item">
      <div className="content-card" data-testimonials-item>
        <figure className="testimonials-avatar-box">
          <img src={props.avatar} alt={props.alt} width="60" data-testimonials-avatar />
        </figure>

        <h4 className="h4 testimonials-item-title" data-testimonials-title>
          {props.name}
        </h4>

        <div className="testimonials-text" data-testimonials-text>
          <TruncateText
            as="p"
            text={props.description}
            maxLength={110}
          />
        </div>
      </div>
    </li>
  )
}

export default TestimonialsCard