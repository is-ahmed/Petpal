import React, { createContext, useContext, useEffect, useState } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { SearchContext } from '../contexts/SearchContext'
import styles from './css/search.module.css'

const BreedOptions = ({ species }) => {
	if (species === 'Dog') {
		return (
			<>
			  <option>Afghan Hound</option>
			  <option>Alaskan Malamute</option>
			  <option>Beagle</option>
			  <option>German Shepherd</option>
			  <option>Golden Retriever</option>
			  <option>Rotweiller</option>
			</>
		);
	} else if ( species === 'Cat') {
		return (
			<>
			  <option>American Shorthair</option>
			  <option>British Shorthair</option>
			  <option>Siamese</option>
			</>
		)
	} else if (species === 'Rabbit') {
		return (
			<>
			  <option>American Fuzzy Lop</option>
			  <option>Holland Lop</option>
			  <option>Polish Rabbit</option>
			</>
		)
	} else if (species === 'Other') {
		return (
			<>
			  <option>Betta Fish</option>
			  <option>Clownfish</option>
			  <option>Goldfish</option>
			</>
		)
	}
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
