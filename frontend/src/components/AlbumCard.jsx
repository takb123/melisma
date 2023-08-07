import { Link } from 'react-router-dom';

const AlbumCard = ({ album }) => {
    return (
        <Link to={`/album/${album.id}`}>
            <span className='album-card'>
                <img src={album.image.url} width={200} height={200}></img>
                <span><b>{album.name}</b></span>
            </span>
        </Link>
    );
};

export default AlbumCard;