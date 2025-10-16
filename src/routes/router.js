import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import MapPage from '../pages/MapPage';

// Inline NotFound component without JSX so this file can stay .js
function NotFound() {
    return React.createElement(
        'div',
        { style: { padding: 16 } },
        'Page not found. Go to ',
        React.createElement('a', { href: '/' }, 'Home'),
        '.'
    );
}

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