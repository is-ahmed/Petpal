import React, { useEffect, useState } from 'react'

const PetCard = (props) => {
	
	useEffect(() => {
	}, [])

	return (
		<a className=" col shadow rounded  petinfo p-3" href="./Petpage.html">
				<img
				  src="./images/rotweiller.jpg"
				  className="img-fluid rounded"
				  alt="pet photo"
				/>
				<h3 className="fw-bold mt-3">{props.name}</h3>
				<p className="mb-0">{props.age}</p>
	   </a>
	)

}

export default PetCard;
