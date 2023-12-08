import React from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import styles from "./css/landing.module.css"

const LandingBody = () => {
	return (
	  <main 
		className={`d-flex justify-content-center align-items-center ${styles.landingpage}`}>
		<div id="landing-div" className={`${styles.fadein} justify-content-center align-items-center`}>
		 <Container>
		  <h1 className="text-white">Pet adoption made easy</h1>
		  <div className="d-flex justify-content-center align-items-center">
			<Button className='me-3' href="/signup-user" variant="primary">Sign Up (Adopter)</Button>
			<Button href="/signup-shelter" variant="primary">Sign Up (Shelter)</Button>
		  </div>
		 </Container>
		</div>
	  </main>
	)
}

export default LandingBody
