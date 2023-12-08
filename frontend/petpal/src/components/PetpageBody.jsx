import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './css/style.css';
import './css/petpage.css';
import { ajax_or_login } from "../ajax";


function getStatusClass(status) {
    switch (status) {
      case "Available":
        return "bg-success";
      case "Pending":
        return "bg-warning";
      case "Adopted":
        return "bg-danger";
      case "Withdrawn":
        return "bg-secondary"; // Set a class for "Withdrawn"
      default:
        return "bg-secondary"; // Set a default class for unknown statuses
    }
  }

function Pet(){
    const [showAdoptedAlert, setShowAdoptedAlert] = useState(false);
    const [showPendingAlert, setShowPendingAlert] = useState(false);
    const [showWithdrawnAlert, setShowWithdrawnAlert] = useState(false);

    
    // Retrieving pet data 
    //const navigate = useNavigate();
    //const { petId } = useParams(); 
    //const [ error, setError ] = useState("");
    //const [ pet, setPet ] = useState(null);

    // useEffect(() => {
    //    ajax_or_login(`/petlistings/pets/${petId}`, {}, navigate)
    //    .then(response => { 
    //        if (response.ok) {
    //            return response.json();
    //        } else {
    //            throw Error(response.statusText);
    //        }
    //    })
    //    .then(json => setPet(json))
    //    .catch(error => setError(error.toString()));
    //}, [navigate, petId]);


    let AccountType =  localStorage.getItem('user_type');
    let pet_sample = {
        "name": "Buddy",
        "age": 3,
        "breed": "Labrador",
        "species": "Dog",
        "gender": "Male",
        "image": "http://example.com/uploads/pet_image.jpg",
        "status": "Withdrawn",
        "size": 20,
        "days_on_petpal": 45,
        "color": "Black",
        "shelter": 1,
        "description": "A friendly and energetic Labrador, great with kids and other pets.",
        "medicalhistory": "Up to date on vaccinations, no known health issues.",
        "needs": "Regular exercise and a diet suited for large breeds."
    }
    const handleAdoptClick = (event) => {
      if (pet_sample.status === "Adopted") {
          setShowAdoptedAlert(true);
         
          event.preventDefault(); 
      } else if (pet_sample.status === "Pending") {
          setShowPendingAlert(true);
        
          event.preventDefault(); 
      } else if (pet_sample.status === "Withdrawn") {
        setShowWithdrawnAlert(true);
        event.preventDefault();
    }
  }
    return <>
    <main>
  <div className="container">
    <div
      id="exampleCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="../.././dog0.jpg"
            className="d-block w-100"
            alt="First slide"
          />
        </div>
        <div className="carousel-item">
          <img
            src="../.././dog1.jpg"
            className="d-block w-100"
            alt="Second slide"
          />
        </div>
        <div className="carousel-item">
          <img
            src="../.././dog2.jpeg"
            className="d-block w-100"
            alt="Third slide"
          />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#exampleCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#exampleCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  </div>
  <div className="container mt-5">
    <div className="row">
      <div className="col-lg-4">
        <div className="info-box p-4 border rounded bg-light">
          <h3 className="mb-3 font-weight-bold">{pet_sample.name}</h3>
          <ul className="list-unstyled">
            <li>
                <i className="fas fa-dna mr-2"></i>
                <strong>Species:</strong> {pet_sample.species}
            </li>
            <li>
              <i className="fas fa-paw mr-2" />
              <strong>Breed:</strong> {pet_sample.breed}
            </li>
            <li>
              <i className="fas fa-birthday-cake mr-2" />
              <strong>Age:</strong> {pet_sample.age}
            </li>
            <li>
              <i className="fas fa-venus-mars mr-2" />
              <strong>Gender:</strong> {pet_sample.gender}
            </li>
            <li>
              <i className="fas fa-weight mr-2" />
              <strong>Size:</strong> {pet_sample.size}
            </li>
            <li>
              <i className="fas fa-palette mr-2" />
              <strong>Color:</strong> {pet_sample.color}
            </li>
            <li>
              <i className="fas fa-info-circle mr-2" />
              <strong>Status:</strong>{" "}
              <span className={`badge ${getStatusClass(pet_sample.status)}`}>{pet_sample.status}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="info-box p-4 border rounded bg-light">
          <h3 className="mb-3 font-weight-bold">Description</h3>
          <p>
            {pet_sample.description}
          </p>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="info-box p-4 border rounded bg-light">
          <div>
            <h3 className="mb-3 font-weight-bold">Medical History</h3>
            <p>
              {pet_sample.medicalhistory}
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-weight-bold">Special Needs</h3>
            <p>
                {pet_sample.needs}
            </p>
          </div>
        </div>
      </div>
      {/* Third Column */}
    </div>
  </div>
  {AccountType === 'seeker'  && (
  <>
    <div className="col-lg-12 d-flex justify-content-center align-items-center">
        <div>
            <a href="./petadoption.html" className="btn btn-primary btn-lg"  id="Adoptme" role="button" onClick={handleAdoptClick}>
                Adopt Me
            </a>
        </div>
        {showAdoptedAlert && (
        <div className="alert alert-danger mt-3" role="alert">
          Sorry, this pet is currently unavailable for adoption.
        </div>
        )}
        {showPendingAlert && (
        <div className="alert alert-warning mt-3" role="alert">
        This pet is currently pending adoption.
        </div>
        )}
        {showWithdrawnAlert && (
        <div className="alert alert-secondary mt-3" role="alert">
          This pet's application has been withdrawn.
          </div>
          )}
    </div>
    <div className="col-lg-12 d-flex justify-content-center align-items-center">
        <div>
            <a href={`/shelters/${pet_sample.shelter}`} className="btn btn-primary btn-lg"  id="Adoptme" role="button"
                            style={{ marginTop: 0 }}>
                            Shelter Page
            </a>
        </div>
    </div>
    </>
    )}
    {AccountType === 'shelter' && (
    <div class="col-lg-12 d-flex justify-content-center align-items-center">
        <div>
            <a href="./petedit.html" class="btn btn-primary btn-lg" id="Adoptme" role="button">Edit Pet</a>
        </div>
    </div>
)}

  
</main>

</>;

}

export default Pet;