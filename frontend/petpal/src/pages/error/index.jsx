import React from 'react';

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

  return (
    <>
    <div style={style}>
      404: Page not found
    </div>
    </>
    );
}

export default NotFoundPage;