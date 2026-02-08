import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppAuth } from '@/context/AuthContext';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { state } = useAppAuth();

  useEffect(() => {
    if (state.isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [state.isLoggedIn, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
};

export default HomePage;