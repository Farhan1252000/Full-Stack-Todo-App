import React from 'react';
import { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default MyApp;