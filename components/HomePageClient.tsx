// components/HomePageClient.tsx
'use client';

import { useSafeTeacher } from '@/context/TeacherContext';

export default function HomePageClient() {
  const { teacher, seo, home } = useSafeTeacher();
  
  if (!teacher) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold">{home?.title || teacher?.name || 'مرحباً'}</h1>
      </div>
    </div>
  );
}