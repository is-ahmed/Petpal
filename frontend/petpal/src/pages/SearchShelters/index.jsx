import Footer from "../../components/Footer";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import SearchFilters from "../../components/SearchFilters";
import PetSearchResults from "../../components/PetSearchResults";
import { SearchContext } from "../../contexts/SearchContext";
import Navigation from "../../components/Navigation";

const Shelters = () => {
	return (
		<>
		<Navigation type='seeker' username={localStorage.getItem('user_name')}/>
		<div className="d-flex">
		</div>	
		<Footer/>
		</>
	)
}

export default Shelters;
