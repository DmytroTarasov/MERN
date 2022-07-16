import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// in this file we configure 'multer' - a package that lets us work with files 

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

// here, we pass a config object into a multer();
const fileUpload = multer({
    limits: 500000, // max size of a file
    storage: multer.diskStorage({
        destination: (req, file, cb) => { // where to store the incoming file
            cb(null, 'uploads/images'); // the first argument in the cb (callback f-n) is an error so we pass null there
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype]; // get the file extension
            cb(null, uuidv4() + '.' + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type');
        cb(error, isValid); // second argument indicates whether or not we accept the file
    }
});

export default fileUpload;