import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>Page Not Found - Todo App</title>
        <meta name="description" content="Page not found" />
      </Head>

      <main className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-9xl font-bold text-gray-400">404</h1>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Page not found</h2>
            <p className="mt-4 text-base text-gray-500">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/dashboard">
              <span className="text-primary-600 hover:text-primary-500 font-medium cursor-pointer">
                Go back home
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;