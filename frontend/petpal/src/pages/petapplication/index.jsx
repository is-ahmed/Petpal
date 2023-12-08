import React from 'react';
import PetApplicationForm from '../../components/PetApplicationForm';
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

function PetCreate(){
    return (
        <>
            <header><Navigation type='seeker' username='username'/></header>
            <PetApplicationForm />
            <Footer />
        </>
    );
};

export default PetCreate;