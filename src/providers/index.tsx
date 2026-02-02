"use client";

import { ReactNode, Suspense } from "react";
import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SWRConfig } from "swr";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * SWR configuration for data fetching
 */
const swrConfig = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
  errorRetryCount: 2,
};

/**
 * Root providers wrapper - add all providers here
 * Suspense boundary is needed for useSearchParams in AuthProvider
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <SWRConfig value={swrConfig}>
        <ThemeProvider>
          <Suspense fallback={null}>
            <AuthProvider>{children}</AuthProvider>
          </Suspense>
        </ThemeProvider>
      </SWRConfig>
    </ErrorBoundary>
  );
}
