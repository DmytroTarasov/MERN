import { createContext } from "react";

export const AuthContext = createContext({ 
    isLoggedIn: false,  // default values
    userId: null,
    token: null,
    login: () => {}, 
    logout: () => {}
});