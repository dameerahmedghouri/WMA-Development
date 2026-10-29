import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routing from './routing/Routings'
import Sidebar from './components/sidebar/sidebar'
import Navbar from './components/navbar/Navbar'

function App() {
  return (
       <BrowserRouter>
      
         <main>
           <Sidebar />
           <div className="main-content">
             <Navbar />
             <Routing />
           </div>
         </main>
         </BrowserRouter>
       
  )
}

export default App
