// app/layout.tsx
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { fetchTeacherDataForSSR } from '@/lib/teacher-data';
import { TeacherProvider } from '@/context/TeacherContext';
import { Providers } from './providers';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  const teacher = await fetchTeacherDataForSSR(host);
  
  const seo = teacher?.website?.seo;
  const aboutSeo = teacher?.website?.about?.seo_setting;
  const finalSeo = seo || aboutSeo;
  
  const favicon = finalSeo?.favicon || 
                  finalSeo?.favicon_32 || 
                  finalSeo?.favicon_svg || 
                  '/favicon.ico';
  
  const faviconApple = finalSeo?.favicon_apple || favicon;
  
  return {
    title: finalSeo?.seo_title || teacher?.name || 'منصة تعليمية',
    description: finalSeo?.seo_description || 'منصة تعليمية متخصصة',
    
    icons: {
      icon: [
        { url: favicon, sizes: 'any' },
        { url: finalSeo?.favicon_16 || favicon, sizes: '16x16', type: 'image/png' },
        { url: finalSeo?.favicon_32 || favicon, sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: faviconApple, sizes: '180x180', type: 'image/png' },
      ],
      other: [
        { rel: 'manifest', url: finalSeo?.manifest_json || '/manifest.json' },
      ],
    },
    
    openGraph: {
      title: finalSeo?.og_title || teacher?.name || 'منصة تعليمية',
      description: finalSeo?.og_description || 'منصة تعليمية متخصصة',
      images: [finalSeo?.og_image || ''],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {/* ✅ إضافة TeacherProvider و Providers */}
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}