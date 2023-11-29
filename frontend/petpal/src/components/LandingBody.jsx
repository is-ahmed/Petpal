import React from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import "./css/landing.css"

const LandingBody = () => {
	return (
	  <main id="landing-page" className="d-flex justify-content-center align-items-center">
		<div id="landing-div" className="fade-in d-flex flex-column justify-content-center align-items-center">
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
