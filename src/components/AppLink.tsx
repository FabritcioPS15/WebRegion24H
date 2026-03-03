'use client';

/**
 * AppLink - Universal link component that works in both Vite (react-router-dom)
 * and Next.js environments without crashing either.
 *
 * Strategy:
 * - If we can import and use react-router-dom's Link, we do (Vite).
 * - If no Router context is present, fall back to a plain <a> tag (Next.js).
 */

import React, { useContext } from 'react';

// Dynamically detect if we are inside a react-router-dom RouterContext
// by checking if the UNSAFE_NavigationContext is available at runtime.
let RouterContext: React.Context<any> | null = null;
let RouterLink: React.ComponentType<any> | null = null;

try {
    // These will exist in the bundle (react-router-dom is installed)
    // but we only USE them if we are inside a Router.
    const rrdom = require('react-router-dom');
    RouterLink = rrdom.Link;
    RouterContext = rrdom.UNSAFE_NavigationContext;
} catch (_) {
    // react-router-dom not available at all – use plain anchor
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

    // Fallback: plain anchor that works in Next.js
    return (
        <a href={to} className={className} onClick={onClick}>
            {children}
        </a>
    );
}
