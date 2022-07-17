import HttpError from "../models/http-error.js";
import axios from "axios";

const API_KEY = process.env.API_KEY;

export default async function getCoordsForAddress(address) {
    const response = await axios.get(
        `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(address)}&format=json`
    );

    const data = response.data[0];

    if (!data || data.status === 'ZERO_RESULTS') {
        const error = new HttpError("Could not find a location for the specified address.", 422);
        return next(error);
    }

    return {
        lat: data.lat,
        lng: data.lon
    }
}