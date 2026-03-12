
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './style.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Fatal: #root element missing");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("React mounting failed:", error);
  rootElement.innerHTML = `
    <div style="padding: 40px; font-family: sans-serif; background: #fff1f2; color: #991b1b; border: 2px solid #ef4444; margin: 20px; border-radius: 8px;">
      <h1 style="margin: 0 0 16px;">Application Startup Error</h1>
      <p>The application encountered a fatal error during initialization.</p>
      <pre style="background: #fee2e2; padding: 16px; border-radius: 4px; overflow: auto; border: 1px solid #fecaca;">${error instanceof Error ? error.stack : String(error)}</pre>
      <p style="margin-top: 16px; font-size: 14px; color: #7f1d1d;">Check the browser console for details. Common causes include failed module resolution or missing environment variables.</p>
    </div>
  `;
}
