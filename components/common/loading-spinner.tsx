'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    text?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
            <motion.div
                className={cn(
                    'border-2 border-primary-200 border-t-primary-600 rounded-full',
                    sizeClasses[size]
                )}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <LoadingSpinner size="xl" />
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                >
                    <h3 className="text-lg font-semibold">Loading...</h3>
                    <p className="text-sm text-muted-foreground">Please wait while we prepare everything for you</p>
                </motion.div>
            </div>
        </div>
    );
}

export function SkeletonLoader({ className }: { className?: string }) {
    return (
        <div className={cn('animate-pulse bg-muted rounded', className)} />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="card-elevated overflow-hidden">
            <SkeletonLoader className="aspect-[4/3] w-full" />
            <div className="p-4 space-y-3">
                <SkeletonLoader className="h-4 w-3/4" />
                <SkeletonLoader className="h-3 w-full" />
                <SkeletonLoader className="h-3 w-2/3" />
                <div className="flex justify-between items-center pt-2">
                    <SkeletonLoader className="h-6 w-20" />
                    <SkeletonLoader className="h-8 w-24" />
                </div>
            </div>
        </div>
    );
}
