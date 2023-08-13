import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AlbumCard from "../components/AlbumCard";
import { apiURL, getUserColor } from "../helper";

const User = () => {
    const { username } = useParams();
    const auth = useSelector(state => state.auth.value);

    const [albums, setAlbums] = useState([]);
    const [following, setFollowing] = useState(0);

    useEffect(() => {
        const fetchUser = async () => {
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
                toast.error(`Error: ${json.error}`);
            }
        }

        fetchUser();
    }, [username, auth]);

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
                    {/* <img src={defaultProfile} className={getUserColor(username)}width={180} height={180}/> */}
                    <span className="title">
                        <div className="name">{username}</div>
                        {(auth && auth.username !== username) && (<span className="follow-button" onClick={handleFollow}>{following ? "Unfollow" : "Follow"}</span>)}
                    </span>
                </div>
            }
            <p className="name">Recently Rated Albums</p>
            <div className="content">
                {albums && albums.map(album => (<AlbumCard album={album} key={album.id} />))}
            </div>
        </div>
    );
};

export default User;
