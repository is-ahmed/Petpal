import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './petcreation.module.css';
import { ajax_or_login } from "../../ajax";
import {faCircleInfo, faPaw, faImage, faStar, faBrain, faClipboard, faNotesMedical} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PetRegistrationForm () {
    const navigate = useNavigate(); 
    var userType = localStorage.getItem('user_type');
    //userType = "seeker";

    useEffect(() => {
        if (userType === "seeker") {
            navigate('/');
        }
    }, [navigate, userType]); // Dependencies array
    
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        age: '',
        species: '',
        otherType: '',
        breed: '',
        color: '',
        size: '',
        petDesc: '',
        behaviorDetails: '',
        medicalHistory: '',
        specialNeeds: '',
        // Include other form fields as needed
    });

    const [files, setFiles] = useState([]);


    

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleFileChange = (e) => {
        setFiles(e.target.files); // Update the file state
    };

    function handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        //const transformedData = mapDataToModelNames(formData);days_on_petpal
        //set default values that form doesn't have
        formData.append('status', 'available');
        formData.append('days_on_petpal', 0);
        // var currSize = formData.get('size');
        Array.from(files).forEach((file, index) => {
            //formData.append(`image${index}`, file); //swap back to this one for multiple images
            formData.append(`image`, file);
        });
        

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
    
        ajax_or_login('/petlistings/pets', settings, navigate)
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
        <div className={styles.pageColour}>
        <div className={`container justify-content-center ${styles.container} mt-5 mb-5`}>
            <h2 className="text-center"><FontAwesomeIcon icon={faPaw} /> Register a New Pet <FontAwesomeIcon icon={faPaw} /></h2>
            <form onSubmit={handleSubmit}>
            <h4 className="mt-4 mb-3 px-4"><FontAwesomeIcon icon={faCircleInfo} /> General Information</h4>
                <div className="row g-5 mb-3 px-4">
                    {/* Pet Name */}
                    <div className="col-md-6">
                        <div className={`form-floating ${styles.formFloating}`}>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="name" 
                                name="name" 
                                placeholder="Pet name" 
                                aria-label="Pet name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="name">Pet Name</label>
                        </div>
                    </div>

                    {/* Pet Gender */}
                    <div className="col-md-4">
                        <div className={`form-floating ${styles.formFloating}`}>
                            <select 
                                className="form-select" 
                                id="gender" 
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <label htmlFor="gender">Pet Gender</label>
                        </div>
                    </div>

                    {/* Pet Age */}
                    <div className="col-md-2">
                        <div className={`form-floating ${styles.formFloating}`}>
                            <input 
                                type="number" 
                                className="form-control" 
                                id="age" 
                                name="age" 
                                placeholder="Pet Age" 
                                min="0"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="age">Pet Age</label>
                        </div>
                    </div>
                </div>
                <div className="row g-5 mb-3 px-4">
                    {/* Pet Type and Other Type */}
                    <div className="col-md">
                        <div className={`form-floating ${styles.formFloating}`}>
                            <select 
                                className="form-select" 
                                id="species" 
                                name="species"
                                value={formData.species}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Choose your pet type</option>
                                <option value="dog">Dog</option>
                                <option value="cat">Cat</option>
                                <option value="rabbit">Rabbit</option>
                                <option value="other">Other</option>
                            </select>
                            <label htmlFor="species">Pet Species</label>
                        </div>
                    </div>

                    <div className="col-md">
                        <div className={`form-floating ${styles.formFloating}`}>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="otherType" 
                                name="otherType" 
                                placeholder="Fill if Pet Species is not listed"
                                value={formData.otherType}
                                onChange={handleChange}
                            />
                            <label htmlFor="otherType">Fill if Pet Species is not listed</label>
                        </div>
                    </div>
                </div>
                <div className="row g-5 mb-3 px-4">
                    {/* Pet Breed, Colour, and Size */}
                    <div className="col-md">
                        <div className={`form-floating ${styles.formFloating}`}>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="breed" 
                                name="breed" 
                                placeholder="Pet breed"
                                value={formData.breed}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="breed">Pet Breed</label>
                        </div>
                    </div>

                    <div className="col-md">
                        <div className={`form-floating ${styles.formFloating}`}>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="color" 
                                name="color" 
                                placeholder="Pet Colour"
                                value={formData.color}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="color">Pet Colour</label>
                        </div>
                    </div>

                    <div className="col-md">
                        <div className={`form-floating ${styles.formFloating}`}>
                            <input 
                                type="number" 
                                className="form-control" 
                                id="size" 
                                name="size" 
                                placeholder="Pet Weight (in pounds)" 
                                min="0" 
                                step="0.1" 
                                value={formData.size} 
                                onChange={handleChange} 
                                required
                            />
                            <label htmlFor="size">Pet Weight (lbs)</label>
                        </div>
                    </div>
                </div>


                {/* Pet Description */}
                <h4 className="headerColour mt-4 px-4"><FontAwesomeIcon icon={faClipboard} /> Pet Description</h4>
                <div className="form-group px-4">
                    <div className={`form-floating ${styles.formFloating}`}>
                        <textarea 
                            className={`form-control ${styles.textAreaSize}`}
                            id="petDesc" 
                            rows="4" 
                            name="petDesc" 
                            placeholder="Tell us about your pet!"
                            value={formData.petDesc}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <label htmlFor="petDesc">Tell us about your pet!</label>
                    </div>
                </div>

                {/* Behavior */}
                <h4 className="headerColour mt-4 px-4"><FontAwesomeIcon icon={faBrain} /> Behavior</h4>
                <div className="form-group px-4">
                    <div className={`form-floating ${styles.formFloating}`}>
                        <textarea 
                            className={`form-control ${styles.textAreaSize} ${styles.smallTextArea}`}
                            id="behaviorDetails" 
                            rows="4" 
                            name="behaviorDetails" 
                            placeholder="Any habits or behaviours we should know about?"
                            value={formData.behaviorDetails}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <label className={styles.labelWrap} htmlFor="behaviorDetails">Any habits or behaviours we should know about?</label>
                    </div>
                </div>

                {/* Medical History */}
                <h4 className="headerColour mt-4 px-4"><FontAwesomeIcon icon={faNotesMedical} /> Medical History</h4>
                <div className="form-group px-4">
                    <div className={`form-floating ${styles.formFloating}`}>
                        <textarea 
                            className={`form-control ${styles.textAreaSize} ${styles.smallTextArea}`}
                            id="medicalHistory" 
                            rows="4" 
                            name="medicalHistory" 
                            placeholder="Vaccination History, Spray/Neutered, Chip Status, etc."
                            value={formData.medicalHistory}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <label className={styles.labelWrap} htmlFor="medicalHistory">Vaccination History, Spray/Neutered, Chip Status, etc.</label>
                    </div>
                </div>

                {/* Special Needs & Requirements */}
                <h4 className="headerColour mt-4 px-4"><FontAwesomeIcon icon={faStar} /> Special Needs & Requirements</h4>
                <div className="form-group px-4">
                    <div className={`form-floating ${styles.formFloating}`}>
                        <textarea 
                            className={`form-control ${styles.textAreaSize}`}
                            id="specialNeeds" 
                            rows="4" 
                            name="specialNeeds" 
                            placeholder="Please fill out if applicable"
                            value={formData.specialNeeds}
                            onChange={handleChange}
                        ></textarea>
                        <label htmlFor="specialNeeds">Please fill out if applicable</label>
                    </div>
                </div>

                {/* Pet Picture Upload */}
                <h4 className="headerColour mt-4 px-4"><FontAwesomeIcon icon={faImage} /> Upload a picture for your pet</h4>
                <div className="form-group px-4">
                    <input 
                        className="form-control" 
                        type="file" 
                        id="formFileMultiple" 
                        multiple 
                        required
                        onChange={handleFileChange}
                    />
                </div>

                {/* Submit Button */}
                <div className="col-12 mt-4 px-4">
                    <button type="submit" className={`btn btn-primary buttonBorderColour ${styles.btn} ${styles.btn_primary} ${styles.buttonBorderColour}`}>Save</button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default PetRegistrationForm;