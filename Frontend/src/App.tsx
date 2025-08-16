
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';

function App() {
  

  return (
   <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false} />
   <Routes>
   
    <Route path="/" element={<Home/> } />
   </Routes>

</BrowserRouter>
  )
}

export default App
