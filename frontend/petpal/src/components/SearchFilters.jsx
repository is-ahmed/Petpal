import React, { createContext, useContext, useEffect, useState } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { SearchContext } from '../contexts/SearchContext'
import styles from './css/search.module.css'

const BreedOptions = ({ species }) => {
	const [breedOptions, setBreedOptions] = useState([]);
	useEffect(() => {
		fetch(`http://localhost:8000/petlistings/pets?status=all`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		})
		.then(response => response.json())
		.then(json => {
			// Want to show all shelter options in dropdown
			let speciesPets = json['results'].filter(pet => pet['species'] === species)
			let breed_Options = speciesPets.map((pet, index) => {return pet['breed']})

			setBreedOptions(breed_Options.filter((breed, index, array) => array.indexOf(breed) === index)); // Should be an array
		})
	}, [breedOptions])
	return (
			breedOptions.map(function(breed) {
				return (<option key={breed}>{breed}</option>)
			})	
	);
}


const SearchFilters = ({modal}) => {
	const { query, searchParams, setSearchParams } = useContext(SearchContext);
	const [ shelterResults, setShelterList ] = useState([])

	useEffect(() => {
		fetch(`http://localhost:8000/shelters`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		})
		.then(response => response.json())
		.then(json => {
			// Want to show all shelter options in dropdown
			setShelterList(json['results']); // Should be an array
		})
	}, [])
	
	return (
		<div className={`d-flex flex-column justify-content-start align-items-center me-3 shadow rounded p-2 ${modal ? "modal-filter" :styles.filter}`}>
		  <div className="d-flex flex-column w-100 dropdown mt-3">
			<label htmlFor="species">Species</label>
			<select name="species" className="btn btn-primary" onChange={e=>{setSearchParams({...query, species: e.target.value})}} defaultValue={query['species']}>
			  <option disabled=""  value="">
				Select
			  </option>
			  <option>Dog</option>
			  <option>Cat</option>
			  <option>Rabbit</option>
			  <option>Other</option>
			</select>
		  </div>
		  <div className="d-flex flex-column w-100 dropdown">
			<label htmlFor="sortby">Sort By</label>
			<select name="sortby" className="btn btn-primary" onChange={e=>{setSearchParams({...query, ordering: e.target.value})}} defaultValue={query['ordering']}>
			  <option disabled=""  value="">
				Select
			  </option>
			  <option>Age</option>
			  <option>Name</option>
			</select>
		  </div>
		  <div className="d-flex flex-column w-100 dropdown">
			<label htmlFor="breed">Breed</label>
			<select name="breed" className="btn btn-primary" onChange={e=>{setSearchParams({...query, breed: e.target.value})}} defaultValue={query['breed']}>
			  <option disabled=""  value="">
				Select
			  </option>
			  <BreedOptions species={searchParams.get('species')}/>
			</select>
		  </div>
		  <div className="d-flex flex-column w-100 dropdown">
			<label htmlFor="dayson">Days on PetPal</label>
			<select name="dayson" className="btn btn-primary" onChange={e=>{setSearchParams({...query, daysOnPetpal: e.target.value})}} defaultValue={query['daysOnPetpal']}>
			  <option disabled=""  value="">
				Select
			  </option>
			  <option>1</option>
			  <option>7</option>
			  <option>14</option>
			  <option>21+</option>
			</select>
		  </div>
		  <div className="d-flex flex-column w-100 dropdown">
			<label htmlFor="gender">Gender</label>
			<select name="gender" className="btn btn-primary" onChange={e=>{setSearchParams({...query, gender: e.target.value})}}defaultValue={query['gender']}>
			  <option disabled="" value="" >
				Select
			  </option>
			  <option>Male</option>
			  <option>Female</option>
			</select>
		  </div>
		  <div className="d-flex flex-column w-100 dropdown">
			<label htmlFor="shelter">Shelter</label>
			<select value={query['shelter']} name="shelter" className="btn btn-primary" onChange={e=>{
				setSearchParams({...query, shelter: e.target.value
				})}} defaultValue={query['shelter']}>
			  <option disabled="" value="-1">
				Select
			  </option>
			  {shelterResults.map(shelter => <option value={shelter['id']}>{shelter['name']}</option>)}
			</select>
		  </div>
		</div>

	)
}


export default SearchFilters;
