import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './css/style.css';
import './css/petpage.css';
import { ajax_or_login } from "../ajax";
import Navigation  from "./Navigation";


function getStatusClass(status) {
    switch (status) {
      case "available":
        return "bg-success";
      case "pending":
        return "bg-warning";
      case "adopted":
        return "bg-danger";
      case "withdrawn":
        return "bg-secondary"; // Set a class for "Withdrawn"
      default:
        return "bg-secondary"; // Set a default class for unknown statuses
    }
  }

function Pet(){
    const [showAdoptedAlert, setShowAdoptedAlert] = useState(false);
    const [showPendingAlert, setShowPendingAlert] = useState(false);
    const [showWithdrawnAlert, setShowWithdrawnAlert] = useState(false);

  
   

    const navigate = useNavigate();
    const { petId } = useParams();
    const [error, setError] = useState('');
    const [pet, setPet] = useState({
        name: '',
        age: null,
        breed: '',
        species: '',
        gender: '',
        image: null,
        status: '',
        size: null,
        days_on_petpal: null,
        color: '',
        shelter: null,
        description: '',
        behavior: '',
        medicalhistory: '',
        needs: ''
    });

    useEffect(() => {
        ajax_or_login(`/petlistings/pets/${petId}`, { method: 'GET' }, navigate)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch pet data');
                }
            })
            .then(data => {
                setPet({
                    ...pet, 
                    ...data  
                });
            })
            .catch(error => setError(error.toString()));
    }, [petId, navigate]);

 

    let AccountType =  localStorage.getItem('user_type');
   
    const handleAdoptClick = (event) => {
      if (pet.status === "adopted") {
          setShowAdoptedAlert(true);
         
          event.preventDefault(); 
      } else if (pet.status === "pending") {
          setShowPendingAlert(true);
        
          event.preventDefault(); 
      } else if (pet.status === "withdrawn") {
        setShowWithdrawnAlert(true);
        event.preventDefault();
    }
  }
    return <>
    <Navigation type={AccountType.toLowerCase()} username={localStorage.getItem('user_name')}/>
    <main style={{marginTop: '100px'}}>
  <div className="container">
    <div
      id="exampleCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src={pet.image}
            className="d-block w-100"
            alt="First slide"
          />
        </div>
        <div className="carousel-item">
          <img
            src="../.././dog3.jpg"
            className="d-block w-100"
            alt="Second slide"
          />
        </div>
        <div className="carousel-item">
          <img
            src="../.././dog4.jpg"
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
          <h3 className="mb-3 font-weight-bold">{pet.name}</h3>
          <ul className="list-unstyled">
            <li>
                <i className="fas fa-dna mr-2"></i>
                <strong>Species:</strong> {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
            </li>
            <li>
              <i className="fas fa-paw mr-2" />
              <strong>Breed:</strong> {pet.breed}
            </li>
            <li>
              <i className="fas fa-birthday-cake mr-2" />
              <strong>Age:</strong> {pet.age}
            </li>
            <li>
              <i className="fas fa-venus-mars mr-2" />
              <strong>Gender:</strong> {pet.gender}
            </li>
            <li>
              <i className="fas fa-weight mr-2" />
              <strong>Size:</strong> {pet.size}
            </li>
            <li>
              <i className="fas fa-palette mr-2" />
              <strong>Color:</strong> {pet.color.charAt(0).toUpperCase() + pet.color.slice(1)}
            </li>
            <li>
              <i className="fas fa-info-circle mr-2" />
              <strong>Status:</strong>{" "}
              <span className={`badge ${getStatusClass(pet.status)}`}>{pet.status}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="info-box p-4 border rounded bg-light">
          <h3 className="mb-3 font-weight-bold">Description</h3>
          <p>
            {pet.description}
          </p>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="info-box p-4 border rounded bg-light">
          <div>
            <h3 className="mb-3 font-weight-bold">Medical History</h3>
            <p>
              {pet.medicalhistory}
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-weight-bold">Special Needs</h3>
            <p>
                {pet.needs}
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
            <a href={`/pet/${petId}/application`} className="btn btn-primary btn-lg"  id="Adoptme" role="button" onClick={handleAdoptClick}>
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
            <a href={`/shelters/${pet.shelter}`} className="btn btn-primary btn-lg"  id="Adoptme" role="button"
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
            <a href={`/pet/${petId}/update`} class="btn btn-primary btn-lg" id="Adoptme" role="button">Edit Pet</a>
        </div>
    </div>
)}

  
</main>

</>;

}

export default Pet;
