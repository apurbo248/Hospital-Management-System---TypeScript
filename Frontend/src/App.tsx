
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import FindDoctorPage from './pages/FindADoctorPage';


function App() {
  

  return (
   <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false} />
   <Routes>
   <Route />
    <Route path="/" element={<Home/> } />
    <Route path ="/doctors" element={<FindDoctorPage/>}/>
   </Routes>

</BrowserRouter>
  )
}

export default App
