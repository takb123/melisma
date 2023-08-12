import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AlbumCard from "../components/AlbumCard";

const User = () => {
    const { username } = useParams();
    const auth = useSelector(state => state.auth.value);

    const [albums, setAlbums] = useState([]);
    const [following, setFollowing] = useState(0);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`http://localhost:4000/api/user/profile/${username}`, {
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
        const response = await fetch(`http://localhost:4000/api/user/${following ? "unfollow" : "follow"}/${username}`, {
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
                    <span className="material-symbols-outlined pfp">person</span>
                    <span className="title">
                        <div className="name">{username}</div>
                        {(auth && auth.username !== username) && (<span className="follow-button" onClick={handleFollow}>{following ? "Unfollow" : "Follow"}</span>)}
                    </span>
                </div>
            }
            <p className="name">Recently Rated Albums</p>
            <div className="albums">
                {albums && albums.map(album => (<AlbumCard album={album} key={album.id} />))}
            </div>
        </div>
    );
};

export default User;
