import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import MapPage from '../pages/MapPage';
import NotFound from '../pages/NotFound';
import Forecast from '../pages/Forecast';
import FavoriteSearches from '../pages/FavoriteSearches';
const router = createBrowserRouter([
    {
        path: '/',
        Component: HomePage,
    },
    {
        path: '/map',
        Component: MapPage,
    },
    {
        path: '/forecast',
        Component: Forecast,
    },
    {
        path: 'favorites',
        Component: FavoriteSearches,
    },
    {
        path: '*',
        Component: NotFound,
    },
]);

export default router;