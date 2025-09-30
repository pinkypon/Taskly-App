// components/ErrorBoundary.tsx
import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: string | null;
}

export default class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        // Log error details
        console.error("Error caught by boundary:", error);
        console.error("Error info:", errorInfo);

        this.setState({
            errorInfo: errorInfo.componentStack,
        });

        // Optional: Send to error tracking service (e.g., Sentry)
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
        window.location.reload();
    };

    handleGoHome = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            const isChunkError =
                this.state.error?.message?.includes("chunk") ||
                this.state.error?.message?.includes("Loading");

            return (
                <div className="flex items-center justify-center min-h-screen bg-white px-4 py-12">
                    <div className="max-w-md text-center">
                        {/* Main heading - matching NotFound style */}
                        <h1 className="text-7xl font-extrabold text-indigo-600 mb-4">
                            Oops!
                        </h1>

                        {/* Subtitle */}
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            {isChunkError
                                ? "Failed to load page"
                                : "Something went wrong"}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 mb-6">
                            {isChunkError
                                ? "Unable to load this page. This might be due to a poor connection or outdated cache."
                                : "An unexpected error occurred. Please try again."}
                        </p>

                        {/* Error details (dev mode only) */}
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mb-6 text-left bg-gray-50 rounded p-3">
                                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 font-medium">
                                    Show error details
                                </summary>
                                <pre className="mt-2 text-xs text-gray-700 overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}

                        {/* Action buttons - matching NotFound button style */}
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
                            >
                                Reload page
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded hover:bg-gray-300 transition"
                            >
                                Go back home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
