import { createBrowserRouter } from 'react-router';
import HomePage from '../pages/HomePage';

const router = createBrowserRouter([
    {
        path: '/',
        Component: HomePage,
    }
])
export default router;