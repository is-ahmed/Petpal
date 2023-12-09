
import Footer from "../../components/Footer";
import './style.css';
import './UserUpdate.css';
import Navigation from "../../components/Navigation"; 
function UserUpdateSuccessPage() {

  let AccountType =  localStorage.getItem('user_type');
	return <>
  <Navigation type={AccountType.toLowerCase()} username={localStorage.getItem('user_name')}/>
    <main style={{marginTop: "100px"}}>
  <div className="container mt-5">
    <div className="alert alert-success" role="alert">
      <h4 className="alert-heading">Success!</h4>
      <p>Your account has been successfully updated.</p>
      <hr />
      <p className="mb-0">Thank you for keeping your information up to date.</p>
    </div>
    <div className="d-flex justify-content-center">
      <a href={AccountType === 'shelter' ? '/shelters/manage' : '/pets'} className="btn btn-primary">
        Go to Dashboard
      </a>
    </div>
  </div>
</main>
<Footer/>
</>
    // footer and header will be added 
		
	
}

export default UserUpdateSuccessPage;
