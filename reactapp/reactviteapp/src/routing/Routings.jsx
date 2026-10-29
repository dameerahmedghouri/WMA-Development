import { Route, Routes } from 'react-router-dom'
import About from '../pages/about/About.jsx'
import Resume from '../pages/resume/Resume.jsx'
import Portfolio from '../pages/portfolio/Portfolio.jsx'
import Product from '../pages/product/Product.jsx'
import Github from '../pages/github/Github.jsx'

function Routings() {
  return (
    
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/about" element={<About />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/blog" element={<Product />} />
      <Route path="/github" element={<Github />} />
      <Route path="/contact" element={<Github />} />
      
    </Routes>
  )
}

export default Routings
