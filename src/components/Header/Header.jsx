import React from 'react';

const Header = ({ isLogged, login, logout }) => (
  <div className="row zindex-1 p-2">
    {isLogged ? (
      <button className="btn btn-light rounded-pill" onClick={logout}>
        Logout
      </button>
    ) : (
      <button className="btn btn-light rounded-pill" onClick={login}>
        Login with VK
      </button>
    )}
  </div>
);

export default Header;
