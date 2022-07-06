import HttpError from '../models/http-error.js';
import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import getCoordsForAddress from '../util/location.js';

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the famous building in the world',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St., New York, NY 10001',
        creator: 'u1'
    }
];

export const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid; // extract the placeId from the route
    const place = DUMMY_PLACES.find(p => p.id === placeId);

    if (!place) {
        // the thrown error will be passed to the next middleware which, 
        // in this case, is an 'error handler' in app.js file
        return next(new HttpError('Could not find a place for the provided id.', 404)); 
    }

    res.json({ place });
}

export const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid; // extract the userId from the route
    const places = DUMMY_PLACES.filter(p => p.creator === userId);

    if (!places || places.length === 0) {
        return next(new Error('Could not find places for the provided user id.'), 404);
    }

    res.json({ places });
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
    } catch(error) {
        return next(error);
    }

    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };

    DUMMY_PLACES.push(createPlace);
    res.status(201).json( {place: createdPlace} );
}

export const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs were passed.', 422);
    }

    const placeId = req.params.pid; // extract the placeId from the route
    const place = DUMMY_PLACES.find(p => p.id === placeId);

    const { title, description} = req.body;

    const updatedPlace = {
        ...place,
        title,
        description
    }

    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json( {place: updatedPlace} );
}

export const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HttpError(`Could not find a place for id = ${placeId}`, 404);
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

    res.status(200).json( {message: `Deleted a place with id = ${placeId}`} );
}