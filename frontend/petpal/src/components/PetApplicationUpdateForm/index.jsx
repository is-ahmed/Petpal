import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './petapplication.module.css';
import { ajax_or_login } from "../../ajax";
import {Button, CloseButton, Form, Modal} from 'react-bootstrap';
import { UserContext } from '../../contexts/UserContext';

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
    const [initialStatus, setInitialStatus] = useState(formData.status);
    var userType = localStorage.getItem('user_type');
    //userType = "shelter";

    const [report, setReport] = useState({
      description: '',
      subject: '',
      status: '',
    });

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
    });

    const[comments, setComments] = useState([{
      author: '',
      text: '',
      date_created: '',
    }]);
    //const [comments, setComments] = useState([]);
    const [message, setMessage] = useState('');
    const [applicantID, setApplicantID] = useState('');
    var currentUser = localStorage.getItem('user_name');
    // if(userType == 'shelter'){
    //   currentUser = ''
    // }
    

    //const [firstUser, setFirstUser] = useState('');

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
              const formDataResponse = await ajax_or_login(`/applications/${id}/`, settings, navigate);
              if (!formDataResponse.ok) {
                  navigate('/404error'); //redirect to 404 
                  //throw new Error('Network response was not ok');
              }
              console.log(formDataResponse);
              //console.log("getting here")
              const formDataData = await formDataResponse.json();
              const pet_id = formDataData.pet_listing;
              const user_id = formDataData.user;
              setApplicantID(formDataData.user);
              setInitialStatus(formDataData.status);
              //const orignal_status = formDataData.status;
              setFormData(formDataData);
              //console.log("getting here");
              // Fetch petInfo
              const petInfoResponse = await ajax_or_login(`/petlistings/pets/${pet_id}`, settings,navigate);
              if (!petInfoResponse.ok) {
                  console.log("has error");
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
              if (userType === "seeker"){
                const userInfoResponse = await ajax_or_login(`/seeker`, settings);
                if (!userInfoResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const userInfoData = await userInfoResponse.json();
                setUserInfo(userInfoData);
              } else{
                const userInfoResponse = await ajax_or_login(`/seeker/${user_id}`, settings);
                if (!userInfoResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const userInfoData = await userInfoResponse.json();
                setUserInfo(userInfoData);
              }


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

    async function getComments(){
      try{

        const settings = {
          method: 'GET',
        };
        const commentResponse = await ajax_or_login(`/comment/applications/${id}/comments/`, settings);
        if (!commentResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const commentData = await commentResponse.json();
        setComments(commentData.results);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }

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
              //setComments([...comments, { author: 'Current User', text: message }]);\
              getComments();
              //setComments([...comments, { text: message, author: "currentUser"}]);
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
                setFormData(data);
                //navigate('/'); 
                //navigate('/success-route'); // Replace with your actual success route
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle network errors or other exceptions
            });
    }

    const handleReportChange = (e) => {
      const { name, value } = e.target;
      setReport(prevReport => ({
          ...prevReport,
          [name]: value
      }));
  };

  function submitReport(e) {
      e.preventDefault();
      
      var reportData = new FormData(e.target);

      const settings = {
          method: 'POST',
          body: reportData,
      };
      reportData.set('status','pending');
      reportData.set('subject',`${applicantID}`);

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
            <div className={`${styles.headerContainer}`}>
              <h4 className={`mt-4 mb-3 ${styles.themeText}`}>Applicant Information</h4>
              {userType === 'shelter' &&<Button variant={'primary'} onClick={openReport}>Report Applicant</Button>}
            </div>
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
              
            <form onSubmit={handleSubmit}>
              {/* <h4 className={`mt-4 mb-3 ${styles.themeText}`}>Applicant Information</h4> */}
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
                  <label className="labelWrap" htmlFor="extraInfo">
                    Anything else you'd like to add? (Optional)
                  </label>
                </div>
              </div>
              <h4 className={`mt-4 mb-3 ${styles.themeText}`}>Application Status</h4>
              <div className="form-floating">
                  <select
                  className="form-select"
                  id="status" // Update the ID to "status"
                  name="status" // Update the name to "status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  >
                  {/* <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="denied">Denied</option>
                  <option value="withdrawn">Withdrawn</option>  */}
                    {(initialStatus === "pending") && <option value="pending">Pending</option>}
                    {(initialStatus === "accepted" || (initialStatus === "pending" && userType === "shelter")) && <option value="accepted">Accepted</option>}
                    {(initialStatus === "denied" || (initialStatus === "pending" && userType === "shelter")) && <option value="denied">Denied</option>}
                    {(initialStatus === "withdrawn" || ((initialStatus === "pending" || initialStatus === "accepted") && userType === "seeker")) && <option value="withdrawn">Withdrawn</option>}
                  </select>
                  <label htmlFor="status">Application Status</label>
              </div>
              <div className="col-12 mt-4">
                <button
                  type="submit"
                  className={`btn btn-primary buttonBorderColour ${styles.btn} ${styles.btn_primary} ${styles.buttonBorderColour}`}
                  disabled={initialStatus === "withdrawn" || initialStatus === "denied" || (initialStatus === "accepted" && userType === "shelter")}
                  >
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
                              {/* <div className={`p-3 ms-3 ${styles.userChat}`}> */}
                              <div className={comment.author === currentUser ? `${styles.shelterChat} p-3 ms-3` : `${styles.userChat} p-3 ms-3`}>
                                <div>
                                  <strong>{comment.author}</strong>
                                </div>
                                <div>
                                    <p className="small mb-0 ms-2">{comment.text}</p>
                                </div>
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
