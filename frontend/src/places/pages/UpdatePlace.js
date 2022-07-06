import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/valitators";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";

import './PlaceForm.css';

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

const UpdatePlace = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { placeId } = useParams();

    // const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false);

    const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

    useEffect(() => {
        if (identifiedPlace) {
            setFormData({
                title: {
                    value: identifiedPlace.title,
                    isValid: true
                },
                description: {
                    value: identifiedPlace.description,
                    isValid: true
                }
            }, true);
        }
        setIsLoading(false);
    }, [setFormData, identifiedPlace]) // actually, setFormData will not change (because we have wrapped 
    // it with a useCallback() and identifiedPlace also will not change because each time this component 
    // will re-render, we will get the same identifiedPlace, the same object)

    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    }

    if (!identifiedPlace) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find a place!</h2>
                </Card>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="center">
                <h2>Loading...</h2>
            </div>
        )
    }
    
    return (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input 
            id="title" 
            element="input"
            type="text"
            label="Title" 
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={formState.inputs.title.value}
            initialValid={formState.inputs.title.isValid}
            />
        
        <Input 
            id="description" 
            element="textarea"
            label="Description" 
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            initialValue={formState.inputs.description.value}
            initialValid={formState.inputs.description.isValid}
            />

        <Button
            type="submit"
            disabled={!formState.isValid}>
            UPDATE PLACE
        </Button>
    </form>
    )
}

export default UpdatePlace;