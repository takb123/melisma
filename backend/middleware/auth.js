const jwt = require("jsonwebtoken");
const pool = require("../database/db");

const checkAuth = async (authorization) => {
    if (!authorization) {
        throw new Error("Login required to perform this action");
    }

    const token = authorization.split(" ")[1];  // authorization is in the form "Bearer TOKEN"
    const { userID } = jwt.verify(token, process.env.SECRET);
    const findUser = await pool.query("SELECT user_id FROM users WHERE user_id=$1", [userID]);
    if (findUser.rowCount === 0) {
        throw new Error("Invalid Authorization");
    }
    
    return findUser.rows[0].user_id;
};

const requireAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        req.user = await checkAuth(authorization);
        next();

    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

const optionalAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        req.user = await checkAuth(authorization);

    } catch (error) {
        // Ignore Errors  
    } finally {
        next();
    }
};

module.exports = {
    requireAuth,
    optionalAuth
};