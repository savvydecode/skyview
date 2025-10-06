import { createBrowserRouter } from 'react-router';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';

const router = createBrowserRouter([
    {
        path: '/',
        Component: HomePage,
    },

    {
        path: '/about',
        Component: AboutPage,
    },

    {
        path: 'contact',
        Component: ContactPage
    }
])

export default router;