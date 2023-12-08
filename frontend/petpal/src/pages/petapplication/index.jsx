import React from 'react';
import PetApplicationForm from '../../components/PetApplicationForm';
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

function PetCreate(){
    //var userType = localStorage.getItem('user_type');
    var userName = localStorage.getItem('user_name'); 
    return (
        <>
            <header><Navigation type='seeker' username={userName}/></header>
            <PetApplicationForm />
            <Footer />
        </>
    );
};

export default PetCreate;