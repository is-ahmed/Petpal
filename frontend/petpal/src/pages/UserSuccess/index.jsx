
import Footer from "../../components/Footer";
import './style.css';
import './UserUpdate.css';
function UserUpdateSuccessPage() {
	return <>
    <main>
  <div className="container mt-5">
    <div className="alert alert-success" role="alert">
      <h4 className="alert-heading">Success!</h4>
      <p>Your account has been successfully updated.</p>
      <hr />
      <p className="mb-0">Thank you for keeping your information up to date.</p>
    </div>
    <div className="d-flex justify-content-center">
      <a href="/pets" className="btn btn-primary">
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