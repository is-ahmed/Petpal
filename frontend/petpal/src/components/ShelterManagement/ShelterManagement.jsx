import {useEffect, useState} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.sm.css'
import './shelter-manager.sm.css'
import {Button, CloseButton, Dropdown, Modal, Navbar} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsis, faPlus} from '@fortawesome/free-solid-svg-icons'
import Navigation from "../Navigation";
import Footer from "../Footer";

export function ShelterManagement() {
    const [shelterDetails, setShelterDetails] = useState({})
    const [pets, setPets] = useState([])
    const [petDelete, setPetDelete] = useState(0) // will hold the id of the pet to delete
    const [error, setError] = useState('')
    const [applications, setApplications] = useState({})

    const [showPetAppName, setShowPetAppName] = useState('')
    const [showPetAppId, setShowPetAppId] = useState()
    const [showPetApp, setShowPetApp] = useState(false)

    const closePetApp = () => setShowPetApp(false)

    const cancelDelete = () => setPetDelete(0)

    const getPets = () => {
        fetch(`http://localhost:8000/petlistings/pets?shelter=${shelterDetails.shelter_id}&status=all`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(`${response.status}: ${response.statusText}`)
            })
            .then(json => {
                setPets(json.results)
            })
            .catch(error => {
                setError(error.toString())
            })
    }

    const getPetApplications = () => {
        fetch(`http://localhost:8000/applications/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then(response => response.json())
            .then(json => {
                let result_object = {}
                for (let obj of json.results) {
                    if (!(obj.pet_listing in result_object)) {
                        result_object[obj.pet_listing] = []
                    }

                    result_object[obj.pet_listing].push(obj)
                }

                setApplications(result_object)
            })
    }

    const showPetApplications = (id, name) => {
        setShowPetAppName(name)
        setShowPetApp(true)
        setShowPetAppId(id)
    }

    useEffect(() => {
        fetch('http://localhost:8000/shelter', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(`${response.status}: ${response.statusText}`)
            })
            .then(json => {
                setShelterDetails(json)
            })
            .catch(error => {
                setError(error.toString())
            })

        getPetApplications()
    }, []);

    useEffect(() => {
        if ('shelter_id' in shelterDetails) {
            getPets()
        }
    }, [shelterDetails]);

    const makeDate = (days_on_petpal) => {
        let date = new Date()
        date.setDate(date.getDate() - days_on_petpal)
        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
    }
    return <>
		<header>
			<Navigation type={'shelter'} username={localStorage.getItem('user_name')}/>
		</header>
        {(error) ? <p>{error}</p>:
            <main className="page-container">
                <h1 className="management-title">Manage your pets</h1>
                <hr/>
                <div className="pet-list-title">
                    <h3>Your pet listings:</h3>
                    <Button href={'/pet/create'} className={'button-add-pet'} variant={'primary'}
                            style={{display: 'flex', alignItems: 'center'}}>
                        <FontAwesomeIcon icon={faPlus}/>
                        Add New Pet
                    </Button>
                </div>
                <div className="pet-list-holder">
                    {pets.map((pet, i) => {
                        return <div className="pet-list-card" key={`petlist${i}`}>
                            <img src={pet.image}/>
                            <p className="pet-name">{pet.name}</p>
                            <p className="date-added">(Date Added: {
                                makeDate(pet.days_on_petpal)
                            })</p>
                            <Dropdown className={'pet-dropdown'}>
                                <Dropdown.Toggle className={'pet-dropdown-toggle'}
                                                 variant={'link'}>
                                    <FontAwesomeIcon icon={faEllipsis}/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href={`/pet/${pet.id}/update`}>Edit</Dropdown.Item>
                                    <Dropdown.Item as={'button'}
                                    onClick={() => showPetApplications(pet.id, pet.name)}>View Applicants</Dropdown.Item>
                                    <Dropdown.Item as={'button'}
                                                   onClick={() => setPetDelete(pet.id)}>Remove</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    })}
                </div>
                <Modal show={petDelete} onHide={cancelDelete}>
                    <Modal.Header>
                        <Modal.Title className={'fs-5'}>Are you sure you want to remove this pet?</Modal.Title>
                        <CloseButton onClick={cancelDelete}/>
                    </Modal.Header>
                    <Modal.Body>
                        You won't be able to undo this!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'secondary'} onClick={cancelDelete}>Cancel</Button>
                        <Button variant={'primary'} onClick={() => {
                            fetch(`http://localhost:8000/petlistings/pets/${petDelete}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                                }
                            })
                                .then(() => {
                                    getPets()
                                    setPetDelete(0)
                                })
                        }}>Confirm</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showPetApp} onHide={closePetApp}>
                    <Modal.Header>
                        <Modal.Title>Applicants for {showPetAppName}</Modal.Title>
                        <CloseButton onClick={closePetApp}/>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="applicants-card-holder">
                            {showPetAppId in applications ? (
                                applications[showPetAppId].map((pet, i) => (
                                    <Button href={`/application/${pet.id}`} variant={'link'} className={'applicants-card'} key={i}>
                                        <h3 className="applicant-name">{pet.adopterName}</h3>
                                        <p className="applicant-message">
											{pet.extraInfo}
                                        </p>
                                    </Button>
                                ))
                            ) : (
                                <p>No current applications!</p>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={closePetApp} variant={'primary'}>Done</Button>
                    </Modal.Footer>
                </Modal>


                <div
                    className="modal fade"
                    id="applicants-page"
                    aria-labelledby="edit-pet-label"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="edit-pet-label">
                                    Applicants for Ben
                                </h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                <div className="applicants-card-holder">
                                    <a
                                        className="btn btn-link applicants-card"
                                        href="petapplicationShelterView.html"
                                    >
                                        <h3 className="applicant-name">John Doe</h3>
                                        <p className="applicant-message">
                                            Thank you for your prompt response. I am eager to welcome a new
                                            member to our family!
                                        </p>
                                    </a>
                                    <a
                                        className="btn btn-link applicants-card"
                                        href="petapplicationShelterView.html"
                                    >
                                        <h3 className="applicant-name">John Doe</h3>
                                        <p className="applicant-message">
                                            Thank you for your prompt response. I am eager to welcome a new
                                            member to our family!
                                        </p>
                                    </a>
                                    <a
                                        className="btn btn-link applicants-card"
                                        href="petapplicationShelterView.html"
                                    >
                                        <h3 className="applicant-name">John Doe</h3>
                                        <p className="applicant-message">
                                            Thank you for your prompt response. I am eager to welcome a new
                                            member to our family!
                                        </p>
                                    </a>
                                    <a
                                        className="btn btn-link applicants-card"
                                        href="petapplicationShelterView.html"
                                    >
                                        <h3 className="applicant-name">John Doe</h3>
                                        <p className="applicant-message">
                                            Thank you for your prompt response. I am eager to welcome a new
                                            member to our family!
                                        </p>
                                    </a>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-dismiss="modal"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>}
		<Footer/>
    </>
}
