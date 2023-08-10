/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

const AlbumCard = ({ album }) => {
    return (
        <Link to={`/album/${album.id}`}>
            <span className='album-card'>
                <img src={album.image.url} width={200} height={200}></img>
                <span className='card-entry'><b>{album.name}</b></span>
                <span className='card-entry artist-entry'>
                    {album.artists && album.artists
                        .map(artist => (<Link key={artist.id} to={`/artist/${artist.id}`}><span className='artist-name'>{artist.name}</span></Link>))
                        .reduce((prev, curr) => [prev, ', ', curr])
                    }
                </span>
            </span>
        </Link>
    );
};

export default AlbumCard;