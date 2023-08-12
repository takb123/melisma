/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AlbumCard from "../components/AlbumCard";

const Artist = () => {
    const { artistID } = useParams();

    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const fetchArtist = async () => {
            const response = await fetch(`http://localhost:4000/api/music/artist/${artistID}`);
            const json = await response.json();
            if (response.ok) {
                setArtist(json.artist);
                setAlbums(json.albums);
            }
            else {
                toast.error(`Error: ${json.error}`);
            }
        }

        fetchArtist();
    }, []);

    return (
        <div className="section">
            {artist &&
                <div className="head">
                    <img className="circle" src={artist.image.url} width={250}/>
                    <span className="title">
                        <div className="name">{artist.name}</div>
                    </span>
                </div>
            }
            <div className="albums">
                {albums && albums.map(album => (<AlbumCard album={album} key={album.id} />))}
            </div>
        </div>
    );
};

export default Artist;