import React from 'react';
//import Navbar from './Navbar';
import PetApplicationUpdateForm from '../../components/PetApplicationUpdateForm';
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
function PetCreate(){
    var userType = localStorage.getItem('user_type');

    return (
        <>
            <header><Navigation type='seeker' username='username'/></header>
            <PetApplicationUpdateForm />
            <Footer />
        </>
    );
};

export default PetCreate;
