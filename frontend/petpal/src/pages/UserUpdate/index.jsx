
import UpdateUser from "../../components/UserUpdateBody";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";

function UserUpdatePage() {
	return (
    // navbar, header not complete
		<>		
    <Navigation type={"seeker"}/>
		<UpdateUser/>
    <Footer/>
		</>
	)	
}

export default UserUpdatePage;