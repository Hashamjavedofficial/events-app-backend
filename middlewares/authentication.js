const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            res.status(401).json({message:'Authorization failed'})
        }else{
            const decodeData = jwt.verify(token, 'generatesecretecodeforthe@event@/app');
            req.userData = { userId: decodeData.userId };
            next();
        }
    } catch (error) {
        res.status(401).json({message:'Authorization failed'})
    }
};
module.exports = auth;