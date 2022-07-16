import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";
import './ImageUpload.css';

const ImageUpload = props => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);
    const filePickerRef = useRef();

    useEffect(() => {
        if (!file) {
            return;
        }
        // filereader is used to create an image preview based on the file that user has selected
        const fileReader = new FileReader();
        // onload() will execute each time the user selects a file
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickImageHandler = () => {
        filePickerRef.current.click();
    }

    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid = isValid;
        // input type that used for picking files is 'file' so we have this property 'files' on the event target
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];

            setFile(pickedFile);
            setIsValid(true); // isValid is not changed immediately, updating state takes some time to proceed
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    }

    return (
        <div className="form-control">
            <input
                id={props.id}
                ref={filePickerRef}
                style={{ display: 'none' }}
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>
                    PICK IMAGE
                </Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
}

export default ImageUpload;