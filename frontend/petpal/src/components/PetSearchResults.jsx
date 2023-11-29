import React, { useState } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import './css/search.css'
import PetCard from './PetCard'


const PetSearchResults = ({results}) => {

	return (
		<>
		  <div className="container container-fluid">
			<div className="row">
				<PetCard/>
				<PetCard/>
				<PetCard/>
			</div>
			<div className="row">
				<PetCard/>
				<PetCard/>
				<PetCard/>		  
			</div>
		  </div>
		  
		</>

	);
}

export default PetSearchResults

