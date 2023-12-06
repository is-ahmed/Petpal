import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './petapplication.css';
import { ajax_or_login } from "../../ajax";

function PetRegistrationForm () {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        postalCode: '',
        phoneNum: '',
        extraInfo: '',
        status: 'available', // Add 'status' field with a default value
    });

    // function mapDataToModelNames(formData) {
    //     return {
    //         name: formData.name,
    //     };
    // }

    const navigate = useNavigate(); 
    const { id } = useParams();

    //info for petcard
    const [petInfo, setPetInfo] = useState({
        name: '',
        breed: '',
        age: '',
        gender: '',
        size:'',
        location: '',
    });

    useEffect(() => {
        // Make a GET request to fetch the pet's information using ajax_or_login
        const settings = {
            method: 'GET',
        };
    
        ajax_or_login(`/petlistings/pets/${id}`, settings)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPetInfo(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [id]); // Trigger the effect when the id changes

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    

    function handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        

        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    
        const settings = {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json',
            //     // Include other headers as needed
            // },
            //body: JSON.stringify(formData)
            //body: formData,
        };
    
        ajax_or_login(`/petlistings/pets/${id}/applications/`, settings, navigate)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                //navigate('/success-route'); // Replace with your actual success route
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle network errors or other exceptions
            });
    }

    return (
        <div className="pageColour">
          <div className="container mt-5 mb-5 px-5 py-5">
            <h2 className="text-center themeText">Adopt me!</h2>
            <div className="d-flex justify-content-center mt-0">
              <div className="card">
                <img
                  src="./images/buddy.jpg"
                  className="card-img-top"
                  alt="Pet"
                />
                <div className="card-body text-center">
                    <h5 className="card-title themeText">{petInfo.name}</h5>
                    <p className="card-text">Breed: {petInfo.breed}</p>
                    <p className="card-text">{petInfo.age} years | {petInfo.gender} | {petInfo.size}</p>
                    {/* <p className="card-text">Location: {petInfo.location}</p> */}
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <h4 className="mt-4 mb-3 themeText">Applicant Information</h4>
              <div className="col-md-12 mb-3">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="name"
                    onChange={handleChange}
                    value={formData.name}
                  />
                  <label htmlFor="name">Name</label>
                </div>
              </div>
              <div className="col-md-12 mb-3">
                <div className="form-floating">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="email"
                    onChange={handleChange}
                    value={formData.email}
                  />
                  <label htmlFor="email">Email</label>
                </div>
              </div>
              <div className="col-md-12 mb-3">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="postalCode"
                    name="postalCode"
                    placeholder="postalCode"
                    onChange={handleChange}
                    value={formData.postalCode}
                  />
                  <label htmlFor="postalCode">Postal Code</label>
                </div>
              </div>
              <div className="col-md-12 mb-3">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNum"
                    name="phoneNum"
                    placeholder="Phone number (Optional)"
                    onChange={handleChange}
                    value={formData.phoneNum}
                  />
                  <label htmlFor="phoneNum">Phone number (Optional)</label>
                </div>
              </div>
              <div className="form-group">
                <div className="form-floating">
                  <textarea
                    className="form-control textAreaSize smallTextArea"
                    id="extraInfo"
                    rows="4"
                    name="extraInfo"
                    placeholder="Anything else you'd like to add? (Optional)"
                    onChange={handleChange}
                    value={formData.extraInfo}
                  ></textarea>
                  <label className="labelWrap" htmlFor="extraInfo">
                    Anything else you'd like to add? (Optional)
                  </label>
                </div>
              </div>
              <div className="col-12 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary buttonBorderColour"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
    );
};

export default PetRegistrationForm;