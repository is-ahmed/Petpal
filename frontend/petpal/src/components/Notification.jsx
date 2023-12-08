import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Button, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import {faUser, faBell, faCheck} from '@fortawesome/free-solid-svg-icons'
import {useEffect, useState, useContext} from "react";
import { UserContext } from '../contexts/UserContext';
import CloseButton from 'react-bootstrap/CloseButton';
import { useNavigate } from 'react-router';


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

const Notification = ({notification, deleteNotif, readNotif}) => {
	let navigate = useNavigate()

	return (
		<NavDropdown.Item style={notification['read'] ? {
			display: 'flex',
			justifyContent: 'space-between',
			background: 'rgba(0, 0, 0, 0)'
		} : {	
			display: 'flex',
			justifyContent: 'space-between',
			background: 'rgba(0, 0, 0, 0.1)'
		}}>
			<div onClick={() => {navigate(notification['link'].replace("http://localhost:3000", ""))}}>
				<a
					style={{
						fontSize: "14px",
						textDecoration: 'none',
						marginRight: "10px"
					}}>
					{getMessage(notification['type'])}
				</a>
			</div>

			<span style={{ display: 'inline-flex', alignItems: 'center' }}>
				<span className='me-1' onClick={() => readNotif(notification['id'])}><FontAwesomeIcon icon={faCheck} /></span>
				<CloseButton onClick={() => deleteNotif(notification['id'])}/>
			</span>
				</NavDropdown.Item>
	)	
}

export default Notification;


