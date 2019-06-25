import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      .then(() => (console.log("Service worker registered")))
      .catch((error) => {
        console.error('Registration failed, error:', error);
      });
  }
};

registerServiceWorker();
