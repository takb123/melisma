import { useParams } from "react-router-dom";

const Artist = () => {
    let { artistID } = useParams();
    return (
        <p>Melisma Album {artistID}</p>
    );
};

export default Artist;