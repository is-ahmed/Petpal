import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import {faUser, faBell} from '@fortawesome/free-solid-svg-icons'
import {useState} from "react";
import Button  from 'react-bootstrap/Button';



const LandingHeader = () => {
    return <Navbar expand='lg'
    style={{'backgroundColor': '#77b8ba'}}>
        <Container className='m-auto'>
            <Navbar.Brand href="/">PetPal</Navbar.Brand>
			<span className='d-flex justify-content-end'>
			<Button className='me-3' href="/login-user">Login</Button> 
			</span>
        </Container>
    </Navbar>
}



export default LandingHeader;
