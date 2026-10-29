import React from 'react'

function ResumeSection({ title, data = [], icon = "book-outline" }) {
    return (
         <section className="timeline">

          <div className="title-wrapper">
            <div className="icon-box">
              <ion-icon name={icon}></ion-icon>
            </div>

            <h3 className="h3">{title}</h3>
          </div>

          <ol className="timeline-list">

          {data.map((item, index) => (
            <li className="timeline-item" key={index}>

              <h4 className="h4 timeline-item-title">{item.title}</h4>

              <span>{item.duration}</span>

              <p className="timeline-text">
                {item.text}
              </p>

            </li>

          ))}

          </ol>

        </section>

    )
}

export default ResumeSection