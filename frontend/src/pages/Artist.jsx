import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AlbumCard from "../components/AlbumCard";
import { apiURL, defaultProfile } from "../helper";
import { useDispatch } from "react-redux";
import { loadOff, loadOn } from "../redux/loadingSlice";

const Artist = () => {
    const { artistID } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const fetchArtist = async () => {
            dispatch(loadOn());
            const response = await fetch(`${apiURL}/music/artist/${artistID}`);
            const json = await response.json();
            if (response.ok) {
                setArtist(json.artist);
                setAlbums(json.albums);
            }
            else {
                if (json.error === 'invalid id') {
                    navigate('/notfound');
                }
                else {
                    toast.error(`Error: ${json.error}`);
                }
            }
            dispatch(loadOff());
        };

        fetchArtist();
    }, [artistID, dispatch, navigate]);

    return (
        <div className="section">
            {artist &&
                <div className="head">
                    <img className="circle" src={artist.image?.url || defaultProfile} width={250} height={250}/>
                    <span className="title">
                        <div className="name">{artist.name}</div>
                    </span>
                </div>
            }
            <div className="content">
                {albums && albums.map(album => (<AlbumCard album={album} key={album.id} />))}
            </div>
        </div>
    );
};

export default Artist;