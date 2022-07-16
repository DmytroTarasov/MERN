import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
    const { token, login, logout, userId } = useAuth();

    let routes;

    if(token) {
        routes = (
            <Routes>
                <Route path="/" element={<Users />}></Route>
                <Route path="/places/new" element={<NewPlace />}></Route>
                <Route path="/:userId/places" element={<UserPlaces />}></Route>
                <Route path="/places/:placeId" element={<UpdatePlace />}></Route>
                <Route path="*" element={<Navigate to="/" replace />}></Route>
            </Routes>
        );
    } else {
        routes = (
            <Routes>
                <Route path="/" element={<Users />}></Route>
                <Route path="/:userId/places" element={<UserPlaces />}></Route>
                <Route path="/auth" element={<Auth />}></Route>
                <Route path="*" element={<Navigate to="/auth" replace />}></Route>
            </Routes>
        );
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn: !!token, token, login, logout, userId }}>
            <Router>
                <MainNavigation />
                <main>
                    {routes}
                </main>
            </Router>
        </AuthContext.Provider>
    )
}

export default App;
