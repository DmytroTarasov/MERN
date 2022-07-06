import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous buildings in the world!',
        imageUrl: 'https://delo.ua/static/content/thumbs/1200x900/4/65/qu7bnl---c4x3x50px50p-c4x3x50px50p--b42049eeb10c6efc1ee2a8a65b689654.jpg',
        address: '20 W 34th St., New York, NY 10001, USA',
        location: {
            lat: 40.7486352,
            lng: -73.9895394
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous buildings in the world!',
        imageUrl: 'https://delo.ua/static/content/thumbs/1200x900/4/65/qu7bnl---c4x3x50px50p-c4x3x50px50p--b42049eeb10c6efc1ee2a8a65b689654.jpg',
        address: '20 W 34th St., New York, NY 10001, USA',
        location: {
            lat: 40.7486352,
            lng: -73.9895394
        },
        creator: 'u2'
    }
]

const UserPlaces = () => {
    const {userId} = useParams();
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);

    return <PlaceList items={loadedPlaces} />
}

export default UserPlaces;