import HttpError from '../models/http-error.js';
import { validationResult } from 'express-validator';
import User from '../models/user.js';

export const getUsers = async (req, res, next) => {
    let users;
    
    try {
        users = await User.find({}, '-password'); // projection - users that will be returned, won`t contain a password
    } catch (error) {
        return next(new HttpError('Fetching users failed', 500));
    }

    res.json({users: users.map(user => user.toObject({ getters: true }))});
}

export const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs were passed.', 422));
    }

    const {name, email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch(error) {
        return next(new HttpError('Signing up failed, please try again later.', 500));
    }
 
    if (existingUser) {
        return next(new HttpError('User exists already, please login instead.', 422));
    }

    const createdUser = new User({
        name, 
        email,
        image: 'https://delo.ua/static/content/thumbs/1200x900/4/65/qu7bnl---c4x3x50px50p-c4x3x50px50p--b42049eeb10c6efc1ee2a8a65b689654.jpg',
        password,
        places: []
    });

    try {
        await createdUser.save();
    } catch(error) {
        return next(new HttpError('Signing up failed, please try again.', 500));
    }

    res.status(201).json({user: createdUser.toObject({ getters: true} )});
}

export const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch(error) {
        return next(new HttpError('Login failed, please try again later.', 500));
    }

    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError('Invalid credentials.', 401));
    }

    res.json({message: 'Logged in'});
}