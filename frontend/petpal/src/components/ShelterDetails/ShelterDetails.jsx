import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style.css'
import './shelter.sd.css'
import {Button, CloseButton, Form, Modal} from 'react-bootstrap';
import {userContext} from "../../contexts/UserContext";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faChevronLeft,
    faPlus,
    faLocationArrow,
    faPhone,
    faEnvelope, faStar, faStarHalf
} from '@fortawesome/free-solid-svg-icons'

export function ShelterDetails(props) {
    const {shelter_id} = useParams()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [username, setUsername] = useState('')
    const [avatar, setAvatar] = useState('')
    const [error, setError] = useState(' ')

    const [reviews, setReviews] = useState([])
    const [reviewsPage, setReviewsPage] = useState(1)
    const [totalReviewsPages, setTotalReviewsPages] = useState(1)

    const [validatedReviews, setValidatedReviews] = useState(false)
    const [reviewsGood, setReviewsGood] = useState(false)

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
            })
            .catch(error => {
                console.log('reviews error')
            })
    }, [reviewsPage]);

    return <>
        {!error &&
            <main className="page-container">
                <div className="shelter-title">
                    <h1 className="shelter-name">Test Shelter</h1>
                    <p className="shelter-location">
                        <FontAwesomeIcon icon={faLocationArrow}/> 1234 St George St, M61 123
                    </p>
                    <div className="star-rating">
                        <Button
                            variant={'link'}
                            style={{marginRight: '5px'}}
                            onClick={openNotifications}>
                            View Review
                        </Button>
                        {makeStars(3)}
                    </div>
                </div>
                <div className="contact-information">
                    <p>
                        <FontAwesomeIcon icon={faPhone}/> 123-456-7890
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faEnvelope}/> mail@shelterforpets.com
                    </p>
                </div>
                <div className="shelter-body">
                    <div className="mission">
                        <h2>Our Mission</h2>
                        <p>
                            Our mission is to protect, advocate for and facilitate responsible
                            animal care through adoption, education, sterilization and community
                            outreach in efforts to end companion animal homelessness.{" "}
                        </p>
                    </div>
                </div>

                <Button variant={'secondary'}>Report</Button>
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
                        <div className="star-rating">
                            <span className="fa fa-star bright"/>
                            <span className="fa fa-star bright"/>
                            <span className="fa fa-star bright"/>
                            <span className="fa fa-star"/>
                            <span className="fa fa-star"/>
                        </div>
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
                <div
                    className="modal"
                    id="write-review"
                    aria-hidden="true"
                    aria-labelledby="modal-title-write"
                    tabIndex={-1}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="modal-title-write">
                                    Write Review
                                </h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                {/*                    https://codepen.io/hesguru/pen/BaybqXv*/}
                                <div className="star-rating">
                                    <span className="fa fa-star bright"/>
                                    <span className="fa fa-star bright"/>
                                    <span className="fa fa-star bright"/>
                                    <span className="fa fa-star"/>
                                    <span className="fa fa-star"/>
                                </div>
                                <form
                                    action="https://postman-echo.com/post"
                                    encType="multipart/form-data"
                                    method="post"
                                >
                                    <div className="mb-3">
                                        <label htmlFor="review-text" className="col-form-label">
                                            Write your review:
                                        </label>
                                        <textarea
                                            style={{height: "10rem"}}
                                            className="form-control"
                                            id="review-text"
                                            defaultValue={""}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-link back-button-footer"
                                    data-bs-target="#reviews_modal"
                                    data-bs-toggle="modal"
                                >
                                    Back
                                </button>
                                <button
                                    className="btn btn-primary"
                                    data-bs-target="#reviews_modal"
                                    data-bs-toggle="modal"
                                >
                                    Submit review
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="shelter-pets-holder">
                    <h2 className="shelter-pets-title">Pets from Test Shelter</h2>
                    {/*        <div class="shelter-pets">*/}
                    {/*            <div class="pets-card">*/}
                    {/*                <div class="card">*/}
                    {/*                    <img class="card-img-top" src="./images/dog.jpg" alt="Card image cap">*/}
                    {/*                    <div class="card-body">*/}
                    {/*                        <h5 class="card-title pet-name">Ben</h5>*/}
                    {/*                        <a href="#" class="btn btn-primary">Check out Ben!</a>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            <div class="pets-card">*/}
                    {/*                <div class="card">*/}
                    {/*                    <img class="card-img-top" src="./images/dog.jpg" alt="Card image cap">*/}
                    {/*                    <div class="card-body">*/}
                    {/*                        <h5 class="card-title pet-name">Ben</h5>*/}
                    {/*                        <a href="#" class="btn btn-primary">Check out Ben!</a>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            <div class="pets-card">*/}
                    {/*                <div class="card">*/}
                    {/*                    <img class="card-img-top" src="./images/dog.jpg" alt="Card image cap">*/}
                    {/*                    <div class="card-body">*/}
                    {/*                        <h5 class="card-title pet-name">Ben</h5>*/}
                    {/*                        <a href="#" class="btn btn-primary">Check out Ben!</a>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            <div class="pets-card">*/}
                    {/*                <div class="card">*/}
                    {/*                    <img class="card-img-top" src="./images/dog.jpg" alt="Card image cap">*/}
                    {/*                    <div class="card-body">*/}
                    {/*                        <h5 class="card-title pet-name">Ben</h5>*/}
                    {/*                        <a href="#" class="btn btn-primary">Check out Ben!</a>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    <div className="container container-fluid">
                        <div className="row">
                            <a
                                className=" col shadow rounded  petinfo p-3"
                                href="./Petpage-shelter.html"
                            >
                                <img
                                    src="./images/dog.jpg"
                                    className="img-fluid rounded"
                                    alt="dog photo"
                                />
                                <h3 className="fw-bold mt-3">Sample</h3>
                                <p className="mb-0">Young - 2 miles away</p>
                            </a>
                            <a
                                className=" col shadow rounded  petinfo p-3"
                                href="./Petpage-shelter.html"
                            >
                                <img
                                    src="./images/dog.jpg"
                                    className="img-fluid rounded"
                                    alt="dog photo"
                                />
                                <h3 className="fw-bold mt-3">Sample</h3>
                                <p className="mb-0">Young - 2 miles away</p>
                            </a>
                            <a
                                className=" col shadow rounded  petinfo p-3"
                                href="./Petpage-shelter.html"
                            >
                                <img
                                    src="./images/dog.jpg"
                                    className="img-fluid rounded"
                                    alt="dog photo"
                                />
                                <h3 className="fw-bold mt-3">Sample</h3>
                                <p className="mb-0">Young - 2 miles away</p>
                            </a>
                        </div>
                        <div className="row">
                            <a
                                className=" col shadow rounded  petinfo p-3"
                                href="./Petpage-shelter.html"
                            >
                                <img
                                    src="./images/dog.jpg"
                                    className="img-fluid rounded"
                                    alt="dog photo"
                                />
                                <h3 className="fw-bold mt-3">Sample</h3>
                                <p className="mb-0">Young - 2 miles away</p>
                            </a>
                            <a
                                className=" col shadow rounded  petinfo p-3"
                                href="./Petpage-shelter.html"
                            >
                                <img
                                    src="./images/dog.jpg"
                                    className="img-fluid rounded"
                                    alt="dog photo"
                                />
                                <h3 className="fw-bold mt-3">Sample</h3>
                                <p className="mb-0">Young - 2 miles away</p>
                            </a>
                            <a
                                className=" col shadow rounded  petinfo p-3"
                                href="./Petpage-shelter.html"
                            >
                                <img
                                    src="./images/dog.jpg"
                                    className="img-fluid rounded"
                                    alt="dog photo"
                                />
                                <h3 className="fw-bold mt-3">Sample</h3>
                                <p className="mb-0">Young - 2 miles away</p>
                            </a>
                        </div>
                    </div>
                </div>
            </main>}
    </>
}
