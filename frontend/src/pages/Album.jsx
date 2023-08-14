import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TrackBar from "../components/TrackBar";
import { apiURL } from "../helper";
import { loadOff, loadOn } from "../redux/loadingSlice";

const Album = () => {
    const { albumID } = useParams();
    const auth = useSelector(state => state.auth.value);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [album, setAlbum] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        const fetchAlbum = async () => {
            dispatch(loadOn());
            const response = await fetch(`${apiURL}/music/album/${albumID}`, {
                headers: {
                    ...(auth && { "Authorization": `Bearer ${auth.token}` })
                }
            });
            const json = await response.json();
            if (response.ok) {
                setAlbum(json.album);
                setTracks(json.tracks);
                setArtists(json.artists);
            }
            else {
                if (json.error === "invalid id") {
                    navigate("/notfound");
                }
                else {
                    toast.error(`Error: ${json.error}`);
                }
            }
            dispatch(loadOff());
        };

        fetchAlbum();
        console.log("Fetch Album");
    }, [auth, albumID, dispatch, navigate]);

    return (
        <div className="section">
            {album &&
                <div className="head">
                    <img src={album.image.url} width={250}/>
                    <span className="title">
                        <div className="name">{album.name}</div>
                        <div className="artists">
                            {artists && artists
                                .map(artist => (<Link to={`/artist/${artist.id}`} key={artist.id}>{artist.name}</Link>))
                                .reduce((prev, curr) => [prev, ', ', curr])
                            }
                        </div>
                    </span>
                </div>
            }
            <div className="tracks">
                {tracks && tracks.map((track, i) => (
                    <TrackBar 
                        name={track.name} 
                        id={track.id} 
                        ratingScore={track.ratingScore} 
                        index={i+1} 
                        key={`${track.id}.${track.ratingScore}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Album;
