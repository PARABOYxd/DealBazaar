'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
    useEffect(() => {
        // Only run in production
        if (process.env.NODE_ENV !== 'production') return;

        // Web Vitals monitoring
        const reportWebVitals = (metric: any) => {
            // Send to analytics service
            console.log('Web Vital:', metric);

            // Example: Send to Google Analytics
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', metric.name, {
                    event_category: 'Web Vitals',
                    event_label: metric.id,
                    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                    non_interaction: true,
                });
            }
        };

        // Load web vitals library dynamically
        import('web-vitals')
            .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(reportWebVitals);
                getFID(reportWebVitals);
                getFCP(reportWebVitals);
                getLCP(reportWebVitals);
                getTTFB(reportWebVitals);
            })
            .catch((error) => {
                console.warn('Failed to load web-vitals:', error);
            });

        // Performance observer for custom metrics
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'navigation') {
                            const navEntry = entry as PerformanceNavigationTiming;
                            console.log('Navigation timing:', {
                                domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
                                loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
                                domInteractive: navEntry.domInteractive - navEntry.navigationStart,
                            });
                        }
                    }
                });

                observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
            } catch (error) {
                console.warn('PerformanceObserver not supported or failed:', error);
            }
        }

        // Memory usage monitoring (if available)
        try {
            if ('memory' in performance) {
                const memory = (performance as any).memory;
                console.log('Memory usage:', {
                    used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
                    total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
                    limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
                });
            }
        } catch (error) {
            console.warn('Memory monitoring not available:', error);
        }

        // Connection monitoring
        try {
            if ('connection' in navigator) {
                const connection = (navigator as any).connection;
                console.log('Connection info:', {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                });
            }
        } catch (error) {
            console.warn('Connection monitoring not available:', error);
        }
    }, []);

    return null;
}
