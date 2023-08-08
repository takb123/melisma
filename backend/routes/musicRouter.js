const express = require("express");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const { getAlbum, getArtist, getTrendingAlbums, rateTrack, searchData } = require("../controllers/musicController");

const router = express.Router();

// result: { 
//     album: { id, name, image }, 
//     artists: [{ id, name }],
//     tracks: [{ id, name, ratingScore }]
// }
router.get("/album/:albumid", optionalAuth, getAlbum);

// result: {
//     artist: { id, name, image },
//     albums: [{ id, name, image }]
// }
router.get("/artist/:artistid", getArtist);

// result: {
//     albums: [{
//         id, name, image,
//         artists: [{ id, name }]
//     }] 
// }
router.get("/trending", getTrendingAlbums);

// requirement: req.headers.authorization = Bearer <JWT_TOKEN>
// requirement: req.body = { ratingScore }
// result: { one, two, three, four, five }
router.post("/rating/:trackid", requireAuth, rateTrack);

// requirement: /search?name=...  (must be in URL Encoding)
// result: {
//     albums: [{ id, name, image }],
//     artists: [{ id, name, image }],
//     tracks: [{ id, name, albumID, albumImage }],
//     users: [{ username }]
// }
router.get("/search", searchData);

module.exports = router;