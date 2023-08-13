const getAccessToken = require("../spotify/accessToken");
const pool = require("../database/db");
const { getAlbumCache, getTrackCache, setTrackCache } = require("../spotify/cache");

const getAlbum = async (req, res) => {
    try {
        const albumID = req.params.albumid;
        const accessToken = await getAccessToken();

        const response = await fetch("https://api.spotify.com/v1/albums/" + albumID, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        const json = await response.json();
        if (!response.ok) {
            throw new Error(json.error.message);
        }

        const album = { 
            id: albumID,
            name: json.name,
            image: json.images[1]
        };
        const artists = json.artists.map(artist => ({
            id: artist.id,
            name: artist.name
        }));
        const tracks = await Promise.all(json.tracks.items.map(async item => {
            setTrackCache(item.id, { name: item.name, albumID });
            let ratingScore = 0;
            if (req.user) {
                const scoreQuery = await pool.query(
                    "SELECT rating_score FROM ratings WHERE user_id=$1 AND track_id=$2",
                    [req.user, item.id]
                );

                if (scoreQuery.rowCount !== 0) {
                    ratingScore = scoreQuery.rows[0].rating_score;
                }
            }
            return {
                id: item.id,
                name: item.name,
                ratingScore
            };
        }));

        res.status(200).json({ album, artists, tracks });

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const getArtist = async (req, res) => {
    try {
        const artistID = req.params.artistid;
        const accessToken = await getAccessToken();

        const [artistResponse, albumResponse] = await Promise.all([
            fetch(`https://api.spotify.com/v1/artists/${artistID}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }),
            fetch(`https://api.spotify.com/v1/artists/${artistID}/albums?limit=10`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
        ]);

        const [artistJson, albumJson] = await Promise.all([artistResponse.json(), albumResponse.json()]);

        if (!artistResponse.ok) {
            throw new Error(json.error.message);
        }
        if (!albumResponse.ok) {
            throw new Error(json.error.message);
        }

        const artist = {
            id: artistID,
            name: artistJson.name,
            image: artistJson.images[1]
        };
        const albums = albumJson.items.map(item => ({
            id: item.id,
            name: item.name,
            image: item.images[1]
        }));

        res.status(200).json({ artist, albums });

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const getTrendingAlbums = async (req, res) => {
    try {
        const trendingQuery = await pool.query(
            "SELECT album_id, COUNT(album_id) FROM ratings GROUP BY album_id ORDER BY 2 DESC LIMIT 10",
            []
        );
        const albums = await Promise.all(trendingQuery.rows.map(row => getAlbumCache(row.album_id)));
        res.status(200).json({ albums });

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const getRating = async (req, res) => {
    try {
        const userID = req.user;
        const trackID = req.params.trackid;

        if (!trackID) {
            throw new Error("Missing fields");
        }

        const ratingQuery = await pool.query(
            "SELECT rating_id FROM ratings WHERE user_id=$1 AND track_id=$2",
            [userID, trackID]
        );
        if (ratingQuery.rowCount === 0) {
            throw new Error("Must rate track before viewing ratings");
        }

        const scoresQuery = await pool.query(
            "SELECT COUNT(CASE WHEN rating_score = 1 THEN 1 ELSE NULL END) as one, \
            COUNT(CASE WHEN rating_score = 2 THEN 1 ELSE NULL END) as two, \
            COUNT(CASE WHEN rating_score = 3 THEN 1 ELSE NULL END) as three, \
            COUNT(CASE WHEN rating_score = 4 THEN 1 ELSE NULL END) as four, \
            COUNT(CASE WHEN rating_score = 5 THEN 1 ELSE NULL END) as five \
            FROM ratings WHERE track_id=$1",
            [trackID]
        );

        res.status(200).json({ ...scoresQuery.rows[0] });

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const createRating = async (req, res) => {
    try {
        const { ratingScore } = req.body;
        const userID = req.user;
        const trackID = req.params.trackid;

        if (!ratingScore || !trackID) {
            throw new Error("Missing fields");
        }
        if (!Number.isInteger(ratingScore) || 1 > ratingScore || 5 < ratingScore) {
            throw new Error("Invalid Rating Score");
        }

        const track = await getTrackCache(trackID);
        const upsertQuery = await pool.query(
            "INSERT INTO ratings (user_id, track_id, album_id, rating_score) VALUES ($1, $2, $3, $4) \
            ON CONFLICT (user_id, track_id) \
            DO UPDATE SET rating_score = EXCLUDED.rating_score, created_at = CURRENT_TIMESTAMP \
            RETURNING rating_score", 
            [userID, trackID, track.albumID, ratingScore]
        );

        res.status(200).json({ ratingScore: upsertQuery.rows[0].rating_score});

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const searchData = async (req, res) => {
    try {
        const name = req.query.name;

        if (!name) {
            throw new Error("Invalid Search Query");
        }
        const searchParams = new URLSearchParams();
        searchParams.append("q", name);
        const query = searchParams.toString();

        const accessToken = await getAccessToken();
        const [userQuery, musicResponse] = await Promise.all([
            pool.query(
                "SELECT * FROM ( \
                    (SELECT username, 0 AS key FROM users WHERE POSITION($1 IN username) = 1) UNION \
                    (SELECT username, 1 AS key FROM users WHERE POSITION($1 IN username) > 1) \
                ) AS t ORDER BY key, LENGTH(username) LIMIT 15",
                [name]
            ),
            fetch(`https://api.spotify.com/v1/search?${query}&type=album%2Cartist%2Ctrack&limit=15`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
        ]);
        const musicJson = await musicResponse.json();
        if (!musicResponse.ok) {
            throw new Error(json.error.message);
        }

        const users = userQuery.rows.map(row => row.username);
        const albums = musicJson.albums.items.map(item => ({
            id: item.id,
            name: item.name,
            image: item.images[1]
        }));
        const artists = musicJson.artists.items.map(item => ({
            id: item.id,
            name: item.name,
            image: item.images[1]
        }));
        const tracks = musicJson.tracks.items.map(item => ({
            id: item.id,
            name: item.name,
            albumID: item.album.id,
            albumImage: item.album.images[1]
        }));
        
        res.status(200).json({ albums, artists, tracks, users });

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    getAlbum,
    getArtist,
    getTrendingAlbums,
    getRating,
    createRating,
    searchData
};