import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap'
import {faUser, faBell} from '@fortawesome/free-solid-svg-icons'
import {useEffect, useState, useContext} from "react";
import { UserContext } from '../contexts/UserContext';
import Notification from './Notification';


export default function Navigation({type, username}) {
    const [notifications, setNotifications] = useState([])
	const {usernameContext, userType, id} = useContext(UserContext);
	const [page, setPage] = useState(1);
	const [read, setRead] = useState(false); // Get all notifs by default

	useEffect(() => {
		fetch(`http://localhost:8000/notifications/notifs?p=${page}&ordering=creation_time`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		})
		.then(response => response.json())
		.then(json => {
			console.log(json['results'])
			setNotifications(json['results'])	
		})

	}, [])

    return <Navbar expand='lg'
    style={{'backgroundColor': '#77b8ba'}}>
        <Container>
            <Navbar.Brand href="">PetPal</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="">Home</Nav.Link>
                    {type === 'shelter' &&
                    <Nav.Link href="">My Pets</Nav.Link>}
                    {type === 'seeker' &&
                        <Nav.Link href="">My Applications</Nav.Link>}

                </Nav>
                <Nav className={'justify-content-end'}>
                    <NavDropdown title={(<><FontAwesomeIcon
                        style={{
                            backgroundColor: '#309975',
                            border: 'none',
                            color: 'white',
							padding: "8px 10px",
                        }}
                        className={'rounded-circle btn big-screen'}
                        icon={faBell}/></>)}>
						{notifications.length !== 0 ? notifications.map((notif, index) => {
							if (read && notif['read']) {
								return <Notification notification={notif}/>
							} else if (!read)  {
								return <Notification notification={notif}/>
							}
						}) : <NavDropdown.Item>No notifications</NavDropdown.Item>} 
						<Button className='me-3' onClick={() => {setPage(page + 1)}}>Next Page</Button>
						<Button onClick={() => {read ? setRead(false) : setRead(true)}}>Read</Button>
                    </NavDropdown>
                    <NavDropdown className='' title={(<><FontAwesomeIcon
                        style={{
                            backgroundColor: '#309975',
                            border: 'none',
                            color: 'white',
							padding: "8px 10px",
                        }}
                        className={'rounded-circle btn btn-primary big-screen'}
                        icon={faUser}/> {username}</>)}>
                        {type === 'seeker' &&
                        <NavDropdown.Item href="">Account Info</NavDropdown.Item>}
                        {type === 'shelter' &&
                        <NavDropdown.Item href="">Account Info</NavDropdown.Item>}
                        <NavDropdown.Item href="/">
                            Sign Out
                        </NavDropdown.Item>
                    </NavDropdown>

                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
}
