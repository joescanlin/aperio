import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Enhanced error handler
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('ResizeObserver') || args[0].includes('ResizeObserver loop'))
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Suppress ResizeObserver errors in the browser
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message.includes('ResizeObserver') || event.message.includes('ResizeObserver loop')) {
      event.stopImmediatePropagation();
    }
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);