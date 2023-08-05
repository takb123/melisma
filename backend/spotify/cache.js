const NodeCache = require("node-cache");
const getAccessToken = require("./accessToken");

// albumID => { name, image }
// Cache expires in 6 hours
const albumCache = new NodeCache({stdTTL: 6 * 60 * 60});  

// albumID => { id, name, image }
const getAlbumCache = async (albumID) => {
    let album = albumCache.get(albumID);
    if (album === undefined) {
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
        album = { 
            name: json.name,
            image: json.images[1]
        };
        albumCache.set(albumID, album);
    }
    else {
        albumCache.ttl(albumID);
    }
    return { id: albumID, ...album };
};

// (albumID, { id, name, image })
const setAlbumCache = (albumID, album) => {
    if (!albumCache.has(albumID)) {
        albumCache.set(albumID, {
            name: album.name,
            image: album.image
        });
    }
    else {
        albumCache.ttl(albumID);
    }
}

// trackID => { name, albumID }
// Cache expires in 6 hours
const trackCache = new NodeCache({stdTTL: 6 * 60 * 60});

// trackID => { name, albumID }
const getTrackCache = async (trackID) => {
    let track = trackCache.get(trackID);
    if (track === undefined) {
        const accessToken = await getAccessToken();
        const response = await fetch("https://api.spotify.com/v1/tracks/" + trackID, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        const json = await response.json();
        if (!response.ok) {
            throw new Error(json.error.message);
        }

        track = {
            name: json.name,
            albumID: json.album.id
        };
        trackCache.set(trackID, track);
    }
    else {
        trackCache.ttl(trackID);
    }
    return track;
}

// (trackID, { name, albumID })
const setTrackCache = (trackID, track) => {
    if (!trackCache.has(trackID)) {
        trackCache.set(trackID, track);
    }
    else {
        trackCache.ttl(trackID);
    }
}

module.exports = {
    getAlbumCache,
    setAlbumCache,
    getTrackCache,
    setTrackCache
};