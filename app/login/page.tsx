'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { validateEmail } from '@/utils/validation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      toast.error('Please enter a valid email address');
      return;
    }

    // Basic password validation
    if (password.length < 1) {
      setError('Please enter your password');
      setIsLoading(false);
      toast.error('Please enter your password');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      toast.success('Login successful!');
      localStorage.setItem('token', data.token);
      router.push('/search');
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://cdn.pixabay.com/photo/2024/01/15/17/41/ai-generated-8510610_1280.jpg')`
        }}
      />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-white text-6xl font-bold leading-tight">
            Volcanoes
          </h1>
          <h2 className="text-white text-6xl font-bold leading-tight">
            Visualizer
          </h2>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-lg">
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                placeholder="Enter Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                placeholder="Enter Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gray-500 hover:bg-gray-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="text-center mt-4">
              <Link href="/signup" className="text-sm text-gray-600 hover:text-gray-800">
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}