import {useEffect, useState} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.sm.css'
import './shelter-manager.sm.css'
import {Button, CloseButton, Dropdown, Modal, Navbar} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faEllipsis, faPlus} from '@fortawesome/free-solid-svg-icons'
import Navigation from "../Navigation";
import Footer from "../Footer"

export function Reports() {
    const [shelterDetails, setShelterDetails] = useState({})
    const [pets, setPets] = useState([])
    const [petDelete, setPetDelete] = useState(0) // will hold the id of the pet to delete
    const [error, setError] = useState('')
    const [applications, setApplications] = useState({})

    const [showPetAppName, setShowPetAppName] = useState('')
    const [showPetAppId, setShowPetAppId] = useState()
    const [showPetApp, setShowPetApp] = useState(false)

    const closePetApp = () => setShowPetApp(false)

    const [accountType ,setAccountType] = useState('')
    const [subjectID ,setSubjectID] = useState('')

    const cancelDelete = () => setPetDelete(0)


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
        if ('id' in shelterDetails) {
        }
    }, [shelterDetails]);

    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [reports, setReports] = useState([])
    const [description, setDescription] = useState('')
    const [id, setID] = useState(NaN)
    const [name, setName] = useState('')
    const [visible, setVisible] = useState(false)

    const show = () => {
        setVisible(true)
    }

    const hide = () => {
        setVisible(false)
    }

    const [k, setK] = useState(0)
    useEffect(() => {
        fetch(`http://localhost:8000/reports/?page=${page}&page_size=10`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                setReports(json.results)
                setTotalPage(Math.ceil(json.count / 10))
            })
    }, [page, k])

    const makeDate = (days_on_petpal) => {
        let date = new Date()
        date.setDate(date.getDate() - days_on_petpal)
        console.log(date, date.getDay())
        return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
    }
    return <>
		<header>
			<Navigation type={'admin'} username={localStorage.getItem('user_name')}/>
		</header>
        {(error) ? <p>{error}</p>:
            <main className="page-container">
                <h1 className="management-title">Admin Panel</h1>
                <hr/>
                <div className="pet-list-title">
                    <h3>Reports:</h3>
                    <div className="button-add-pet">
                        {reports.length !== 0 &&
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
                    {reports.map((report, i) => {
                        return <Button variant={'link'}
                                       style={{textDecoration: 'none'}}
                                       className="pet-list-card" key={`petlist${i}`}
                        disabled={report.status === 'accepted'}
                        onClick={() => {
                            setDescription(report.description)
                            setName(report.name)
                            setID(report.id)
                            setSubjectID(report.subject)
                            setAccountType(report.subject_type)

                            show()
                        }}>
                            <p className="pet-name">{report.name}</p>
                            <div className="applicant-message-holder">
                                <p className="applicant-message">
                                    {report.description}
                                </p>
                            </div>
                        </Button>
                    })}
                </div>

                <Modal show={visible} onHide={hide}>
                    <Modal.Header>
                        <Modal.Title className={'fs-5'}>Report for {name}</Modal.Title>
                        <CloseButton onClick={hide}/>
                    </Modal.Header>
                    <Modal.Body>
                        <h6>Report description</h6>
                        <p>{description}</p>
                        {accountType === 'shelter' &&
                        <Button style={{width: '100%'}}variant={'link'}
                        href={`/shelters/${subjectID}`}>View Account</Button>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'secondary'} onClick={hide}>Cancel</Button>
                        <Button variant={'danger'} onClick={() => {
                            fetch(`http://localhost:8000/reports/${id}/`,
                                {
                                    method: 'PATCH',
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
										'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        status: 'accepted'
                                    })
                                })
                            hide()
                            setK(k + 1)
                        }}>Ban</Button>
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
                                        <div className="applicant-message-holder">
                                            <p className="applicant-message">
                                                Blah blah blah
                                            </p>
                                        </div>

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
