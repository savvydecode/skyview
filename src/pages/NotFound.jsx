import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-semibold text-gray-900">Page Not Found</h1>
            <p className="text-gray-600 mt-2">
                We couldn’t find that page. Try going back home.
            </p>
            <Link
                to="/"
                className="inline-block mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
                Go Home
            </Link>
        </div>
    );
}