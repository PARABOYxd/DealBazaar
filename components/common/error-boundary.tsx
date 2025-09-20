'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);

        // Log to error reporting service
        if (process.env.NODE_ENV === 'production') {
            // Example: Send to error reporting service
            // errorReportingService.captureException(error, { extra: errorInfo });
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md"
                    >
                        <Card className="card-elevated">
                            <CardContent className="p-8 text-center space-y-6">
                                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                                    <AlertTriangle className="w-8 h-8 text-destructive" />
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-2xl font-bold text-foreground">
                                        Oops! Something went wrong
                                    </h1>
                                    <p className="text-muted-foreground">
                                        We encountered an unexpected error. Don't worry, our team has been notified.
                                    </p>
                                </div>

                                {process.env.NODE_ENV === 'development' && this.state.error && (
                                    <div className="p-4 bg-muted rounded-lg text-left">
                                        <p className="text-sm font-mono text-destructive">
                                            {this.state.error.message}
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        onClick={this.handleRetry}
                                        className="flex-1 btn-primary"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Try Again
                                    </Button>
                                    <Button
                                        onClick={this.handleGoHome}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <Home className="w-4 h-4 mr-2" />
                                        Go Home
                                    </Button>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    Error ID: {Date.now().toString(36)}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook for error handling in functional components
export function useErrorHandler() {
    const handleError = (error: Error, errorInfo?: any) => {
        console.error('Error handled:', error, errorInfo);

        // You can add error reporting logic here
        if (process.env.NODE_ENV === 'production') {
            // Send to error reporting service
        }
    };

    return { handleError };
}
