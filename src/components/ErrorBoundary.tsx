"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service in production
    if (process.env.NODE_ENV === "production") {
      // Could send to Sentry, LogRocket, etc.
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🥒</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Oops! We&apos;re in a pickle
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Something went wrong. Don&apos;t worry, it happens to the best of
              us.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={this.handleReset} variant="primary">
                Try Again
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
              >
                Go Home
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-rose-600 dark:text-rose-400 overflow-auto">
                  {this.state.error.message}
                  {"\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

