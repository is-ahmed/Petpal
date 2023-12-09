
import UpdateUser from "../../components/UserUpdateBody";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";

function UserUpdatePage() {
	return (
    // navbar, header not complete
		<>		
    <Navigation type={"seeker"} username={localStorage.getItem('user_name')}/>
		<UpdateUser/>
    <Footer/>
		</>
	)	
}

export default UserUpdatePage;
