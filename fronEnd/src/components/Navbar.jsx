import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AM</span>
              </div>
              <span className="font-bold text-xl text-gray-900">AutoMaintenance</span>
            </Link>

            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium transition-colors">
                About Us
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium transition-colors">
                Services
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
