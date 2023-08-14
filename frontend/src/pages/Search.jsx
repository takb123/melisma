/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AlbumCard from "../components/AlbumCard";
import { apiURL, defaultProfile, getUserColor } from "../helper";
import { useDispatch } from "react-redux";
import { loadOff, loadOn } from "../redux/loadingSlice";

const ArtistCard = ({ artist }) => {
    return (
        <Link to={`/artist/${artist.id}`}>
            <span className='card'>
                <img src={artist.image?.url || defaultProfile} width={200} height={200} className="circle" />
                <span className='card-entry'><b>{artist.name}</b></span>
            </span>
        </Link>
    );
};

const TrackCard = ({ track }) => {
    return (
        <Link to={`/album/${track.album.id}`}>
            <span className='card'>
                <img src={track.album.image.url} width={200} height={200} />
                <span className='card-entry'><b>{track.name}</b></span>
                <span className='card-entry sub-entry'>
                    from <span className="sub-name">{track.album.name}</span>
                </span>
            </span>
        </Link>
    );
};

const UserCard = ({ user }) => {
    return (
        <Link to={`/user/${user}`}>
            <span className='card'>
                <span className={`material-symbols-outlined pfp ${getUserColor(user)}`}>person</span>
                <span className='card-entry'><b>{user}</b></span>
            </span>
        </Link>
    );
};

const Search = () => {
    const { query } = useParams(); 
    const dispatch = useDispatch();

    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [users, setUsers] = useState([]);
    const [curr, setCurr] = useState(0);

    useEffect(() => {
        const fetchSearch = async () => {
            dispatch(loadOn());
            const response = await fetch(`${apiURL}/music/search?name=${query}`);
            const json = await response.json();

            if (response.ok) {
                setAlbums(json.albums);
                setArtists(json.artists);
                setTracks(json.tracks);
                setUsers(json.users);
            }
            else {
                toast.error(`Error: ${json.error}`);
            }
            dispatch(loadOff());
        }

        fetchSearch();
    }, [dispatch, query]);

    return (
        <div className="section">
            {["Albums", "Artists", "Tracks", "Users"].map((name, i) => (
                <span 
                    className={`category-button ${curr === i ? "active" : "inactive"}`} 
                    onClick={() => setCurr(i)}
                    key={i}
                >{name}
                </span>
            ))}
            <div className="content">
                {albums.length !== 0 && (() => {
                    switch (curr) {
                        case 0:
                            return albums.length ? albums.map(album => (<AlbumCard album={album} key={album.id} />))
                                                 : <div className="notfound">No Results</div>
                        case 1:
                            return artists.length ? artists.map(artist => (<ArtistCard artist={artist} key={artist.id} />))
                                                  : <div className="notfound">No Results</div>
                        case 2:
                            return tracks.length ? tracks.map(track => (<TrackCard track={track} key={track.id} />))
                                                 : <div className="notfound">No Results</div>
                        case 3:
                            return users.length ? users.map(user => (<UserCard user={user} key={user} />))
                                                : <div className="notfound">No Results</div>
                        default:
                            return <></>
                    }
                })()}
            </div>
        </div>
    );
};

export default Search;