import {useParams, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style.css'
import './shelter.sd.css'
import {Button, CloseButton, Form, Modal} from 'react-bootstrap';
import {userContext} from "../../contexts/UserContext";
import { ajax_or_login } from "../../ajax";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faChevronLeft,
    faPlus,
    faLocationArrow,
    faPhone,
    faEnvelope, faStar, faStarHalf
} from '@fortawesome/free-solid-svg-icons'
import PetCard from "../PetCard2";
import Pet from "../../pages/Pet";
import Footer from "../Footer";
import Navigation from "../Navigation";

export function ShelterDetails(props) {
    const {shelter_id} = useParams()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [username, setUsername] = useState('')
    const [avatar, setAvatar] = useState('')
    const [error, setError] = useState(' ')
    const [mission, setMission] = useState('')
    const [phone, setPhone] = useState('')

    const [reviews, setReviews] = useState([])
    const [reviewsPage, setReviewsPage] = useState(1)
    const [totalReviewsPages, setTotalReviewsPages] = useState(1)

    const [validatedReviews, setValidatedReviews] = useState(false)
    const [reviewsGood, setReviewsGood] = useState(false)

    const [report, setReport] = useState({
        description: '',
        subject: '',
        status: '',
    });

    // https://react-bootstrap.netlify.app/docs/forms/validation
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setReviewsGood(false)
        } else {
            console.log(JSON.stringify({text: reviewText, rating: reviewRating}))
            fetch(`http://localhost:8000/comment/commentcreation/shelter/${shelter_id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({text: reviewText, rating: reviewRating})
            }).then(res => setReviewsPage(1))
            setReviewsGood(true)
        }

        setValidatedReviews(true);
        return false
    };

    const handleReportChange = (e) => {
        const { name, value } = e.target;
        setReport(prevReport => ({
            ...prevReport,
            [name]: value
        }));
    };

    const navigate = useNavigate();
    function submitReport(e) {
        e.preventDefault();
        
        var reportData = new FormData(e.target);

        const settings = {
            method: 'POST',
            body: reportData,
        };
        reportData.set('status','pending');
        reportData.set('subject',`${shelter_id}`);

        for (let [key, value] of reportData.entries()) {
            console.log(`${key}:`, value);
        }
        
    
        ajax_or_login(`/reports/`, settings, navigate)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                if(data.id){
                    setSubmissionMessage('Your report has been submitted!');
                }else{
                    setSubmissionMessage('You\'ve already subbmited a report.');
                }
                
                //navigate(`/application/${data.id}`);
                //navigate('/success-route'); // Replace with your actual success route
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle network errors or other exceptions
        });
    }

    const [showReport, setShowReport] = useState(false)
    const closeReport = () => setShowReport(false)
    const openReport = () => setShowReport(true)

    const [submissionMessage, setSubmissionMessage] = useState('');

    const [reviewRating, setReviewsRating] = useState(0)
    const [reviewText, setReviewText] = useState('')

    const [showNotifications, setShowNotifications] = useState(false)
    const closeNotifications = () => setShowNotifications(false)
    const openNotifications = () => setShowNotifications(true)

    const [showWriteNotifications, setShowWriteNotifications] = useState(false)
    const showWrite = () => setShowWriteNotifications(true)
    const closeWrite = () => setShowWriteNotifications(false)

    const makeStars = (value) => {
        value = Math.round(value)

        return <>
            {Array.from({length: value}, (_, index) => (
                <FontAwesomeIcon icon={faStar} className={'bright'} key={index}/>
            ))}
            {Array.from({length: 5 - value}, (_, index) => (
                <FontAwesomeIcon icon={faStar} key={index}/>
            ))}
        </>
    }

    const type = useState('user')

    useEffect(() => {
        fetch(`http://localhost:8000/shelter/${shelter_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error()
            })
            .then(json => {
                setEmail(json.email)
                setUsername(json.username)
                setName(json.name)
                setAddress(json.address)
                setAvatar(json.avatar)
                setPhone(json.phone_number)
                setMission(json.mission)

                setError('')
            })
            .catch(error => {
                console.log(error)
                setError(error)
            })
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8000/comment/shelters/${shelter_id}/comments/?page=${reviewsPage}&page_size=6`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error()
            })
            .then(json => {
                setReviews(json.results)
                setTotalReviewsPages(Math.ceil(json.count / 6))
                setRat(json.rating)
            })
            .catch(error => {
                console.log('reviews error')
            })
    }, [reviewsPage]);

    const [width, setWidth] = useState(window.innerWidth);

    // https://stackoverflow.com/questions/39435395/reactjs-how-to-determine-if-the-application-is-being-viewed-on-mobile-or-deskto
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;

    const [petsPage, setPetsPage] = useState(1)
    const [petsTotalPage, setPetsTotalPage] = useState(1)
    const [pets, setPets] = useState([])

    const [rat, setRat] = useState(0)

    useEffect(() => {
        fetch(`http://localhost:8000/petlistings/pets?shelter=${shelter_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then(res => res.json())
            .then(json => {
                setPets(json.results)
            })
    }, [petsPage]);

    return <>
        <Navigation type={type} username={localStorage.getItem('user_name')}/>
        {!error &&
            <main className="page-container">
                <div className="shelter-title">
                    <h1 className="shelter-name">{name}</h1>
                    <p className="shelter-location">
                        <FontAwesomeIcon icon={faLocationArrow}/> {address}
                    </p>
                    <div className="star-rating">
                        <Button
                            variant={'link'}
                            style={{marginRight: '5px'}}
                            onClick={openNotifications}>
                            View Review
                        </Button>
                        {makeStars(rat)}
                    </div>
                </div>
                <div className="contact-information">
                    <p>
                        <FontAwesomeIcon icon={faPhone}/> {phone}
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faEnvelope}/> {email}
                    </p>
                </div>
                <div className="shelter-body">
                    <div className="mission">
                        <h2>Our Mission</h2>
                        <p>
                            {mission}
                        </p>
                    </div>
                </div>

                <Button variant={'secondary'} onClick={openReport}>Report</Button>
                <Modal show={showReport} onHide={closeReport}>
                    <Modal.Header>
                        <Modal.Title>Report Shelter</Modal.Title>
                        <CloseButton onClick={closeReport}/>
                    </Modal.Header>
                    <form onSubmit={submitReport}>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label>Reason for Reporting:</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    name="description"
                                    rows={3} 
                                    value={report.description} 
                                    onChange={handleReportChange}
                                    required minLength={20}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Must write at least 20 characters.
                                </Form.Control.Feedback>
                            </Form.Group>
                            {submissionMessage && (
                                <div className="mt-3 text-success">{submissionMessage}</div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" type="submit">Submit Report</Button>
                        </Modal.Footer>
                    </form>
                </Modal>
                {/* https://www.w3schools.com/bootstrap5/bootstrap_modal.php */}
                <Modal show={showNotifications} onHide={closeNotifications}>
                    <Modal.Header>
                        <Modal.Title>Reviews</Modal.Title>
                        <CloseButton onClick={closeNotifications}/>
                    </Modal.Header>
                    <Modal.Body>
                        {reviews.map((review, i) => (
                            <div className="review" key={`review: ${i}`}>
                                <p className="review-username">{review.author}</p>
                                <div className="star-rating">
                                    {makeStars(review.rating)}
                                </div>
                                <p className="review-text">
                                    {review.text}
                                </p>
                            </div>
                        ))}
                        {reviews.length === 0 && <p>No reviews found!</p>}
                    </Modal.Body>
                    <Modal.Footer>
                        {reviews.length !== 0 &&
                        <div className="page-button-container"
                             style={{marginRight: 'auto'}}>
                            <Button variant={'link'}
                                    className={'page-button'} disabled={reviewsPage <= 1}
                            onClick={() => {setReviewsPage(reviewsPage - 1)}}>
                                <FontAwesomeIcon icon={faChevronLeft}/>
                            </Button>

                            <Button variant={'link'}
                                    className={'page-button'} disabled={reviewsPage >= totalReviewsPages}
                                onClick={() => {setReviewsPage(reviewsPage + 1)}}>
                                <FontAwesomeIcon icon={faChevronRight}/>
                            </Button>

                            <span>Page: {reviewsPage}/{totalReviewsPages}</span>
                        </div>}
                        {type !== 'shelter' &&
                            <Button
                                variant={'secondary'}
                                onClick={() => {
                                    closeNotifications()
                                    showWrite()
                                }}>
                                Write Review
                            </Button>}
                        <Button
                            variant={'primary'}
                            onClick={closeNotifications}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showWriteNotifications} onHide={closeWrite}>
                    <Modal.Header>
                        <Modal.Title>Write Review</Modal.Title>
                        <CloseButton onClick={closeWrite}/>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={validatedReviews} onSubmit={(e) => {handleSubmit(e); return false}} id={'formform'}>
                            <Form.Group className={'mb-3'} controlId={'form.ControlInput'}>
                                <Form.Select required onChange={(e) => setReviewsRating(e.target.value)} aria-label="Default select example"
                                name={'rating'}>
                                    <option value={""} >Rate this shelter</option>
                                    <option value="5">5</option>
                                    <option value="4">4</option>
                                    <option value="3">3</option>
                                    <option value="2">2</option>
                                    <option value="1">1</option>
                                </Form.Select>
                                <Form.Label>Write your review:</Form.Label>
                                <Form.Control onChange={(e) => setReviewText(e.target.value)} as={'textarea'} style={{height: '10rem'}}
                                required minLength={20}
                                name={'text'}></Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    Must write at least 10 characters.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant={'link'}
                            onClick={() => {
                                closeWrite()
                                setReviewsPage([])
                                openNotifications()
                            }}>
                            Back
                        </Button>
                        <Button
                            variant={'primary'}
                            type={'submit'}
                            form={'formform'}
                            onClick={() => {
                                if (reviewsGood) {
                                    closeWrite()
                                    openNotifications()
                                }
                            }}>
                            Write Review
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="shelter-pets-holder">
                    <hr/>
                    <h2 className="shelter-pets-title">Pets from Test Shelter</h2>
                    <div className="container container-fluid" style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: isMobile ? 'column' : 'row'
                    }}>
                        {pets.map((pet, i) => {
                            return <PetCard key={i} pet={pet} flagjeff={!isMobile}/>
                        })}
                    </div>
                </div>
            </main>}
        <Footer/>
    </>
}
