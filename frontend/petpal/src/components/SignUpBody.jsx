import React, { useState } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom'
import styles from "./css/landing.module.css"


// Retrieved from here: https://react-bootstrap.netlify.app/docs/forms/layout/#formgroup


const SignUpBody = (props) => {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("")
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("")
	const [password2, setPassword2] = useState("")
//	const [address, setAddress] = useState("")
//	const [city, setCity] = useState("")
//	const [province, setProvince] = useState("")
//	const [postalCode, setPostalCode] = useState("")
	const [avatar, setAvatar] = useState()
	const [errors, setErrors] = useState({})
	let navigate = useNavigate();
	const mainStyles = {
		display: 'flex',
		'flex-grow': 1,
		'flex-direction': 'column',
		'justify-content': 'center',
		'align-items': 'center',
	}
	const submit = (event) => {
		let data = new FormData()
		data.append('name', name)
		data.append('username', username)
		data.append('email', email)
		data.append('password1', password)
		data.append('password2', password2)
		data.append('avatar', avatar)
		event.preventDefault();
		let request = fetch(`http://localhost:8000/seeker/`, {
			method: 'POST',
			body: data
		})

		request
			.then(response => response.json())
			.then(json => {
				let error_count = 0;
				let localErrors = errors;
				for (let [key, value] of data.entries()) {
					if (key === 'password1') key = 'password'
					if (key in json) {
						if (key === 'avatar') {
							if (json['avatar'].constructor === Array) {
								error_count++;
								localErrors[key] = json['avatar'][0];
							} else {
								localErrors[key] = ''
							}
						}
						
						else if (json[key] !== data.get(key)) {
							// Means this is an error
							error_count++;	
							localErrors[key] = json[key].constructor === Array ? json[key][0] : json[key];
						} else {
							localErrors[key] = ''
						}

					} else {
						localErrors[key] = ''
					}
				}
				if (error_count == 0) navigate('/signup-success')
				else setErrors({...localErrors})
			})
			.catch();
		
	}
	return (
	<main style={mainStyles} className={`${styles.signupbody}`}>
		    <div id="content" className="d-flex justify-content-end align-items-center">
      <div
        id="form"
        className="shadow p-3 mb-5 bg-white rounded form-container m-3 mt-5 container-fluid"
      >
        <h1>Sign Up</h1>
        <form onSubmit={submit} action="#" className="row g-3">
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
				Name
            </label>
            <input type="text" className="form-control" id="name" onChange={e => setName(e.target.value)}/>
          </div>
          <div className="col-md-6">
            <label htmlFor="username" className="form-label">
				Username* 
            </label>
            <input type="text" className="form-control" id="username" onChange={e => setUsername(e.target.value)} />
			{ errors['username'] ? <p style={{color: 'red'}}>{errors['username']}</p> : <p></p>}
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email*
            </label>
            <input type="email" className="form-control" id="email" onChange={e => setEmail(e.target.value)} />
			{ errors['email'] ? <p style={{color: 'red'}}>{errors['email']}</p> : <p></p>}
            <label htmlFor="avatar" className="form-label">
             Profile Picture* 
            </label>
            <input type="file" className="form-control" id="avatar" onChange={e=>setAvatar(e.target.files[0])} />
			{ errors['avatar'] ? <p style={{color: 'red'}}>{errors['avatar']}</p> : <p></p>}
          </div>
          <div className="col-md-6">
            <label htmlFor="password1" className="form-label">
              Password*
            </label>
            <input
              type="password"
              className="form-control"
              id="password1"
			  onChange={e=>setPassword(e.target.value)}
			  
            />
			{ errors['password'] ? <p style={{color: 'red'}}>{errors['password']}</p> : <p></p>}
            <label htmlFor="password2" className="form-label">
              Confirm Password*
            </label>
            <input
              type="password"
              className="form-control"
              id="password2"
			  onChange={e=>setPassword2(e.target.value)}
			  
            />
			{ errors['password2'] ? <p style={{color: 'red'}}>{errors['password2']}</p> : <p></p>}
          </div> 
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
	</main>
	)
}

export default SignUpBody;


