import { useState, useEffect } from "react";
import AlbumCard from '../components/AlbumCard';
import { apiURL } from "../helper";
import { toast } from "react-toastify";

const Home = () => {
    const [albums, setAlbums] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTrendingAlbums = async () => {
            setIsLoading(true);
            const response = await fetch(`${apiURL}/music/trending`);
            const json = await response.json();

            if (response.ok) {
                setAlbums(json.albums);
            }
            else {
                toast.error(`Error: ${json.error}`);
            }
            setIsLoading(false);
        };

        fetchTrendingAlbums();
    }, []);

    return (
        <div className="section">
            {isLoading ? (
                <div className="loading"></div>
            ) : (
                <>
                    <p className="section-name">Trending Albums</p>
                    <div className="content">
                        {albums && albums.map(album => (<AlbumCard key={album.id} album={album}/>))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;