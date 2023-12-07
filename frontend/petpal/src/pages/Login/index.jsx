import LandingHeader from "../../components/LandingHeader"; 
import Footer from "../../components/Footer";
import LoginBody from "../../components/LoginBody";
import { UserContext } from "../../contexts/UserContext";

function LoginPage({type}) {
	return (
		<>		
		<LandingHeader/>
		<LoginBody type={type}/>
		<Footer/>
		</>
	)	
}

export default LoginPage;
