const express = require("express");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const { signupUser, signinUser, followUser, unfollowUser, getUser, getNotifs } = require("../controllers/userController");

const router = express.Router();

// requirement: req.body = { email, username, password, confirm_password }
// result: { username, token }
router.post("/signup", signupUser);

// requirement: req.body = { email_username, password }
// result: { username, token } 
router.post("/signin", signinUser);

// requirement: req.headers.authorization = Bearer <JWT_TOKEN>
// result: { success: 0 / 1 }
router.post("/follow/:username", requireAuth, followUser);

// requirement: req.headers.authorization = Bearer <JWT_TOKEN>
// result: { success: 0 / 1 }
router.post("/unfollow/:username", requireAuth, unfollowUser);

// result: {
//     albums: [{
//         id, name, image,
//         artists: [{ id, name }]
//     }] 
// }
router.get("/profile/:username", optionalAuth, getUser);

// requirement: req.headers.authorization = Bearer <JWT_TOKEN>
// result: {
//     events: [{ type = "track", time, username, name, albumID }
//         OR   { type = "follow", time, username }]
// }
router.get("/notifs", requireAuth, getNotifs);

module.exports = router;