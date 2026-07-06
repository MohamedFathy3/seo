// app/favicon.ico/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { fetchTeacherDataForSSR } from '@/lib/teacher-data';

export async function GET() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  // ✅ جلب بيانات المعلم
  const teacher = await fetchTeacherDataForSSR(host);
  
  // ✅ استخراج الـ Favicon
  const seo = teacher?.website?.seo;
  const aboutSeo = teacher?.website?.about?.seo_setting;
  const finalSeo = seo || aboutSeo;
  
  const faviconUrl = finalSeo?.favicon || 
                     finalSeo?.favicon_32 || 
                     '/favicon.ico';
  
  // ✅ إذا كان الـ Favicon من رابط خارجي
  if (faviconUrl.startsWith('http')) {
    try {
      const response = await fetch(faviconUrl);
      const buffer = await response.arrayBuffer();
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'image/x-icon',
          'Cache-Control': 'public, max-age=86400, immutable',
        },
      });
    } catch (error) {
      console.error('Error fetching favicon:', error);
    }
  }
  
  // ✅ إعادة توجيه إلى الـ Favicon الافتراضي
  return NextResponse.redirect('/favicon.ico');
}