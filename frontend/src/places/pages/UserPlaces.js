import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PlaceList from '../components/PlaceList';
import { useHttpClient } from '../../shared/hooks/http-hook.js';
import ErrorModal from '../../shared/components/UIElements/ErrorModal.js';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner.js';

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const {userId} = useParams();

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
                setLoadedPlaces(responseData.places);
            } catch (err) {}
        }
        fetchPlaces();
    }, [sendRequest, userId]);

    const placeDeletedHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId));
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
        </>
    )
}

export default UserPlaces;