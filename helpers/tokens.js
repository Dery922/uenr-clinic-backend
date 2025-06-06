import jwt from "jsonwebtoken";
const generateToken = (paylaod, expired) => {
    return jwt.sign(paylaod, process.env.TOKEN_SECRET, {
       expiresIn : expired,
    });
};

export {generateToken}