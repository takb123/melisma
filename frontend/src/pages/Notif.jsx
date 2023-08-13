import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiURL } from "../helper";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Notif = () => {
    const auth = useSelector(state => state.auth.value);

    const [notifs, setNotifs] = useState(null);

    useEffect(() => {
        const fetchNotifs = async () => {
            const response = await fetch(`${apiURL}/user/notifs`, {
                headers: {
                    ...(auth && { "Authorization": `Bearer ${auth.token}` })
                }
            });
            const json = await response.json();
            if (response.ok) {
                setNotifs(json.events);
            }
            else {
                toast.error(`Error: ${json.error}`);
            }
        };
        
        fetchNotifs();
    }, [auth]);
    return (
        <div className="centered section">
            <p className="section-name">Notifications</p>
            <div className="notifs">
                {notifs && (notifs.length !== 0 ? (notifs.map(notif => notif.type === "track" ? (
                    <div className="notif" key={`${notif.username}.${notif.name}.${notif.albumID}`}>
                        <span className="material-symbols-outlined">reviews</span>
                        <span className="description">
                            <Link to={`/user/${notif.username}`}>{notif.username} </Link>rated
                            <Link to={`/album/${notif.albumID}`}> {notif.name}</Link>
                        </span>
                        <span className="time">{notif.time}</span>
                    </div>
                ) : (
                    <div className="notif" key={`${notif.username}`}>
                        <span className="material-symbols-outlined">person</span>
                        <span className="description">
                            <Link to={`/user/${notif.username}`}>{notif.username}</Link> started following you
                        </span>
                        <span className="time">{notif.time}</span>
                    </div>
                ))) : (<div className="notfound">No Notifications</div>))}
            </div>
        </div>
    );
};

export default Notif;