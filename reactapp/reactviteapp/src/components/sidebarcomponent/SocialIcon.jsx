import React from 'react'

function SocialIcon(props) {
    return (
        <li className="social-item">
            <a href="#" className="social-link">
                <ion-icon name={props.icon}></ion-icon>
            </a>
        </li>
    )
}

export default SocialIcon