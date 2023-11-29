import React, { useState } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import "./css/landing.css"
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


// Retrieved from here: https://react-bootstrap.netlify.app/docs/forms/layout/#formgroup


const SignUpBodyShelter = (props) => {
	const [shelterName, setShelterName] = useState("")
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("")
	const [password2, setPassword2] = useState("")
	const [address, setAddress] = useState("")
	const [city, setCity] = useState("")
	const [province, setProvince] = useState("")
	const [postalCode, setPostalCode] = useState("")
	const [avatar, setAvatar] = useState()
	const mainStyles = {
		display: 'flex',
		'flex-grow': 1,
		'flex-direction': 'column',
		'justify-content': 'center',
		'align-items': 'center',
		background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${"../assets/family-dog.jpg"});` 
	}
	const submit = (event) => {
		let data = new FormData()
		data.append('username', email)
		data.append('password1', password)
		data.append('password2', password2)
		data.append('email', email)
		data.append('name', shelterName)
		data.append('avatar', avatar)
		data.append('address', address)
		event.preventDefault();
		let request = fetch(`http://localhost:8000/shelter/`, {
			method: 'POST',
			body: data
		})

		request
			.then(response => response.json())
			.then(data => {
				for (let key in data) {
					if (data[key].constructor === Array) {
						// Means this is an error
						
					}
				}
			})
			.catch();
		
	}
	return (
	<main style={mainStyles}>
		    <div id="content" className="d-flex justify-content-end align-items-center">
      <div
        id="form"
        className="shadow p-3 mb-5 bg-white rounded form-container m-3 mt-5 container-fluid"
      >
        <h1>Sign Up</h1>
        <form onSubmit={submit} action="#" className="row g-3">
          <div className="col-md-12">
            <label htmlFor="inputSheltername" className="form-label">
              Shelter Name
            </label>
            <input type="text" className="form-control" id="inputSheltername" onChange={e => setShelterName(e.target.value)}/>
          </div>
          <div className="col-md-6">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input type="email" className="form-control" id="inputEmail4" onChange={e => setEmail(e.target.value)}/>
            <label htmlFor="inputEmail4" className="form-label">
             Profile Picture 
            </label>
            <input type="file" className="form-control" id="inputEmail4" onChange={e=>setAvatar(e.target.files[0])}/>
          </div>
          <div className="col-md-6">
            <label htmlFor="inputPassword4" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="inputPassword4"
			  onChange={e=>setPassword(e.target.value)}
            />
            <label htmlFor="inputPassword5" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="inputPassword5"
			  onChange={e=>setPassword2(e.target.value)}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="inputAddress"
              placeholder="1234 Main St"
			  onChange={e=>setAddress(e.target.value)}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress2" className="form-label">
              Address 2
            </label>
            <input
              type="text"
              className="form-control"
              id="inputAddress2"
              placeholder="Apartment, studio, or floor"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputCity" className="form-label">
              City
            </label>
            <input type="text" className="form-control" id="inputCity" />
          </div>
          <div className="col-md-4">
            <label htmlFor="inputProvince" className="form-label">
              Province
            </label>
            <select id="inputProvince" className="form-select">
              <option selected="">Choose...</option>
              <option>Alberta</option>
              <option>British Columbia</option>
              <option>Manitoba</option>
              <option>New Brunswick</option>
              <option>Newfoundland</option>
              <option>Nova Scotia</option>
              <option>Ontario</option>
              <option>Prince Edward Island</option>
              <option>Quebec</option>
              <option>Saskatchewan</option>
              <option>Northwest Territories</option>
              <option>Nunavut</option>
              <option>Yukon</option>
            </select>
          </div>
          <div className="col-md-2">
            <label htmlFor="inputZip" className="form-label">
              Postal Code
            </label>
            <input type="text" className="form-control" id="inputZip" />
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

export default SignUpBodyShelter;


