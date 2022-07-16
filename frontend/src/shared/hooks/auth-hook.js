import { useCallback, useState, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        // expiration date of token is 1h (it was set in the backend part)
        // so here, we get the current date in millis and add 1000 * 60 * 60 = 1hour to this date
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem('userData', 
            JSON.stringify(
                {
                    userId: uid, 
                    token, 
                    expiration: tokenExpirationDate.toISOString()
                }
            ));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setTokenExpirationDate(null);
        localStorage.removeItem('userData');
    }, []);


    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        // here, we check if token is in localStorage and if it`s expiration date is still in the future (so this token is valid)
        if (storedData?.token && new Date(storedData?.expiration) > new Date()) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);

    useEffect(() => {
        if (token && tokenExpirationDate) {
          const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
          logoutTimer = setTimeout(logout, remainingTime);
        } else {
          clearTimeout(logoutTimer);
        }
      }, [token, logout, tokenExpirationDate]);

    return { token, login, logout, userId };
}