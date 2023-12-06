import { createContext } from "react";


export const SearchContext = createContext({
	query: {},
	searchParams: {},
	setSearchParams: () => {},
});
