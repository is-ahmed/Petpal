import React, { useState } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import './css/search.css'


const SearchFilters = () => {
	
	return (
		<div id="filter" class="d-flex flex-column justify-content-start align-items-center me-3 shadow rounded p-2">
		  <div className="d-flex flex-column w-100 dropdown mt-3">
			<label htmlFor="species">Species</label>
			<select name="species" className="btn btn-primary">
			  <option disabled="" selected="" value="">
				Select
			  </option>
			  <option>Dog</option>
			  <option>Cat</option>
			  <option>Rabbit</option>
			  <option>Fish</option>
			</select>
		  </div>
		  <div className="d-flex flex-column w-100 dropdown">
			<label htmlFor="sortby">Sort By</label>
			<select name="sortby" className="btn btn-primary">
			  <option disabled="" selected="" value="">
				Select
			  </option>
			  <option>Age</option>
			  <option>Name</option>
			</select>
		  </div>
		  <div className="d-flex flex-column w-100 dropdown">
			<label htmlFor="breed">Breed</label>
			<select name="breed" className="btn btn-primary">
			  <option disabled="" selected="" value="">
				Select
			  </option>
			  <option>Afghan hound</option>
			  <option>Goldren Retriever</option>
			  <option>Rotweiller</option>
			</select>
		  </div>
		  <div className="d-flex flex-column w-100 dropdown">
			<label htmlFor="age">Age</label>
			<select name="age" className="btn btn-primary">
			  <option disabled="" selected="" value="">
				Select
			  </option>
			  <option>Young</option>
			  <option>Adult</option>
			  <option>Senior</option>
			</select>
		  </div>
		  <div className="d-flex flex-column w-100 dropdown">
			<label htmlFor="gender">Gender</label>
			<select name="gender" className="btn btn-primary">
			  <option disabled="" selected="" value="">
				Select
			  </option>
			  <option>Female</option>
			  <option>Male</option>
			</select>
		  </div>
		  <div className="d-flex flex-column w-100 dropdown">
			<label htmlFor="careandbehave">Care &amp; Behaviour</label>
			<select name="careandbehave" className="btn btn-primary">
			  <option disabled="" selected="" value="">
				Select
			  </option>
			  <option>House Trained</option>
			  <option>Special Needs</option>
			</select>
		  </div>
		  <div className="d-flex flex-column w-100 dropdown">
			<label htmlFor="dayson">Days on PetPal</label>
			<select name="dayson" className="btn btn-primary">
			  <option disabled="" selected="" value="">
				Select
			  </option>
			  <option>1</option>
			  <option>7</option>
			  <option>14</option>
			  <option>21+</option>
			</select>
		  </div>
		</div>

	)
}


export default SearchFilters;
