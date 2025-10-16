import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import MapPage from '../pages/MapPage';
import NotFound from '../pages/NotFound';

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
        path: '*',
        Component: NotFound,
    },
]);

export default router;