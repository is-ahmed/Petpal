import React from 'react';
//import Navbar from './Navbar';
import PetRegistrationForm from '../../components/PetRegistrationForm';
//import Footer from './Footer';
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
function PetCreate(){
    return (
        <>
            <header><Navigation type='shelter' username='username'/></header>
            <PetRegistrationForm />
            <Footer />
        </>
    );
};

export default PetCreate;