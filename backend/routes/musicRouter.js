const express = require("express");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const { getAlbum, getArtist, getTrendingAlbums, getRating, createRating, searchData } = require("../controllers/musicController");

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
// result: { one, two, three, four, five }
router.get("/rating/:trackid", requireAuth, getRating);

// requirement: req.headers.authorization = Bearer <JWT_TOKEN>
// requirement: req.body = { ratingScore }
// result: { ratingScore }
router.post("/rating/:trackid", requireAuth, createRating);

// requirement: /search?name=...  (must be in URL Encoding)
// result: {
//     albums: [{
//         id, name, image,
//         artists: [{ id, name }]
//      }],
//     artists: [{ id, name, image }],
//     tracks: [{
//         id, name, 
//         album: { id, name, image }
//     }],
//     users: [{ username }]
// }
router.get("/search", searchData);

module.exports = router;