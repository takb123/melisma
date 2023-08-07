import { useParams } from "react-router-dom";

const Search = () => {
    const { query } = useParams();  
 
    return (
        <p>Melisma Search {query}</p>
    );
};

export default Search;