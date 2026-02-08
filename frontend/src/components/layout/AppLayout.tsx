import React from 'react';
import Head from 'next/head';
import NavigationHeader from '@/components/layout/NavigationHeader';

interface AppLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ title, description = '', children }) => {
  return (
    <>
      <Head>
        <title>{title} - Todo App</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavigationHeader />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Todo App. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AppLayout;