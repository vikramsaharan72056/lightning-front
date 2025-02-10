import { NavLink } from "react-router-dom";

const PageNotFound = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mt-2">Oops! Page not found.</p>
        <p className="text-gray-500 mt-2">
          The page you are looking for doesn’t exist or has been moved.
        </p>
        
            <NavLink to="/">
          Go Back Home
          </NavLink>
      </div>
    );
  };
  
  export default PageNotFound;
  