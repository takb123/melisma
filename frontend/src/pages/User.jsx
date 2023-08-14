import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AlbumCard from "../components/AlbumCard";
import { apiURL, getUserColor } from "../helper";
import { loadOff, loadOn } from "../redux/loadingSlice";

const User = () => {
    const { username } = useParams();
    const auth = useSelector(state => state.auth.value);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [albums, setAlbums] = useState(null);
    const [following, setFollowing] = useState(0);

    useEffect(() => {
        const fetchUser = async () => {
            dispatch(loadOn());
            const response = await fetch(`${apiURL}/user/profile/${username}`, {
                headers: {
                    ...(auth && { "Authorization": `Bearer ${auth.token}` })
                }
            });
            const json = await response.json();
            if (response.ok) {
                setAlbums(json.albums);
                setFollowing(json.following);
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

        fetchUser();
    }, [username, auth, dispatch, navigate]);

    const handleFollow = async () => {
        const response = await fetch(`${apiURL}/user/${following ? "unfollow" : "follow"}/${username}`, {
            method: "POST",
            headers: {
                ...(auth && { "Authorization": `Bearer ${auth.token}` })
            }
        });
        const json = await response.json();
        if (response.ok) {
            if (json.success) {
                setFollowing(following ^ 1);
            }
            else {
                toast.error(`Error: ${following ? "Unfollow" : "Follow"} failed`);
            }
        }
        else {
            toast.error(`Error: ${json.error}`);
        }
    };

    return (
        <div className="section">
            {albums &&
                <div className="head">
                    <span className={`material-symbols-outlined pfp ${getUserColor(username)}`}>person</span>
                    <span className="title">
                        <div className="name">{username}</div>
                        {(auth && auth.username !== username) && (
                            <span className="follow-button" onClick={handleFollow}>{following ? "Unfollow" : "Follow"}</span>
                        )}
                    </span>
                </div>
            }
            <p className="name">Recently Rated Albums</p>
            <div className="content">
                {albums && (albums.length !== 0 ? 
                    albums.map(album => (<AlbumCard album={album} key={album.id} />)) :
                    (<div className="notfound">No Albums</div>)
                )}
            </div>
        </div>
    );
};

export default User;
