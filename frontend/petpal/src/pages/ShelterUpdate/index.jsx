
import UpdateShelter from "../../components/ShelterUpdateBody";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";

function ShelterUpdatePage() {
	return (
    // footer and header will be added 
		<>		
		<Navigation type={"shelter"} username={localStorage.getItem('user_name')}/>
		<UpdateShelter/>
		<Footer/>
		</>
	)	
}

export default ShelterUpdatePage;
