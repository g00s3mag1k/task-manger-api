const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid Authorization"});
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email, iat, exp }
        return next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token"});
    }
};