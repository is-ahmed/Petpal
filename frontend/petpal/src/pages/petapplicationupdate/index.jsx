import React from 'react';
//import Navbar from './Navbar';
import PetApplicationUpdateForm from '../../components/PetApplicationUpdateForm';
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
function PetCreate(){
    var userType = localStorage.getItem('user_type'); //make seeker dynamic after local storage working
    var userName = localStorage.getItem('user_name'); 
    return (
        <>
            <header><Navigation type= {userType} username={userName}/></header>
            <PetApplicationUpdateForm />
            <Footer />
        </>
    );
};

export default PetCreate;