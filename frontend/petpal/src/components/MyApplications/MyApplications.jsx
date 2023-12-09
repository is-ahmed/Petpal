import {useEffect, useState} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.sm.css'
import './shelter-manager.sm.css'
import {Button, CloseButton, Dropdown, Form, Modal, Navbar} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faEllipsis, faPlus} from '@fortawesome/free-solid-svg-icons'
import Navigation from "../Navigation";
import Footer from "../Footer";

export function MyApplications() {
    const [pets, setPets] = useState([])
    const [petDelete, setPetDelete] = useState(0) // will hold the id of the pet to delete
    const [error, setError] = useState('')
    const [applications, setApplications] = useState({})

    const [showPetAppName, setShowPetAppName] = useState('')
    const [showPetAppId, setShowPetAppId] = useState()
    const [showPetApp, setShowPetApp] = useState(false)

    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)

    const closePetApp = () => setShowPetApp(false)

    const cancelDelete = () => setPetDelete(0)

    const [applicationInfo, setApplicationInfo] = useState([])
    const [status, setStatus] = useState('')
    const [sorting, setSorting] = useState('last_update_time')

    const type = localStorage.getItem('user_type')

    const getPets = () => {
        setApplicationInfo([])
        fetch(`http://localhost:8000/applications/?page=${page}&page_size=10` +
            `&ordering=${sorting}` +
            `&status=${status}`,
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
                setApplicationInfo(json.results)
                setTotalPage(Math.max(Math.ceil(json.count / 10), 1))
            })
            .catch(error => {
                setError(error.toString())
            })
    }

    useEffect(() => {
        getPets()
    }, [page, sorting, status]);

    const makeDate = (days_on_petpal) => {
        let date = new Date(days_on_petpal.slice(0, 10))
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }
    return <>
        <header>
            <Navigation type={localStorage.getItem('user_type')} username={localStorage.getItem('user_name')}/>
        </header>
        {(error) ? <p>{error}</p> :
            <main className="page-container">
                <h1 className="management-title">View Applications</h1>
                <div className="sorts"
                style = {{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Form>
                        <Form.Select onChange={(e) => {setSorting(e.target.value)}}>
                            <option value="">Sort Options</option>
                            <option value="last_update_time">Last Update</option>
                            <option value="creation_time">Creation Time</option>
                        </Form.Select>
                        <Form.Select onChange={e => {setStatus(e.target.value)}}>
                            <option value="">Filter by</option>
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="withdrawn">Withdrawn</option>
                            <option value="denied">Denied</option>
                        </Form.Select>
                    </Form>
                </div>
                <hr/>
                <div className="pet-list-title">
                    <h3>Your Applications:</h3>
                    <div className="button-add-pet">
                        {applications.length !== 0 &&
                            <div className="page-button-container"
                                 style={{marginRight: 'auto'}}>
                                <Button variant={'link'}
                                        className={'page-button'} disabled={page <= 1}
                                        onClick={() => {
                                            setPage(page - 1)
                                        }}>
                                    <FontAwesomeIcon icon={faChevronLeft}/>
                                </Button>

                                <Button variant={'link'}
                                        className={'page-button'} disabled={page >= totalPage}
                                        onClick={() => {
                                            setPage(page + 1)
                                        }}>
                                    <FontAwesomeIcon icon={faChevronRight}/>
                                </Button>

                                <span>Page: {page}/{totalPage}</span>
                            </div>}

                    </div>

                </div>
                <div className="pet-list-holder">
                    {console.log(applicationInfo)}
                    {applicationInfo.map((pet, i) => {
                        return <div className="pet-list-card" key={`petlist${i}`}>
                            {console.log(pet)}
                            <img src={pet.image}/>
                            {console.log(pet)}
                            <p className="pet-name">{pet.pet_name}</p>
                            <p className="date-added">(Applied: {
                                makeDate(pet.creation_time)
                            })</p>
                            <Dropdown className={'pet-dropdown'}>
                                <Dropdown.Toggle className={'pet-dropdown-toggle'}
                                                 variant={'link'}>
                                    <FontAwesomeIcon icon={faEllipsis}/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href={`/application/${pet.id}`}>View
                                        Application</Dropdown.Item>
                                    <Dropdown.Item as={'button'}
                                                   onClick={() => {
                                                       fetch(`http://localhost:8000/applications/${pet.id}/`, {
                                                           method: 'PATCH',
                                                           headers: {
                                                               Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                                                               'Content-Type': 'application/json'
                                                           },
                                                           body: JSON.stringify({status: type==='seeker' ? 'withdraw': 'denied'})
                                                       })
                                                           .then(console.log(JSON.stringify({status: type==='seeker' ? 'withdraw': 'denied'})))
                                                   }}>{type === 'seeker' ? 'Withdraw' : 'Decline'}</Dropdown.Item>
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
                                    <Button href={`/application/${pet.id}`} variant={'link'}
                                            className={'applicants-card'} key={i}>
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
