/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TrackBar from "../components/TrackBar";

const Album = () => {
    const { albumID } = useParams();
    const auth = useSelector(state => state.auth.value);

    const [album, setAlbum] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        const fetchAlbum = async () => {
            console.log(auth?.token);
            const response = await fetch(`http://localhost:4000/api/music/album/${albumID}`, {
                headers: {
                    "Authorization": `Bearer ${auth?.token}`
                }
            });
            const json = await response.json();
            if (response.ok) {
                setAlbum(json.album);
                setTracks(json.tracks);
                setArtists(json.artists);
            }
            else {
                toast.error(`Error: ${json.error}`);
            }
        };

        fetchAlbum();
    }, []);

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
                    <TrackBar name={track.name} id={track.id} ratingScore={track.ratingScore} index={i+1} key={track.id}/>
                ))}
            </div>
        </div>
    );
};

export default Album;
