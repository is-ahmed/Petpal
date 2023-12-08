import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import './css/style.css';
import './css/UserUpdate.css';

import { ajax_or_login } from "../ajax";



function UpdateUser(){
   
   
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
        avatar: null
       
    });

    useEffect(() => {          
        
        ajax_or_login('/seeker/', { method: 'GET' }, navigate)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch user data');
                }
            })
            .then(data => {
                setUserData({
                    ...userData,
                    username: data.username,
                    email: data.email,
                    avatar: data.avatar,
                  
                    // Do not set passwords or files
                });
            })
            .catch(error => setError(error.toString()));
    }, [navigate]);


    const validateUsername = (username) => /^[A-Za-z0-9_]{6,}$/.test(username);
    const validateEmail = (email) => /^[a-zA-Z0-9_%!+#$&'*\/=?^`{|}~.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/.test(email);
    const validatePassword = (password1) => {
        const digit = /\d/.test(password1);
        const lowercase = /[a-z]/.test(password1);
        const uppercase = /[A-Z]/.test(password1);
        const special = /[!@#$%^&*]/.test(password1);
        return digit && lowercase && uppercase && special && password1.length >= 8;
    };
    const passwordsMatch = (password1, password2) => password1 === password2;
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            ajax_or_login('/seeker/', { 
                method: 'DELETE'
            }, navigate)
            .then(response => {
                if (response.ok) {
                    navigate('/'); 
                } else {
                    throw new Error('Failed to delete account');
                }
            })
            .catch(error => setError(error.toString()));
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        
        
        if (!validateUsername(userData.username) ||
            !validateEmail(userData.email) ||
            !validatePassword(userData.password1) ||
            userData.avatar === null ||
            !passwordsMatch(userData.password1, userData.password2)) {
            setError("Please correct the errors before submitting.");
          
        }
        else {
            const formData = new FormData();
            formData.append('username', userData.username);
            formData.append('email', userData.email);
            formData.append('password1', userData.password1);
            formData.append('password2', userData.password2);
       
          
            formData.append('avatar', userData.avatar);
            
       
            setError('');
            ajax_or_login('/seeker/', {
                method: 'PUT',
                body: formData,
            }, navigate)
            .then(response => {
                if (response.ok) {
                    navigate('/success');
                } else {
                    throw new Error('Failed to update account');
                }
            })
            .catch(error => setError(error.toString()));
        }

    

       
    };


   
       
    return <>
    <main style={{marginTop: '100px'}}>
  <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="card">
          <div className="card-header">User Profile</div>
          <div className="card-body">
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={e => setUserData({ ...userData, username: e.target.value })}
                />
                
                {!validateUsername(userData.username) && <p className="notification">Username is invalid</p>}
            

              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value= {userData.email}
                  onChange={e => setUserData({ ...userData, email: e.target.value })}
                  
                />
                {!validateEmail(userData.email) && <p className="notification">Email is invalid</p>}
              
              </div>
              <div className="form-group">
                <label htmlFor="password">New Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password1"
                  name="password1"
                  onChange={e => setUserData({ ...userData, password1: e.target.value })}
                />
                {!validatePassword(userData.password1) && <p className="notification">Password is invalid</p>}

              </div>
              <div className="form-group">
                <label htmlFor="password2">Confirm New Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password2"
                  name="password2"
                  onChange={e => setUserData({ ...userData, password2: e.target.value })}
                />
                {!passwordsMatch(userData.password1, userData.password2) && <p className="notification">Passwords don't match</p>}
               
              </div>
              <div className="form-group">
                <label htmlFor="avatar">Profile Picture:</label>
                <input
                type="file"
                className="form-control"
                id="avatar"
                name="avatar"
               

                onChange={e => setUserData({... userData, avatar: e.target.files[0]})}/>
            </div>
            <div>

              <button type="submit" className="btn btn-primary mt-2" style={{ marginRight: "10px" }}>
                Update
              </button>
              <button type="button" className="btn btn-danger mt-2 ml-2" onClick={handleDelete}>
                Delete Account
            </button>
            </div>
              {error && <p className="notification">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>



</>;

}


export default UpdateUser;

