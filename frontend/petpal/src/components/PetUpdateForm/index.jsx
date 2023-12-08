import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './petcreation.module.css';
import { ajax_or_login } from "../../ajax";
import {faCircleInfo, faPaw, faImage, faStar, faBrain, faClipboard, faNotesMedical,faListCheck} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../../contexts/UserContext';

function PetStatusUpdateForm() {
    const [formData, setFormData] = useState({
        name: '', // Include all fields
        gender: '',
        age: '',
        species: '',
        otherType: '',
        breed: '',
        color: '',
        size: '',
        image: '',
        // petDesc: '',
        // behaviorDetails: '',
        // medicalHistory: '',
        // specialNeeds: '',
        status: '',
    });

    //const [status, setStatus] = useState('');
    const [files, setFiles] = useState([]);

    const { id } = useParams(); // Get the pet ID from the URL
    const navigate = useNavigate();
    const userType = localStorage.getItem('user_type');
    useEffect(() => {
        if (userType === "seeker") {
            navigate('/404error');
        }
    }, [navigate, userType]); // Dependencies array

    useEffect(() => {
        // Fetch the pet data using the ID when the component mounts
        ajax_or_login(`/petlistings/pets/${id}`, { method: 'GET' }) // Update the API endpoint and method accordingly
            .then((response) => {
            if (!response.ok) {
                navigate('/404error'); //pet doesn't exist or user doesn't have access to pet
                //navigate('/'); //redirect to 404
                //throw new Error('Network response was not ok');
            }
            return response.json();
            })
            .then((data) => {
            // Update the form data with the fetched pet data
                if(data.species && !['Dog', 'Cat', 'Rabbit', 'Other'].includes(data.species)){
                    //formData.append('otherType','');
                    setFormData({
                        ...data,
                        otherType: data.species, // Assuming otherType is a string field
                        species: 'Other',
                    });
                }else{
                    setFormData({...data, otherType:''});
                }
            })
            .catch((error) => {
            console.error('Error:', error);
            // Handle error
        });
    }, [id]);

    const handleFileChange = (e) => {
        setFiles(e.target.files); // Update the file state
    };

    function handleChange(e) {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
    }

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);


        // var currSize = formData.get('size');
        // if (currSize === 'Small'){
        //     formData.set('size', 1);
        // }else if (currSize === 'Medium'){
        //     formData.set('size', 2);
        // }else if (currSize === 'Large'){
        //     formData.set('size', 3);
        // }else{
        //     formData.set('size', 0);
        // }

        if (formData.get('species') === 'Other'){
            formData.set('species',formData.get('otherType'));
        }

        Array.from(files).forEach((file, index) => {
            //formData.append(`image${index}`, file); //swap back to this one for multiple images
            formData.append(`image`, file);
        });

        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        const settings = {
            method: 'PATCH',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
            body: formData, // Send the entire formData object
        };

        ajax_or_login(`/petlistings/pets/${id}`, settings, navigate)
            .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
            })
            .then((data) => {
                console.log('Success:', data);
                navigate(`/pet/${id}`);
            // Handle success (e.g., showing a success message or redirecting)
            })
            .catch((error) => {
                console.error('Error:', error);
            // Handle network errors or other exceptions
            });
    }

    function handleDelete() {
        // Show a confirmation dialog to confirm the delete action
        const confirmDelete = window.confirm("Are you sure you want to delete this pet?");

        if (confirmDelete) {
        // Send a DELETE request to the server
        const settings = {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            },
        };

        ajax_or_login(`/petlistings/pets/${id}`, settings, navigate)
            .then((response) => {
            if (response.ok) {
                // Pet deleted successfully, you can handle this as needed
                console.log('Pet deleted successfully');
                // Navigate to some page after successful deletion
                navigate('/shelters/manage');
            } else {
                // Handle errors or display an error message to the user
                console.error('Error deleting pet:', response.status);
            }
            })
            .catch((error) => {
            console.error('Error:', error);
            // Handle network errors or other exceptions
            });
        }
    }
  

  return (
    <div className={styles.pageColour}>
      <div className={`container justify-content-center ${styles.container} mt-5 mb-5`}>
        <h2 className="text-center">
        <FontAwesomeIcon icon={faPaw} /> Update Pet Status <FontAwesomeIcon icon={faPaw} />
        </h2>
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
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                <option value="Rabbit">Rabbit</option>
                                <option value="Other">Other</option>
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
                            // required
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
                            // required
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
                <h4 className="headerColour mt-4 px-4"><FontAwesomeIcon icon={faImage} /> Update Pet Picture</h4>
                <img src={formData.image} className={`px-4 mb-2 ${styles.cardImgTop}`} />
                <div className="form-group px-4">
                    <input 
                        className="form-control" 
                        type="file" 
                        id="formFileMultiple" 
                        multiple
                        onChange={handleFileChange} 
                        //required
                        // React does not handle file inputs through state, so no value or onChange here
                    />
                </div>
          {/* Include all other fields similarly (make them readonly) */}
            <h4 className="headerColour mt-4 px-4">
            <FontAwesomeIcon icon={faListCheck} /> Pet Status
            </h4>
            <div className="col-md-4 px-4">
            <div className={`form-floating ${styles.formFloating}`}>
                <select
                className="form-select"
                id="status" // Update the ID to "status"
                name="status" // Update the name to "status"
                value={formData.status}
                onChange={handleChange}
                required
                >
                <option value="available">Available</option>
                <option value="adopted">Adopted</option>
                <option value="pending">Pending</option> {/* Changed "Pending" to lowercase */}
                <option value="withdrawn">Withdrawn</option> {/* Changed "Withdrawn" to lowercase */}
                </select>
                <label htmlFor="status">Pet Status</label>
            </div>
            </div>

          {/* Submit Button */}
          <div className="row mt-4 px-4">
            <div className="col-md-8">
                {/* Update Button */}
                <button type="submit" className={`btn btn-primary buttonBorderColour ${styles.btn} ${styles.btn_primary} ${styles.buttonBorderColour}`}>
                Update
                </button>
            </div>
            <div className="col-md-4 text-end">
                {/* Delete Button */}
                <button
                type="button"
                className="btn btn-danger deleteButtonBorderColour deleteButton"
                onClick={handleDelete}>
                Delete
                </button>
            </div>
            </div>
        </form>
      </div>
    </div>
  );
}

export default PetStatusUpdateForm;
