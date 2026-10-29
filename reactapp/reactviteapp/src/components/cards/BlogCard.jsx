import React from 'react'

function BlogCard({props}) {
  return (
    <li className="blog-post-item">
              <a href="#">

                <figure className="blog-banner-box">
                  <img src={props.img} alt="Design digest #79" loading="lazy"/>
                </figure>

                <div className="blog-content">

                  <div className="blog-meta">
                    <p className="blog-category">Design</p>

                    <span className="dot"></span>

                    <time datetime="2022-02-23">Fab 23, 2022</time>
                  </div>

                  <h3 className="h3 blog-item-title">Design digest #79</h3>

                  <p className="blog-text">
                    Optio cumque nihil impedit uo minus quod maxime placeat, velit esse cillum.
                  </p>

                </div>

              </a>
            </li>
  )
}

export default BlogCard