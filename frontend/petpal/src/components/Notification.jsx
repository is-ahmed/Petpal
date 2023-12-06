import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import {faUser, faBell} from '@fortawesome/free-solid-svg-icons'
import {useEffect, useState, useContext} from "react";
import { UserContext } from '../contexts/UserContext';
import CloseButton from 'react-bootstrap/CloseButton';


function getMessage(msg_type) {
	let msg;
	if (msg_type === 'CONVERSATION') {
		msg = "A conversation has had an update!"
	} else if (msg_type === 'APPLICATION_STATUS') {
		msg = "An application recieved an update!"
	} else if (msg_type === 'NEW_APPLICATION') {
		msg = "A new application has been submitted!"
	} else if (msg_type === 'COMMENT') {
		msg = "A new comment has been added!"
	} else if (msg_type === 'REVIEW') {
		msg = "You have new reviews!"
	} else {
		msg = "A new pet has been added!"
	}
	return msg
}

const Notification = ({notification}) => {
	return (
		<NavDropdown.Item style={notification['read'] ? {
			display: 'flex',
			background: 'rgba(0, 0, 0, 0)'
		} : {	
			display: 'flex',
			background: 'rgba(0, 0, 0, 0.1)'
		}}>
			<a href={notification['link']}
				style={{
					textDecoration: 'none'
				}}
			>
				{getMessage(notification['type'])}
			</a>
			<CloseButton onClick={() => {
				fetch(`http://localhost:8000/notifications/notifs/${notification['id']}`, {
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`
					}	
				})
			}}/>
		</NavDropdown.Item>
	)	
}

export default Notification;


