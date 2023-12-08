import React from 'react';
//import Navbar from './Navbar';
import PetUpdateForm from '../../components/PetUpdateForm';
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

function PetCreate(){
    return (
        <>
            <header><Navigation type='shelter' username='username'/></header>
            <PetUpdateForm />
            <Footer />
        </>
    );
};

export default PetCreate;