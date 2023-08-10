import { useParams } from "react-router-dom";

const Artist = () => {
    let { artistID } = useParams();
    return (
        <p>Melisma Artist {artistID}</p>
    );
};

export default Artist;