import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

const App = () => {
    const { token, login, logout, userId } = useAuth();

    let routes;

    if (token) {
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
                    <Suspense fallback={
                        <div className='center'>
                            <LoadingSpinner />
                        </div>
                    }>
                        {routes}
                    </Suspense>
                </main>
            </Router>
        </AuthContext.Provider>
    )
}

export default App;
