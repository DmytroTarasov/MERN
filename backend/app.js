import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

import placesRoutes from './routes/places-routes.js';
import usersRoutes from './routes/users-routes.js';

const app = express();

// middleware that will convert a JSON (request body) to a plain JS object automatically during the request pipeline
app.use(bodyParser.json());

// serving static files
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use(express.static(path.join('public')));

app.use((req, res, next) => {
    // which domain can have an access to this backend API
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    
    next();
});

app.use('/api/places', placesRoutes); // => /api/places...
app.use('/api/users', usersRoutes); // => /api/users...

// if no backend routes were hitted, then return an index.html file - a react app
app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// this middleware will be reached if we are trying to hit the non-existing route
// app.use((req, res, next) => {
//     const error = new HttpError('Could not find this route', 404);
//     throw error; // this error will be handled by the 'error handling' middleware which comes next in this file
// });

// special middleware (we`ve provided 4 arguments in the callback f-n)
// express will automatically recognize it as an error handling middleware
app.use((error, req, res, next) => {
    if (req.file) { // a file is a part of the request (and the error was thrown)
        fs.unlink(req.file.path, (err) => { // delete an image file from the uploads/images folder
            console.log(err);
        }); // the second argument (a callback) will be executed when a deletion was completed
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured.'});
});
 

mongoose
.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nhtjl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
.then(() => {
    app.listen(process.env.PORT || 5000);
})
.catch(err => {
    console.log(err);
});