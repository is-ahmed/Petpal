import React from 'react';
//import Navbar from './Navbar';
import PetRegistrationForm from '../../components/PetRegistrationForm';
//import Footer from './Footer';
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
function PetCreate(){
    //var userType = localStorage.getItem('user_type');
    var userName = localStorage.getItem('user_name'); 
    return (
        <>
            <header><Navigation type='shelter' username={userName}/></header>
            <PetRegistrationForm />
            <Footer />
        </>
    );
};

export default PetCreate;