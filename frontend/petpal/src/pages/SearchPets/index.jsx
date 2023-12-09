import LandingHeader from "../../components/LandingHeader";
import Footer from "../../components/Footer";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import SearchFilters from "../../components/SearchFilters";
import PetSearchResults from "../../components/PetSearchResults";
import { SearchContext } from "../../contexts/SearchContext";
import Navigation from "../../components/Navigation";



const Pets = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [petResults, setPetResults] = useState();
	const [getResults, setResultsFinished] = useState(0);
    const [width, setWidth] = useState(window.innerWidth);

	const query = useMemo(() => ({
		page : parseInt(searchParams.get("page") ?? 1),
		page_size: 6,
		ordering: searchParams.get("ordering") ?? 'Name',
		shelter: parseInt(searchParams.get('shelter') ?? -1),
		species: searchParams.get('species') ?? '',
		age: parseInt(searchParams.get('age') ?? 1),
		status: searchParams.get('status') ?? 'available',
		daysOnPetPal: parseInt(searchParams.get('daysOnPetpal') ?? 0),
		gender: searchParams.get('gender') ?? '',
		breed: searchParams.get('breed') ?? ''
	}), [searchParams]);

    // https://stackoverflow.com/questions/39435395/reactjs-how-to-determine-if-the-application-is-being-viewed-on-mobile-or-deskto
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);




	useEffect(() => {
		async function fetchPets() {
			const { page, page_size, ordering, shelter, species, age, status, daysOnPetPal, gender, breed } = query;
			const response = await fetch(`http://localhost:8000/petlistings/pets?p=${page}&page_size=6&status=all&ordering=${ordering.toLowerCase()}&shelter=${shelter}&species=${species.toLowerCase()}&status=${status}&gender=${gender}&breed=${breed}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`
				}
			});
			const pets = await response.json()
			return pets;
		}
		fetchPets().then(json => {
			setPetResults(json['results'])
			setResultsFinished(1);
		})
		.catch(err => console.log(err))
	}, [query]) // dependent on query

    const isMobile = width <= 768;
	return (
		<>
		<header>
			<Navigation type='seeker' username={localStorage.getItem('user_name')}/>
		</header>
		<main className="d-flex" style={{paddingTop: '65px'}}>
		<SearchContext.Provider value={{query, searchParams, setSearchParams}}>	
			<SearchFilters modal={false}/>
		{getResults ? <PetSearchResults results={petResults} isMobile={isMobile}/> : ""}	
		</SearchContext.Provider>
		</main>	
		<Footer/>
		</>
	)
}

export default Pets;
