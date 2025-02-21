const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    try {
        console.log("Authorization Header:", req.headers.authorization);

        if (!req.headers.authorization) {
            throw new Error("Aucun token fourni !");
        }

        const token = req.headers.authorization.split(' ')[1];

        console.log("Extracted Token:", token);

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

        console.log("Decoded Token:", decodedToken);

        req.auth = { userId: decodedToken.userId, role: decodedToken.role };

        next();
    } catch (error) {
        console.error("Erreur JWT:", error.message);
        res.status(401).json({ error: "Accès non autorisé, token invalide !" });
    }
};

exports.requireRole = (role) => {
    return (req, res, next) => {
        if (!req.auth || req.auth.role !== role) {
            return res.status(403).json({ error: "Accès interdit !" });
        }
        next();
    };
};