import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './petapplication.module.css';
import { ajax_or_login } from "../../ajax";
import { UserContext } from '../../contexts/UserContext';

function PetApplicationForm () {
    //const { usernameContext, userType, userid } = useContext(UserContext);
    const navigate = useNavigate(); 
    const [errorMessages, setErrorMessages] = useState({});
    const [formData, setFormData] = useState({
        adopterName: '',
        //email: '',
        postalCode: '',
        phoneNumber: '',
        extraInfo: '',
        status: 'available', // Add 'status' field with a default value
    });
    

    // function mapDataToModelNames(formData) {
    //     return {
    //         name: formData.name,
    //     };
    // }

    
    const { id } = useParams();
    var userType = localStorage.getItem('user_type');
    //userType = "seeker";
    //console.log(userType);

    useEffect(() => {
        if (userType === "shelter") {
            navigate('/404error'); //redirect to 404
        }
    }, [navigate, userType]); // Dependencies array

    //info for petcard
    const [petInfo, setPetInfo] = useState({
        name: '',
        breed: '',
        age: '',
        gender: '',
        size:'',
        location: '',
        image: '',
    });

    const[userInfo, setUserInfo] = useState({
      username: '',
      email: '',
    })

    useEffect(() => {
        // Make a GET request to fetch the pet's information using ajax_or_login
        const settings = {
            method: 'GET',
        };
    
        ajax_or_login(`/petlistings/pets/${id}`, settings, navigate)
            .then(response => {
                if (!response.ok) {
                  //navigate('/'); //redirect to 404
                  navigate('/404error'); //when pet doesn't exist
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

        ajax_or_login(`/seeker`, settings, navigate)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              setUserInfo(data);
          })
          .catch(error => {
              console.error('Error:', error);
        });
    }, [id]); // Trigger the effect when the id changes

    function handleChange(e) {
      setErrorMessages(prevErrors => ({ ...prevErrors, alreadySubmitted: '' }));
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      });
    };
    

    function handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const validationErrors = validateForm(formData);
        console.log(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
          setErrorMessages(validationErrors);
          return; // Prevent form submission
        }
        setErrorMessages({});

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
            body: formData,
        };
    
        ajax_or_login(`/petlistings/pets/${id}/applications/`, settings, navigate)
            .then(response => {
                if (!response.ok) {
                    //setErrorMessage("You have already have an application with this pet!");
                    setErrorMessages(prevErrors => ({ ...prevErrors, alreadySubmitted: 'You already have an application with this pet!' }));
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                navigate(`/applications`);
                //navigate('/success-route'); // Replace with your actual success route
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle network errors or other exceptions
            });
    }

    function validateForm(formData) {
      let errors = {};

      const adopterName = formData.get('adopterName');
      const postalCode = formData.get('postalCode');
      const phoneNumber = formData.get('phoneNumber');
      console.log(phoneNumber);
    
      // Validate Name - Required
      if (!adopterName.trim()) {
        errors.adopterName = 'Name is required';
      }

      // Validate postalCode
      if (postalCode.trim() && !/^[A-Za-z]\d[A-Za-z]\s\d[A-Za-z]\d$/.test(postalCode.trim().toUpperCase())) {
        errors.postalCode = 'Invalid postal code format';
      }
      // Validate phoneNumber
      if (phoneNumber.trim() && !/^\(\d{3}\) \d{3}-\d{4}$/.test(phoneNumber.trim())) {
        errors.phoneNumber = 'Phone number must be in the format of (xxx) xxx-xxxx';
      }


    
      // Other fields (like extraInfo) are optional and have no specific format, so no validation needed
    
      return errors;
    }

    return (
        <div className= {styles.pageColour}>
          <div className= {`container ${styles.container} mt-5 mb-5 px-5 py-5`}>
            <h2 className={`text-center ${styles.themeText}`}>Adopt me!</h2>
            <div className="d-flex justify-content-center mt-0">
              <div className={`card ${styles.card}`}>
                <img
                  src={petInfo.image}
                  className={`card-img-top ${styles.cardImgTop}`}
                  alt="Pet"
                />
                <div className="card-body text-center">
                    <h5 className={`card-title ${styles.themeText}`}>{petInfo.name}</h5>
                    <p className="card-text">Breed: {petInfo.breed}</p>
                    <p className="card-text">{petInfo.age} years | {petInfo.gender} | {petInfo.size} lbs</p>
                    {/* <p className="card-text">Location: {petInfo.location}</p> */}
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <h4 className={`mt-4 mb-3 ${styles.themeText}`}>Applicant Information</h4>
              <div className="col-md-12 mb-3">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="adopterName"
                    placeholder="name"
                    onChange={handleChange}
                    value={formData.adopterName}
                    //required
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
                    value={userInfo.email}
                    readOnly
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
                  <label htmlFor="postalCode">Postal Code (Optional)</label>
                </div>
              </div>
              <div className="col-md-12 mb-3">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNum"
                    name="phoneNumber"
                    placeholder="Phone number (Optional)"
                    onChange={handleChange}
                    value={formData.phoneNumber}
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
                  <label className={styles.labelWrap}  htmlFor="extraInfo">
                    Anything else you'd like to add? (Optional)
                  </label>
                </div>
              </div>
              <div className="col-12 mt-4">
                {Object.keys(errorMessages).map(key => (
                  errorMessages[key] && (
                    <div key={key} className="alert alert-danger" role="alert">
                      {errorMessages[key]}
                    </div>
                  )
                ))}
                <button
                  type="submit"
                  className={`btn btn-primary buttonBorderColour ${styles.btn} ${styles.btn_primary} ${styles.buttonBorderColour}`}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
    );
};

export default PetApplicationForm;
