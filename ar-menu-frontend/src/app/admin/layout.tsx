'use client'; // Need client component for useEffect/useState

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { useRouter } from 'next/navigation'; // Import useRouter

interface RestaurantProfile {
  name?: string;
  logoUrl?: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
       // Redirect logic might be better handled by individual pages,
       // but basic check here is okay too.
       router.push('/admin/login');
       return;
    }

    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/restaurants/me`;
        const res = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });

        if (res.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/admin/login'); // Redirect if unauthorized
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to fetch profile for layout');
        }
        const data: RestaurantProfile = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile in layout:", error);
        // Handle error appropriately, maybe show a generic header
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [router]); // Add router to dependency array

  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass profile data to Header */}
        <Header profile={profile} loading={loadingProfile} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-dark p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}