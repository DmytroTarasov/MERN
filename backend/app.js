import express from 'express';
import bodyParser from 'body-parser';
import HttpError from './models/http-error.js';

import placesRoutes from './routes/places-routes.js';
import usersRoutes from './routes/users-routes.js';

const app = express();

// middleware that will convert a JSON (request body) to a plain JS object automatically during the request pipeline
app.use(bodyParser.json());

app.use('/api/places', placesRoutes); // => /api/places...
app.use('/api/users', usersRoutes); // => /api/users...

// this middleware will be reached if we are trying to hit the non-existing route
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error; // this error will be handled by the 'error handling' middleware which comes next in this file
});

// special middleware (we`ve provided 4 arguments in the callback f-n)
// express will automatically recognize it as an error handling middleware
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured.'});
});
 
app.listen(5000);