import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Pet from './pages/Pet';
import UserUpdatePage  from './pages/UserUpdate';
import ShelterUpdatePage from './pages/ShelterUpdate';
import UserUpdateSuccessPage from './pages/UserSuccess';

function App() {

  return <BrowserRouter>
    <Routes>
      <Route path="pet/:petId/" element={<Pet />} />
      <Route path="seeker/update" element={<UserUpdatePage />}/>
      <Route path="shelter/update" element={<ShelterUpdatePage />}/>
      <Route path="success" element={<UserUpdateSuccessPage/>}/>
 
    </Routes>
  </BrowserRouter>;
}

export default App;
