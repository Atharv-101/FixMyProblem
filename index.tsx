import React, { Component, ReactNode, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-lg w-full border-l-4 border-red-500">
            <h1 className="text-2xl font-bold mb-4">Application Error</h1>
            <p className="text-gray-300 mb-4">Something went wrong while rendering the application.</p>
            
            <div className="bg-black/50 p-4 rounded overflow-x-auto mb-6 text-sm font-mono text-red-400 max-h-40">
              {this.state.error?.toString() || "Unknown Error"}
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<div style="color:red; padding:20px;">Fatal Error: Could not find #root element.</div>';
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (e) {
  console.error("Failed to mount application:", e);
  // Fallback to manual DOM manipulation to show error if React fails completely
  rootElement.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #111; color: white; font-family: sans-serif;">
      <div style="max-width: 500px; padding: 2rem; background: #222; border-radius: 8px; border-left: 4px solid #ef4444;">
        <h1 style="margin-top: 0; color: #ef4444;">Fatal Startup Error</h1>
        <p>The application failed to start.</p>
        <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 4px; overflow: auto; color: #fca5a5;">${e}</pre>
        <p style="margin-top: 1rem; font-size: 0.9em; color: #888;">Check the console for more details.</p>
      </div>
    </div>
  `;
}