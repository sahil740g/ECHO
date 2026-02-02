import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={40} />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>

            {/* Description */}
            <p className="text-zinc-400 mb-8">
              We encountered an unexpected error. Don't worry, your data is
              safe. Try refreshing the page or going back home.
            </p>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRefresh}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition"
              >
                <RefreshCw size={16} />
                Refresh Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-lg font-medium transition"
              >
                <Home size={16} />
                Go Home
              </button>
            </div>

            {/* Error details (development only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                <p className="text-red-400 text-sm font-mono break-all">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-zinc-500 text-xs mt-2 overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
