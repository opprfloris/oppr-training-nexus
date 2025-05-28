
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/outline";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-20 h-20 bg-oppr-blue/10 rounded-lg mx-auto mb-6 flex items-center justify-center">
          <span className="text-3xl">🔎</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link 
          to="/" 
          className="oppr-button-primary inline-flex items-center space-x-2"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Return to Gateway</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
