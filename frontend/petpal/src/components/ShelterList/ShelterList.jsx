import {useEffect, useState} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.sm.css'
import './shelter-manager.sm.css'
import {Button, CloseButton, Dropdown, Modal, Navbar} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faEllipsis, faPlus} from '@fortawesome/free-solid-svg-icons'
import Footer from "../Footer";
import Navigation from "../Navigation";

export function ShelterList() {
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
        fetch(`http://localhost:8000/petlistings/pets?shelter=${shelterDetails.id}&status=all`,
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

    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [shelters, setShelters] = useState([])
    useEffect(() => {
        fetch(`http://localhost:8000/shelters/?page=${page}&page_size=10`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then(res => res.json())
            .then(json => {
                setShelters(json.results)
                setTotalPage(Math.max(Math.ceil(json.count / 10), 1))
            })
    }, [page])

    const makeDate = (days_on_petpal) => {
        let date = new Date()
        date.setDate(date.getDate() - days_on_petpal)
        console.log(date, date.getDay())
        return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
    }

    const type = 'shelter'
    return <>
        <Navigation type={localStorage.getItem('user_type')} username={'username'}/>
        {(error) ? <p>{error}</p>:
            <main className="page-container">
                <h1 className="management-title">PetPal Shelters</h1>
                <hr/>
                <div className="pet-list-title">
                    <h3>Shelters:</h3>
                    <div className="button-add-pet">
                        {shelters.length !== 0 &&
                            <div className="page-button-container"
                                 style={{marginRight: 'auto'}}>
                                <Button variant={'link'}
                                        className={'page-button'} disabled={page <= 1}
                                        onClick={() => {setPage(page - 1)}}>
                                    <FontAwesomeIcon icon={faChevronLeft}/>
                                </Button>

                                <Button variant={'link'}
                                        className={'page-button'} disabled={page >= totalPage}
                                        onClick={() => {setPage(page + 1)}}>
                                    <FontAwesomeIcon icon={faChevronRight}/>
                                </Button>

                                <span>Page: {page}/{totalPage}</span>
                            </div>}

                    </div>
                </div>
                <div className="pet-list-holder">
                    {shelters.map((shelter, i) => {
                        return <Button variant={'link'}
                                       style={{textDecoration: 'none'}}
                                       href={`/shelters/${shelter.shelter_id}`}
                                       className="pet-list-card" key={`petlist${i}`}>
                            <img src={shelter.avatar}/>
                            <p className="pet-name">{shelter.name}</p>
                        </Button>
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
                                    <Button href={'temp'} variant={'link'} className={'applicants-card'} key={i}>
                                        <h3 className="applicant-name">Josh</h3>
                                        <p className="applicant-message">
                                            Blah blah blah
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
