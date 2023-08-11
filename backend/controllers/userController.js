const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const pool = require("../database/db");
const formatDistanceToNowStrict = require('date-fns/formatDistanceToNowStrict')
const { getAlbumCache, getTrackCache } = require("../spotify/cache");

const createToken = (userID) => {
    return jwt.sign({ userID }, process.env.SECRET);
};

const signupUser = async (req, res) => {
    try {
        const { email, username, password, confirm_password } = req.body;
    
        if (!email || !username || !password || !confirm_password) {
            throw new Error("All fields must be filled in");
        }
        if (!validator.isEmail(email) || email.length > 100) {
            throw new Error("Invalid email");
        }
        const usernameRegex = /^[a-zA-Z0-9_-]{4,16}$/;  // 4-16 characters, alphanumeric and _ and - allowed 
        if (!usernameRegex.test(username)) {
            throw new Error("Invalid username");
        }
        if (!validator.isStrongPassword(password)) {
            throw new Error("Password not strong enough");
        }
        if (password !== confirm_password) {
            throw new Error("Passwords do not match");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const userQuery = await pool.query(
            "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) \
            RETURNING user_id", 
            [email, username, hash]
        );
        
        res.status(200).json({ username, token: createToken(userQuery.rows[0].user_id) });

    } catch (error) {
        if (error.code === "23505") {  // UNIQUE violation
            const violated = error.constraint.split("_")[1]; // error.constraint is in the form "TABLENAME_COLUMNNAME_key" 
            res.status(404).json({ error: `This ${violated} already exists` });
        }
        else {
            res.status(404).json({ error: error.message });
        }
    }
};

const signinUser = async (req, res) => {
    try {
        const { email_username, password } = req.body;

        if (!email_username || !password) {
            throw new Error("All fields must be filled");
        }
        const userQuery = await pool.query(
            "SELECT user_id, username, password FROM users WHERE email=$1 OR username=$1", 
            [email_username]
        );
        if (userQuery.rowCount == 0) {
            throw new Error("Invalid username or email");
        }
        const match = await bcrypt.compare(password, userQuery.rows[0].password);
        if (!match) {
            throw new Error("Wrong password");
        }

        res.status(200).json({
            username: userQuery.rows[0].username, 
            token: createToken(userQuery.rows[0].user_id)
        });

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const followUser = async (req, res) => {
    try {
        const followingID = req.user;
        const followerUsername = req.params.username;
        
        const followerQuery = await pool.query(
            "SELECT user_id FROM users WHERE username=$1",
            [followerUsername]
        );
        if (followerQuery.rowCount === 0) {
            throw new Error("User does not exist");
        }
        const followerID = followerQuery.rows[0].user_id;

        const followQuery = await pool.query(
            "INSERT INTO follows (following_id, follower_id) VALUES ($1, $2) \
            ON CONFLICT (following_id, follower_id) DO NOTHING", 
            [followingID, followerID]
        );

        res.status(200).json({ success: followQuery.rowCount });

    } catch (error) {
        if (error.code === "23514") {  // CHECK violation
            res.status(404).json({ error: "Cannot follow yourself" });
        }
        else {
            res.status(404).json({ error: error.message });
        }
    }
};

const unfollowUser = async (req, res) => {
    try {
        const followingID = req.user;
        const followerUsername = req.params.username;
        
        const followerQuery = await pool.query(
            "SELECT user_id FROM users WHERE username=$1",
            [followerUsername]
        );
        if (followerQuery.rowCount === 0) {
            throw new Error("User does not exist");
        }
        const followerID = followerQuery.rows[0].user_id;

        const unfollowQuery = await pool.query(
            "DELETE FROM follows WHERE following_id=$1 AND follower_id=$2",
            [followingID, followerID]
        );

        res.status(200).json({ success: unfollowQuery.rowCount });

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const username = req.params.username;

        const userExistQuery = await pool.query(
            "SELECT user_id FROM users WHERE username=$1",
            [username]
        );
        if (userExistQuery.rowCount === 0) {
            throw new Error("User does not exist");
        }
        const userID = userExistQuery.rows[0].user_id;

        const albumQuery = await pool.query(
            "SELECT * FROM ( \
                SELECT DISTINCT ON (album_id) album_id, created_at FROM ratings WHERE user_id=$1 ORDER BY album_id \
            ) ORDER BY created_at LIMIT 15",
            [userID]
        );
        const albums = await Promise.all(albumQuery.rows.map(row => getAlbumCache(row.album_id)));

        let following = 0;
        if (req.user) {
            const followingQuery = await pool.query(
                "SELECT follow_id FROM follows WHERE following_id=$1 AND follower_id=$2",
                [req.user, userID]
            );
            following = followingQuery.rowCount;
        }

        res.status(200).json({ albums, following });

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const getNotifs = async (req, res) => {
    try {
        const userID = req.user;

        const notifQuery = await pool.query(
            "SELECT CASE WHEN ratings.created_at IS NOT NULL THEN ratings.created_at ELSE follows.created_at END AS created_at, \
            ratings.track_id, ratings.album_id, users.username FROM ratings NATURAL FULL OUTER JOIN follows \
            LEFT JOIN users ON (ratings.user_id = users.user_id OR follows.following_id = users.user_id) \
            WHERE follows.follower_id = $1 OR ratings.user_id IN (SELECT follower_id FROM follows WHERE following_id = $1) \
            ORDER BY created_at DESC LIMIT 15",
            [userID]
        );
        const events = await Promise.all(notifQuery.rows.map(async row => ({
            type: row.track_id !== null ? "track" : "follow",
            time: formatDistanceToNowStrict(row.created_at).split(" ").map((x, i) => i ? x.slice(0, 1) : x).join(""),
            username: row.username,
            ...(row.track_id !== null && await getTrackCache(row.track_id))
        })));

        res.status(200).json({ events });

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

module.exports = {
    signupUser,
    signinUser,
    followUser,
    unfollowUser,
    getUser,
    getNotifs
};