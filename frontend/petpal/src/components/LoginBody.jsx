import React, { useContext, useState } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import styles from "./css/landing.module.css"
import { UserContext } from '../contexts/UserContext'

const LoginBody = ({type}) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(0);
	const {usernameContext, userType, id} = useContext(UserContext);
	let navigate = useNavigate();

	const submit = (event) => {
		let credentials = {
			'username': username,
			'password': password
		}
		event.preventDefault();
		let request = fetch('http://localhost:8000/token/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body : JSON.stringify(credentials) 
		})
		request
			.then(response => response.json())
			.then(data => {
				if (!("access" in data)) {
					setError(1);
				} else {
					localStorage.setItem('access_token', data['access'])
					console.log(data['access'])
					// TODO: Perform two more fetches to see user type
					if (type === 'adopter') {
						localStorage.setItem('user_type', 'seeker')
						localStorage.setItem('user_name', username)
						navigate('/pets')
					} else if (type === 'shelter') {
						// navigate to shelter main page 
						localStorage.setItem('user_type', 'shelter')
						localStorage.setItem('user_name', username)
						navigate('/shelters/manage')
					} else {
						// navigate
						localStorage.setItem('user_type', 'admin')
						localStorage.setItem('user_name', username)
						navigate('/admin')
					}
				}
			})
			.catch(err => console.log(err))
	}
	return (
		<main>
		 <div className={`${styles.fadein} ${styles.container} min-vh-100 d-flex justify-content-center align-items-center`}>
	 <form action="#" onSubmit={submit} className="shadow mb-5 rounded bg-white form-container m-3 mt-5 p-5">
	   <h1>Login</h1>
	   <div className="mb-3">
			<label htmlFor="username" className="form-label">Username:</label>
			<input type="text" className="form-control" id="username" placeholder="Enter username" name="email" onChange={e => setUsername(e.target.value)}/>
		  </div>
		  <div className="mb-3">
			<label htmlFor="pwd" className="form-label">Password:</label>
			<input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd" onChange={e => setPassword(e.target.value)}/>
		  </div>
		  <div className="form-check mb-3">
			<label className="form-check-label">
			  <input className="form-check-input" type="checkbox" name="remember"/> Remember me
			</label>
		  </div>
		{error != 0 ? <p className="text-danger">Your email or password was incorrect!</p> : ""}
		<button type="submit" className="btn btn-primary">Login</button>
		<p className="mt-2">Don't have an account yet?</p>
		  <div className="d-flex align-items-center justify-content-start">
			  <a className="btn me-3 btn-primary" href="signup-user">Sign Up (Adopter)</a>
			  <a className="btn btn-primary" href="signup-shelter">Sign Up (Shelter)</a>
		  </div>
		<p className="mt-2">Login as different user?</p>
		  <div className="d-flex align-items-center justify-content-center">
			  <a className="btn me-3 btn-primary" href="login-shelter">Login (Shelter)</a>
			  <a className="btn btn-primary" href="login-admin">Login (Admin)</a>
		  </div>
	</form>
	 </div>	
		</main>
	)
}

export default LoginBody;


