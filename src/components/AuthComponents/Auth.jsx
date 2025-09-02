// components/Auth.jsx
import React, { useState } from 'react';
import Login from '../LoginComponents/Login';
import Signup from '../SignupComponents/Signup';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <div>
      {isLoginMode ? (
        <Login onToggleMode={toggleMode} />
      ) : (
        <Signup onToggleMode={toggleMode} />
      )}
    </div>
  );
};

export default Auth;