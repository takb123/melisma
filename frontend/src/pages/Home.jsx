import { useState, useEffect } from "react";
import AlbumCard from '../components/AlbumCard';
import { apiURL } from "../helper";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loadOff, loadOn } from "../redux/loadingSlice";

const Home = () => {
    const [albums, setAlbums] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchTrendingAlbums = async () => {
            dispatch(loadOn());
            const response = await fetch(`${apiURL}/music/trending`);
            const json = await response.json();

            if (response.ok) {
                setAlbums(json.albums);
            }
            else {
                toast.error(`Error: ${json.error}`);
            }
            dispatch(loadOff());
        };

        fetchTrendingAlbums();
    }, [dispatch]);

    return (
        <div className="section">
            <p className="section-name">Trending Albums</p>
            <div className="content">
                {albums && albums.map(album => (<AlbumCard key={album.id} album={album}/>))}
            </div>
        </div>
    );
};

export default Home;