import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children, fallback, requireAuth = true }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Authentication Required
            </h3>
            <p className="text-yellow-700 mb-4">
              Please log in to access this feature and make bookings.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;