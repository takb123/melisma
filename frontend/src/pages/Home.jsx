import { useState, useEffect } from "react";
import AlbumCard from '../components/AlbumCard';

const Home = () => {
    const [ albums, setAlbums ] = useState([]);

    useEffect(() => {
        const fetchTrendingAlbums = async () => {
            const response = await fetch('http://localhost:4000/api/music/trending');
            const json = await response.json();

            if (response.ok) {
                setAlbums(json.albums);
            }
        };

        fetchTrendingAlbums();
    }, []);

    return (
        <div className="home">
            <p className="section-name">Trending Albums</p>
            {albums && albums.map(album => (<AlbumCard key={album.id} album={album}/>))}
        </div>
    );
};

export default Home;