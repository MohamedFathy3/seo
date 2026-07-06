// components/SeoDebug.tsx
'use client';

import { useTeacher } from '@/context/TeacherContext';

export function SeoDebug() {
  const { seo, teacher, host } = useTeacher();
  
  // ✅ عرض في Console
  console.log('🔍 SEO Data:', seo);
  console.log('👨‍🏫 Teacher:', teacher);
  console.log('🌐 Host:', host);
  
  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg max-w-md text-xs z-50 overflow-auto max-h-96">
      <h3 className="font-bold text-sm mb-2 text-green-400">🔍 SEO Debug</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify({
          seo: seo || 'No SEO data',
          teacherName: teacher?.name,
          host: host,
          hasSeo: !!seo,
          seoKeys: seo ? Object.keys(seo) : [],
        }, null, 2)}
      </pre>
    </div>
  );
}