import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-saffron-500/20 text-saffron-500 flex items-center justify-center mb-4">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Kadamb Kanan Das Portal</h2>
          <p className="text-slate-400 text-sm max-w-md mb-6">
            A temporary session error occurred. Click below to clear cache and reload the portal cleanly.
          </p>
          <button
            onClick={this.handleReset}
            className="gradient-saffron text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Reset & Reload Portal
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
