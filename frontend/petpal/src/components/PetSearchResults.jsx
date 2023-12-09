import React, { useEffect, useState, useContext } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import styles from './css/search.module.css'
import PetCard from './PetCard'
import { SearchContext } from '../contexts/SearchContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFilter} from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-bootstrap/Modal';
import SearchFilters from './SearchFilters'

const PetSearchResults = ({results, isMobile}) => {

  const { query, searchParams, setSearchParams } = useContext(SearchContext);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
	const RenderPets = () => {
		if (results === undefined) return ""
		let row = [];
		let rows = [];
		if (results.length <= 3) {
			rows.push(
				<div className={`p-3 row mb-3 ${styles.row}`} >
					{results.map((pet, index) => <PetCard key={index} pet={pet}/>)}
				</div>
			)
			return rows
		}
		results.map((pet, index) => {	
			row.push(<PetCard key={index} pet={pet}/>)
			if (row.length === 3) {
				rows.push(
					<div className={`p-3 row mb-3 ${styles.row}`}>
						{row}
					</div>
				)
				row = []
			}
		})
		if (row.length != 0) rows.push(
					<div className='p-3 row mb-3'>
						{row}
					</div>
		)
		return rows;
	}

	return (
		<>
		 <div className="container container-fluid">
		 <span className="d-flex justify-content-center">
			<button type="button" className={`mt-3 btn btn-primary ${styles.mobilefilters}`} onClick={handleShow}>
				Filters
				<FontAwesomeIcon className='ms-2'icon={faFilter} />
			</button>
		</span>
		 
		<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
		<SearchFilters modal={true}/>
		</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>	
		<RenderPets/>
		<div className='d-flex justify-content-center align-items-center'>
			<span className='me-3'>Page: {query['page']}</span>
			{query['page'] !== 1 ? <Button className="me-3" onClick={e=>{setSearchParams({...query, page: query['page'] - 1})}}>Prev Page</Button> : ""}		  
			{results.length < query['page_size'] ? "" : <Button onClick={e=>{setSearchParams({...query, page: query['page'] + 1})}}>Next Page</Button>}
		</div>
		</div>
		</>

	);
}

export default PetSearchResults

