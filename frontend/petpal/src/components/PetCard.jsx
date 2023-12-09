import React, { useEffect, useState } from 'react'
import styles from './css/search.module.css'

const PetCard = ({pet, flagjeff}) => {
	
	useEffect(() => {
	}, [])

	return (
	<a className={`card ${styles.card}`} href={`/pet/${pet.id}`}>
                <img
                  src={pet.image}
                  className={`card-img-top ${styles.cardImgTop}`}
                  alt="Pet"
                />
                <div className="card-body text-center">
                    <h5 className={`card-title ${styles.themeText}`}>{pet.name}</h5>
                    <p className="card-text">Breed: {pet.breed}</p>
                    <p className="card-text">{pet.age} years | {pet.gender} | {pet.size} lbs</p>
                    {/* <p className="card-text">Location: {petInfo.location}</p> */}
                </div>
    </a>	
	)

}

export default PetCard;
