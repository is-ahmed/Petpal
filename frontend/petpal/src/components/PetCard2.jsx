import React, { useEffect, useState } from 'react'
import styles from './css/search.module.css'

const PetCard = ({pet, flagjeff}) => {
	
	useEffect(() => {
	}, [])

	return (
        <a className={`${!flagjeff && 'col'} mt-3 me-3 mb-3 shadow rounded ${styles.petinfo} p-3`} href={`http://localhost:3000/pet/${pet['id']}`}
           style={{
               width: flagjeff && '30%'
           }}>
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
