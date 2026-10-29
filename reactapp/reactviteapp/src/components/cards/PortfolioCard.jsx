import React from 'react'

function PortfolioCard(props) {
  const {
    title,
    category,
    img,
    alt,
    icon = "eye-outline"
  } = props.item || props;

  return (
    <li
      className="project-item active"
      data-filter-item
      data-category={category?.toLowerCase()}
    >
      <a href="#">
        <figure className="project-img">
          <div className="project-item-icon-box">
            <ion-icon name={icon}></ion-icon>
          </div>

          <img src={img} alt={alt || title} loading="lazy" />
        </figure>

        <h3 className="project-title">{title}</h3>

        <p className="project-category">{category}</p>
      </a>
    </li>
  )
}

export default PortfolioCard