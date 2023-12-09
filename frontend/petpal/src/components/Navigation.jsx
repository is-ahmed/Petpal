import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar, Nav, Container, NavDropdown, Button, Form } from 'react-bootstrap'
import {faUser, faBell, faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'
import {useEffect, useState, useContext} from "react";
import { UserContext } from '../contexts/UserContext';
import Notification from './Notification';


export default function Navigation({type, username}) {
    const [notifications, setNotifications] = useState([])

    // https://stackoverflow.com/questions/39435395/reactjs-how-to-determine-if-the-application-is-being-viewed-on-mobile-or-deskto
	const {usernameContext, userType, id} = useContext(UserContext);
	const [page, setPage] = useState(1);
	const [totalNotifPages, setTotalNotifPages] = useState(1)
	const [read, setRead] = useState(false); // Get all notifs by default
	const [deleted, setDeleted] = useState(false);
	const [readNotifi, setReadNotif] = useState(false);

    const [width, setWidth] = useState(window.innerWidth);
	const [notifListOpen, setNotifListOpen] = useState(false);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
		fetch(`http://localhost:8000/notifications/notifs?page_size=4&p=${page}&ordering=creation_time`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		})
		.then(response => response.json())
		.then(json => {
			setNotifications(json['results'])	
			setTotalNotifPages(Math.ceil(json['count'] / 4))
		})

        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [page, notifListOpen]);

	const [shelterId, setShelterId] = useState(0)
	useEffect(() => {
		if (type === 'shelter') {
			fetch('http://localhost:8000/shelter/', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`
				}
			})
				.then(response => response.json())
				.then(json => {
					setShelterId(json.shelter_id)
				})
		}
	})

	const deleteNotif = (id) => {
		fetch(`http://localhost:8000/notifications/notifs/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}	
		})
		.then(response => {setNotifications(notifications.filter(notification => notification['id'] != id))})
	}

	const readNotif = (id) => {
		fetch(`http://localhost:8000/notifications/notifs/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		})
		.then(response => {
			return response.json()
		})
		.then(json => {
			fetch(`http://localhost:8000/notifications/notifs?page_size=4&p=${page}&ordering=creation_time`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`
				}
			})	
			.then(response => response.json())
			.then(json => {
				setNotifications(json['results'])	
			})
		})
	}

    const isMobile = width <= 1000;

    return <Navbar expand='lg' className={'fixed-top'}
    style={{'backgroundColor': '#77b8ba'}}>
        <Container>
            <Navbar.Brand href="">PetPal</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href={type === 'shelter' ? `/shelters/${shelterId}` : '/pets'}>Home</Nav.Link>
                    {type === 'shelter' &&
                    <Nav.Link href="http://localhost:3000/shelters/manage">My Pets</Nav.Link>}
                    <Nav.Link href="/applications">My Applications</Nav.Link>
                    <Nav.Link href="http://localhost:3000/shelters/list">Shelters</Nav.Link>

                </Nav>
                <Nav className={'justify-content-end'}>
                    <NavDropdown align={'end'}title={
                        (<>{isMobile ? <span>Notification</span> :
                            <FontAwesomeIcon
                        style={{
                            backgroundColor: '#309975',
                            border: 'none',
                            color: 'white',
                            padding: '8px 10px',
                        }}
                        className={'rounded-circle btn'}
                        icon={faBell}
						/>}
                        </>)} 
						show={notifListOpen} onMouseEnter={() => setNotifListOpen(true)} onMouseLeave={() => setNotifListOpen(false)}>
							{notifications.length !== 0 ? notifications.map((notif, index) => {
                            if (read && notif['read']) {
                                return <Notification notification={notif} deleteNotif={deleteNotif} readNotif={readNotif}/>
                            } else if (!read)  {
                                return <Notification notification={notif} deleteNotif={deleteNotif} readNotif={readNotif}/>
                            }
                        }) : <NavDropdown.Item>No notifications</NavDropdown.Item>} 
						
						<span style={{ display: 'inline-flex', alignItems: 'center' }}>
						  <span style={{ display: 'inline-flex', alignItems: 'center' }} className='page-button-container'>
							<Button variant={'link'} className={'page-button'} disabled={page <=1}
							onClick={() => {setPage(page - 1)}}>
								<FontAwesomeIcon icon={faChevronLeft}/>
							</Button>
							<p style={{margin: 0}}>{page}</p>
							<Button variant={'link'} className={'page-button'} disabled={page >= totalNotifPages}
							onClick={() => {setPage(page + 1)}}>
								<FontAwesomeIcon icon={faChevronRight}/>
							</Button>
					   	 </span>
                          <Form.Check // prettier-ignore
                                type="switch"
                                id="custom-switch"
                                label="Show read"
                                onClick={() => {
									read ? setRead(false) : setRead(true)	
								}}/>
						</span>
                    </NavDropdown>
                    <NavDropdown className='' title={(<>
                        <FontAwesomeIcon
                        style={{
                            backgroundColor: '#309975',
                            border: 'none',
                            color: 'white',
                            padding: '8px 10px',
                        }}
                        className={'rounded-circle btn'}
                        icon={faUser}/> {username}</>)}>
                        {type === 'seeker' &&
                        <NavDropdown.Item href="/seeker/update">Account Info</NavDropdown.Item>}
                        {type === 'shelter' &&
                        <NavDropdown.Item href="/shelter/update">Account Info</NavDropdown.Item>}
                        <NavDropdown.Item href="/">
                            Sign Out
                        </NavDropdown.Item>
                    </NavDropdown>

                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
}
