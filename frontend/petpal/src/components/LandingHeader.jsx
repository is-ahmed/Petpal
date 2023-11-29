import React from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import './css/landing.css'

const LandingHeader = () => {

	return (
		<header>
		 <Navbar expand="lg" className="bg-body-tertiary">
		  <Container>
			<Navbar.Brand href="/">Petpal</Navbar.Brand>
			<Button href="/login" variant="primary">Login</Button>
		  </Container>
		</Navbar>
	   </header>
	)
}

export default LandingHeader;
