import { BrowserRouter , Routes, Route} from 'react-router';
import Home from './pages/home/home';
import Contact from './pages/contacts/contact';
import About from './pages/about/about';
import Header from './components/header/header';


function App() {

   
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;