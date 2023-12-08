import LandingHeader from "../../components/LandingHeader";
import Footer from "../../components/Footer";
import SignUpBody from "../../components/SignUpBody";
import styles from '../../components/css/landing.module.css'

const RegisterSuccess = () => {
	return (
		<>
		<LandingHeader/>
		<main className={`d-flex flex-column justify-content-center align-items-center ${styles.signupbody}`}>
		<h1 className="text-white">Thanks for joining Petpal!</h1>	
		</main>
		<Footer/>
		</>
	)

}

export default RegisterSuccess
