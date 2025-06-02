import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Header: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth();

  return (
    <header className="p-4 bg-gray-100 flex justify-between">
      <Link to="/">
        <h2 className="text-xl">Example Site</h2>
      </Link>
      <nav>
        {isAuthenticated ? (
          <button onClick={() => logout({ returnTo: window.location.origin })} className="mr-4">
            Logout
          </button>
        ) : (
          <button onClick={() => loginWithRedirect()} className="mr-4">
            Login
          </button>
        )}
        <Link to="/checkout">Checkout</Link>
      </nav>
    </header>
  );
};

export default Header;
