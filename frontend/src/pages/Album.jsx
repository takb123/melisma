import { useParams } from "react-router-dom";

const Album = () => {
    let { albumID } = useParams();
    return (
        <p>Melisma Album {albumID}</p>
    );
};

export default Album;
