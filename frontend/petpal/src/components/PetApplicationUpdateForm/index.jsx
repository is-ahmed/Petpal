import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './petapplication.module.css';
import { ajax_or_login } from "../../ajax";

function PetApplicationUpdateForm () {
    const [formData, setFormData] = useState({
        adopterName: '',
        //email: '',
        postalCode: '',
        phoneNumber: '',
        extraInfo: '',
        status: '', // Add 'status' field with a default value
        pet_listing: '',
        user: '',
        shelter: '',
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
        image: '',
    });

    const[userInfo, setUserInfo] = useState({
      username: '',
      email: '',
    })

    // const[comments, setComments] = useState({
    //   //author: '',
    //   text: '',
    // })
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState('');

    // useEffect(() => {
    //     // Make a GET request to fetch the pet's information using ajax_or_login
    //     const settings = {
    //         method: 'GET',
    //     };

    //     ajax_or_login(`/applications/${id}/`, settings)
    //       .then(response => {
    //           if (!response.ok) {
    //               throw new Error('Network response was not ok');
    //           }
    //           return response.json();
    //       })
    //       .then(data => {
    //           const fieldToSave = data.pet_listing;
    //           setFormData(data);
    //       })
    //       .catch(error => {
    //           console.error('Error:', error);
    //     });

    //     var pet_id = formData.pet_listing;
    //     console.log(pet_id);
    //     ajax_or_login(`/petlistings/pets/${pet_id}`, settings)
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             for (const key in data) {
    //                 if (Object.hasOwnProperty.call(data, key)) {
    //                     console.log(`${key}: ${data[key]}`);
    //                 }
    //             }
    //             setPetInfo(data);
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //     });

    //     ajax_or_login(`/seeker`, settings)
    //       .then(response => {
    //           if (!response.ok) {
    //               throw new Error('Network response was not ok');
    //           }
    //           return response.json();
    //       })
    //       .then(data => {
    //           setUserInfo(data);
    //       })
    //       .catch(error => {
    //           console.error('Error:', error);
    //     });
    // }, [id]); // Trigger the effect when the id changes

    useEffect(() => {
      const fetchData = async () => {
          try {
              const settings = {
                  method: 'GET',
              };
  
              // Fetch formData
              const formDataResponse = await ajax_or_login(`/applications/${id}/`, settings);
              if (!formDataResponse.ok) {
                  throw new Error('Network response was not ok');
              }
              const formDataData = await formDataResponse.json();
              const pet_id = formDataData.pet_listing;
              setFormData(formDataData);
  
              // Fetch petInfo
              const petInfoResponse = await ajax_or_login(`/petlistings/pets/${pet_id}`, settings);
              if (!petInfoResponse.ok) {
                  throw new Error('Network response was not ok');
              }
              const petInfoData = await petInfoResponse.json();
              // for (const key in petInfoData) {
              //     if (Object.hasOwnProperty.call(petInfoData, key)) {
              //         console.log(`${key}: ${petInfoData[key]}`);
              //     }
              // }
              setPetInfo(petInfoData);
  
              // Fetch userInfo
              const userInfoResponse = await ajax_or_login(`/seeker`, settings);
              if (!userInfoResponse.ok) {
                  throw new Error('Network response was not ok');
              }
              const userInfoData = await userInfoResponse.json();
              setUserInfo(userInfoData);

              //fetch comments
              const commentResponse = await ajax_or_login(`/comment/applications/${id}/comments/`, settings);
              if (!commentResponse.ok) {
                  throw new Error('Network response was not ok');
              }
              const commentData = await commentResponse.json();
              setComments(commentData.results);
              //console.log("getting here")
          } catch (error) {
              console.error('Error:', error);
          }
      };
  
      fetchData();
    }, [id]); // Trigger the effect when the id changes

    function handleChat(e){
      setMessage(e.target.value); // Update the message state when the text area changes
    };

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    function handleSubmitMessage(e){
      e.preventDefault();
      const messageData = new FormData();
      messageData.append('text', message); // Append the message to formData
      console.log(message)
  
      const settings = {
          method: 'POST',
          body: messageData,
      };
  
      ajax_or_login(`/comment/commentcreation/application/${id}/`, settings, navigate)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              console.log('Success:', data);
              //setComments([...comments, { author: 'Current User', text: message }]);
              setComments([...comments, { text: message }]);
              setMessage(''); // Clear the text area after successful submission
              //navigate('/success-route'); // Replace with your actual success route
          })
          .catch(error => {
              console.error('Error:', error);
              // Handle network errors or other exceptions
          });
    };
    

    function handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        

        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        
        // const { status } = formData;

        // const newStatus = {
        //   status,
        // };

        const settings = {
            method: 'PATCH',
            // headers: {
            //     'Content-Type': 'application/json',
            //     // Include other headers as needed
            // },
            //body: JSON.stringify(formData)
            body: formData,
        };
    
        ajax_or_login(`/applications/${id}/`, settings, navigate)
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
          <div className={`container ${styles.container} mt-5 mb-5 px-5 py-5`}>
            <h2 className={`text-center ${styles.themeText}`}>View Application</h2>
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
                    readOnly
                  ></textarea>
                  <label className="labelWrap" htmlFor="extraInfo">
                    Anything else you'd like to add? (Optional)
                  </label>
                </div>
              </div>
              <h4 className="headerColour mt-2">
              <i className="fa-solid fa-list-check"></i> Application Status
              </h4>
              <div className="form-floating">
                  <select
                  className="form-select"
                  id="status" // Update the ID to "status"
                  name="status" // Update the name to "status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  >
                  <option value="pending">Pending</option>
                  <option value="accepted">Available</option>
                  <option value="denied">Adopted</option>
                  <option value="withdrawn">Withdrawn</option> 
                  </select>
                  <label htmlFor="status">Application Status</label>
              </div>
              <div className="col-12 mt-4">
                <button
                  type="submit"
                  className={`btn btn-primary buttonBorderColour ${styles.btn} ${styles.btn_primary} ${styles.buttonBorderColour}`}>
                  Update
                </button>
              </div>
            </form>
            <div className="card mt-3 col-12 full-width-chat">
              <div className={`card-header ${styles.chatColour} ${styles.whiteText}`}>
                  Chat
              </div>
              <div className="card-body">
                  <ul className="list-group">
                      {comments.map((comment, index) => (
                          <div key={index} className="d-flex flex-row justify-content-start mb-4">
                              {/* <img className="rounded-circle chatImage" src={comment.author === 'Author1' ? "./images/Author1Avatar.jpg" : "./images/Author2Avatar.jpg"} alt={comment.author} /> */}
                              <div className={`p-3 ms-3 ${styles.userChat}`}>
                                  {/* <strong>{comment.author}</strong>: <p className="small mb-0">{comment.text}</p> */}
                                  <strong>Author</strong>: <p className="small mb-0">{comment.text}</p>
                              </div>
                          </div>
                      ))}

                    <textarea
                        className="form-control"
                        id="textAreaChat"
                        rows="2"
                        value={message}
                        onChange={handleChat}
                    ></textarea>
                    <label className="form-label" htmlFor="textAreaChat">Enter your message</label>
                    <button className={`btn btn-primary buttonBorderColour ${styles.btn} ${styles.btn_primary} ${styles.buttonBorderColour}`} onClick={handleSubmitMessage}>Send Message</button> {/* Added button */}
                  </ul>
              </div>
            </div>
          </div>
        </div>
    );
};

export default PetApplicationUpdateForm;