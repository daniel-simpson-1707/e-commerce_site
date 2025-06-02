import React from 'react';
import useAuth from '../hooks/useAuth';

const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth();
  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={() => loginWithRedirect()}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Log In
      </button>
    </div>
  );
};

export default Login;
