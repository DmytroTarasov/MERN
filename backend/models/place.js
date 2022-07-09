import mongoose from "mongoose";

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    location: { 
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    // establish a relationship between users and places (one-to-many) - 'User' is a name of the users model
    // (created in the user.js file)
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

export default mongoose.model('Place', placeSchema);
