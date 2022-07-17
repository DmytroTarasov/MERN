import HttpError from "../models/http-error.js";
import jwt from "jsonwebtoken";

export default (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    
    const token = req.headers.authorization?.split(' ')[1]; // token will be provided in the header 'authorization' (this header is allowed because we`ve specified 'Authorization' header in middleware in app.js file)

    if (!token) {
        return next(new HttpError('Authentication failed.', 401));
    }

    // check the key that is contained within the token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
}