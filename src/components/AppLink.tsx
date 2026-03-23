'use client';

/**
 * AppLink - Universal link component that works in both Vite (react-router-dom)
 * and Next.js environments without crashing either.
 */

import React, { useContext } from 'react';
import Link from 'next/link';

// Dynamically detect if we are inside a react-router-dom RouterContext
let RouterContext: React.Context<any> | null = null;
let RouterLink: React.ComponentType<any> | null = null;

try {
    const rrdom = require('react-router-dom');
    RouterLink = rrdom.Link;
    RouterContext = rrdom.UNSAFE_NavigationContext;
} catch (_) {
    // react-router-dom not available
}

interface AppLinkProps {
    to: string;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    children: React.ReactNode;
}

export default function AppLink({ to, className, onClick, children }: AppLinkProps) {
    // Detect whether we are inside a Router context at render time
    const routerCtx = RouterContext ? useContext(RouterContext) : null;
    const hasRouter = Boolean(routerCtx?.navigator);

    if (hasRouter && RouterLink) {
        return (
            <RouterLink to={to} className={className} onClick={onClick}>
                {children}
            </RouterLink>
        );
    }

    // Default for Next.js: Use next/link
    return (
        <Link href={to} className={className} onClick={onClick}>
            {children}
        </Link>
    );
}
