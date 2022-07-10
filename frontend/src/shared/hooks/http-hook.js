import { useState, useCallback, useEffect, useRef } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    
    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true);
        const httpAbortController = new AbortController();
        activeHttpRequests.current.push(httpAbortController);
        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortController.signal // link an AbortController to this request (to be able to cancel this request)
            });
    
            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(requestController => 
                requestController !== httpAbortController);
    
            if (!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false);
            return responseData;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }      
    }, []);

    const clearError = () => setError(null);

    useEffect(() => {
        // clean resources
        return () => {
            activeHttpRequests.current.forEach(abortController => abortController.abort());
        }
    }, []);

    return { isLoading, error, sendRequest, clearError };
}