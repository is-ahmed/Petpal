import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pet from './pages/Pet';
import {
	BrowserRouter as Router,
	Routes,
	Route
} from 'react-router-dom'
import UserUpdatePage  from './pages/UserUpdate';
import ShelterUpdatePage from './pages/ShelterUpdate';
import UserUpdateSuccessPage from './pages/UserSuccess';
import LandingPage from './pages/Landing'
import RegisterUser from './pages/RegisterUser';
import RegisterShelter from './pages/RegisterShelter';
import LoginPage from './pages/Login';
import Pets from './pages/SearchPets';
import Shelters from './pages/SearchShelters';
import RegisterSuccess from './pages/RegisterSuccess';
import {ShelterManagement} from "./components/ShelterManagement/ShelterManagement";
import {ShelterDetails} from "./components/ShelterDetails/ShelterDetails";

function App() {
  return (
    <div className="App">
	  <Router>
		<Routes>
			<Route path="/">
				<Route index element={<LandingPage/>}/>
				<Route path="signup-user" element={<RegisterUser/>}></Route>
				<Route path="signup-shelter" element={<RegisterShelter/>}></Route>
				<Route path="login-user" element={<LoginPage type={'adopter'}/>}></Route>
				<Route path="login-shelter" element={<LoginPage type={'shelter'}/>}></Route>
				<Route path="login-admin" element={<LoginPage type={'admin'}/>}></Route>
				<Route path="pets" element={<Pets/>}></Route>
			    <Route path="shelters" element={<Shelters/>}></Route>
				<Route path="signup-success" element={<RegisterSuccess/>}></Route>
        <Route path="pet/:petId/" element={<Pet />} />
      <Route path="seeker/update" element={<UserUpdatePage />}/>
      <Route path="shelter/update" element={<ShelterUpdatePage />}/>
      <Route path="success" element={<UserUpdateSuccessPage/>}/>
	                    <Route path={'shelters/manage'} element={
				                            <ShelterManagement/>
				                        }/>
	                      <Route path={'shelters/:shelter_id'} element={
				                              <userContext.Provider value={useUserContext()}>
				                                  <ShelterDetails/>
				                              </userContext.Provider>
				                          }/>
 
			</Route>
		</Routes>
	  </Router>
    </div>
  );
}

export default App;
