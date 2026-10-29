import React from 'react'

function ClintLogos(props) {
    return (
        <li className="clients-item">
            <a href="#">
                <img src={props.logo} alt="client logo" />
            </a>
        </li>
    )
}

export default ClintLogos