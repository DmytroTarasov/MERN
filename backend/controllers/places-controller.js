import mongoose from 'mongoose';
import fs from 'fs';

import HttpError from '../models/http-error.js';
import { validationResult } from 'express-validator';
import getCoordsForAddress from '../util/location.js';
import Place from '../models/place.js';
import User from '../models/user.js';

export const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid; // extract the placeId from the route

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (error) {
        return next(new HttpError('Something went wrong. Could not find a place.', 500));
    }

    if (!place) {
        // the thrown error will be passed to the next middleware which, 
        // in this case, is an 'error handler' in app.js file
        return next(new HttpError('Could not find a place for the provided id.', 404));
    }

    // here, we transform a mongoose 'place' object to a plain object and also set 'getters' to true so the _id property of the mongoose object will be added to this plain object (but, importantly, without underscore - just simply id)
    res.json({ place: place.toObject({ getters: true }) });
}

export const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid; // extract the userId from the route

    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate('places');
    } catch (error) {
        return next(new HttpError('Fetching places failed.', 500));
    }

    if (!userWithPlaces || userWithPlaces.places.length === 0) {
        return next(new HttpError('Could not find places for the provided user id.', 404));
    }

    res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
}

export const createPlace = async (req, res, next) => {
    // f-n that comes from package 'express-validator'
    // it checks if there are some validation errors (we`ve specified requirements in the places-routes.js file)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs were passed.', 422));
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    // Place is a model from a mongoose that was created actually in the models/place.js file
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: req.file.path,
        creator
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (error) {
        return next(new HttpError('Creating a place failed, please try again.', 500));
    }

    if (!user) {
        return next(new HttpError('Could not find a user for the provided id.', 404));
    }

    try {
        // here, we use a session and transaction. if one of the operation failes (creating a place or updating a user`s places
        // then all other operations will be rollbacked)
        const sess = await mongoose.startSession();
        sess.startTransaction();
        
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        
        await sess.commitTransaction(); // save changes to the DB
    } catch (error) {
        return next(new HttpError('Creating a place failed, please try again.', 500));
    }

    res.status(201).json({ place: createdPlace });
}

export const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs were passed.', 422);
    }

    const placeId = req.params.pid; // extract the placeId from the route
    const { title, description } = req.body;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (error) {
        return next(new HttpError('Something went wrong. Could not find a place.', 500));
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (error) {
        return next(new HttpError('Something went wrong. Could not update a place.', 500));
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
}

export const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        return next(new HttpError('Something went wrong, could not delete a place.', 500));
    }

    if (!place) {
        return next(new HttpError('Could not find a place for the provided id.', 404));
    }

    const imagePath = place.image;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await place.remove({ session: sess });
        place.creator.places.pull(place); // remove the place from the user`s places
        await place.creator.save({ session: sess });

        await sess.commitTransaction(); // save changes to the DB
    } catch (err) {
        return next(new HttpError('Something went wrong, could not delete a place.', 500));
    }

    fs.unlink(imagePath, err => console.log(err)); // delete a place image
    
    res.status(200).json({ message: 'A place was successfully deleted' });
}