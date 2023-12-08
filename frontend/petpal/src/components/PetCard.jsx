import React, { useEffect, useState } from 'react'
import styles from './css/search.module.css'

const PetCard = ({pet}) => {
	
	useEffect(() => {
	}, [])

	return (
		<a className="col mt-3 me-3 mb-3 shadow rounded  petinfo p-3" href="./Petpage.html">
				<img
				  src={pet['image']}
				  className="img-fluid rounded"
				  alt="pet photo"
				/>
				<h3 className="fw-bold mt-3">{pet['name']}</h3>
				<p className="mb-0">Age: {pet['age']} - {pet['species']} - {pet['breed']}</p>
	   </a>
	)

}

export default PetCard;
