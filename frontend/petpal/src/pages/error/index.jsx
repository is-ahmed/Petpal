import React from 'react';
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

function NotFoundPage() {
  const style = {
    backgroundColor: '#77b8ba',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '40px',
    fontWeight: 'bold',
    textAlign: 'center'
  };
  
  var userType = localStorage.getItem('user_type');
  var userName = localStorage.getItem('user_name'); 

  return (
      <>
        <header><Navigation type= {userType} username={userName}/></header>
        <div style={style}>
          404: Page not found
        </div>
        <Footer />
      </>
    );
}

export default NotFoundPage;