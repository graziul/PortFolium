import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main: Starting React application...');
console.log('Main: React version:', React.version);
console.log('Main: Environment:', import.meta.env.MODE);

try {
  const rootElement = document.getElementById('root');
  console.log('Main: Root element found:', !!rootElement);
  
  if (!rootElement) {
    console.error('Main: Root element not found in DOM');
    throw new Error('Root element not found');
  }

  console.log('Main: Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('Main: Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  
  console.log('Main: React application rendered successfully');
} catch (error) {
  console.error('Main: Error starting React application:', error);
  console.error('Main: Error stack:', error.stack);
}