// app/[subdomain]/layout.tsx
import { Metadata } from 'next';
import { fetchTeacherDataForSSR } from '@/lib/teacher-data';
import { TeacherProvider } from '@/context/TeacherContext';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { Providers } from '../providers';

interface SubdomainLayoutProps {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}

// ✅ تعريف الأنواع الصحيحة لـ Open Graph
type ValidOgType = 'website' | 'article' | 'book' | 'profile' | 'video.movie' | 'music.song' | 'video.episode' | 'video.tv_show' | 'video.other' | 'music.album' | 'music.playlist' | 'music.radio_station';

// ✅ تعريف الأنواع الصحيحة لـ Twitter Card
type ValidTwitterCard = 'summary_large_image' | 'summary' | 'player' | 'app';

export async function generateMetadata({ params }: SubdomainLayoutProps): Promise<Metadata> {
  const { subdomain } = await params;
  
  const headersList = await headers();
  const fullHost = headersList.get('x-full-host') || headersList.get('host') || '';
  
  console.log(`📝 generateMetadata - Full Host: "${fullHost}", Subdomain: ${subdomain}`);
  
  const teacher = await fetchTeacherDataForSSR(fullHost);

  if (!teacher) {
    return {
      title: 'الصفحة غير موجودة',
      description: 'المعلم غير موجود',
    };
  }

  const seo = teacher?.website?.seo;
  const aboutSeo = teacher?.website?.about?.seo_setting;
  const home = teacher?.website?.home;
  
  const finalSeo = seo || aboutSeo;
  
  const title = finalSeo?.seo_title || 
                finalSeo?.site_title || 
                home?.title || 
                teacher.name || 
                'منصة تعليمية';
  
  const description = finalSeo?.seo_description || 
                      finalSeo?.site_description || 
                      home?.description || 
                      'منصة تعليمية متخصصة';
  
  const keywords = finalSeo?.seo_keywords || 
                   finalSeo?.site_keywords || 
                   'تعليم, منصة, مدرس';
  
  const ogTitle = finalSeo?.og_title || title;
  const ogDescription = finalSeo?.og_description || description;
  const ogImage = finalSeo?.og_image || 
                  home?.image?.fullUrl || 
                  teacher?.imageUrl || 
                  '';
  
  const favicon = finalSeo?.favicon || 
                  finalSeo?.favicon_32 || 
                  '/favicon.ico';

  // ✅ تصحيح og_type - استخدام النوع الصحيح
  let ogType: ValidOgType = 'website';
  const validOgTypes: ValidOgType[] = ['website', 'article', 'book', 'profile', 'video.movie', 'music.song', 'video.episode', 'video.tv_show', 'video.other', 'music.album', 'music.playlist', 'music.radio_station'];
  
  const rawOgType = finalSeo?.og_type || 'website';
  if (validOgTypes.includes(rawOgType as ValidOgType)) {
    ogType = rawOgType as ValidOgType;
  }

  // ✅ تصحيح twitter_card - استخدام النوع الصحيح
  let twitterCard: ValidTwitterCard = 'summary_large_image';
  const validTwitterCards: ValidTwitterCard[] = ['summary_large_image', 'summary', 'player', 'app'];
  
  const rawTwitterCard = finalSeo?.twitter_card || 'summary_large_image';
  if (validTwitterCards.includes(rawTwitterCard as ValidTwitterCard)) {
    twitterCard = rawTwitterCard as ValidTwitterCard;
  }

  return {
    title: title,
    description: description,
    keywords: keywords,
    
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
      type: ogType, // ✅ الآن النوع صحيح
      url: finalSeo?.og_url || `https://${fullHost}`,
      siteName: finalSeo?.og_site_name || teacher.name || 'Web-Lec',
    },
    
    twitter: {
      card: twitterCard, // ✅ الآن النوع صحيح
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
      site: finalSeo?.twitter_username ? `@${finalSeo.twitter_username}` : undefined,
      creator: finalSeo?.twitter_username ? `@${finalSeo.twitter_username}` : undefined,
    },
    
    icons: {
      icon: favicon,
      apple: finalSeo?.favicon_apple || favicon,
      shortcut: favicon,
    },
    
    other: {
      'geo.region': finalSeo?.geo_region || '',
      'geo.placename': finalSeo?.geo_placename || '',
      'geo.position': finalSeo?.geo_position || '',
      'ICBM': finalSeo?.geo_icbm || '',
      'fb:app_id': finalSeo?.facebook_app_id || '',
    },
    
    manifest: finalSeo?.manifest_json || '/manifest.json',
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    
    alternates: {
      canonical: finalSeo?.canonical_url || `https://${fullHost}`,
    },
  };
}

export default async function SubdomainLayout({
  children,
  params,
}: SubdomainLayoutProps) {
  const { subdomain } = await params;

  const headersList = await headers();
  const fullHost = headersList.get('x-full-host') || headersList.get('host') || '';
  const finalHost = fullHost || `${subdomain}.web-lec.com`;

  console.log(`🏠 Layout - Subdomain: ${subdomain}, Full Host: "${finalHost}"`);

  const teacherData = await fetchTeacherDataForSSR(finalHost);

  if (!teacherData) {
    notFound();
  }

  // ✅ التحقق من وجود second_sub_domain
  const primaryDomain = teacherData.sub_domain?.toLowerCase();
  const secondaryDomain = teacherData.second_sub_domain?.toLowerCase();
  const currentDomain = finalHost.split(':')[0].toLowerCase();
  
  console.log(`🔍 Primary Domain: ${primaryDomain}`);
  console.log(`🔍 Secondary Domain: ${secondaryDomain}`);
  console.log(`🔍 Current Domain: ${currentDomain}`);

  // ✅ REDIRECT: إذا كان الـ current domain هو الـ primary domain
  // والـ secondary domain موجود، حول إلى الـ secondary domain
  if (secondaryDomain && currentDomain === primaryDomain) {
    console.log(`🔄 Redirecting from ${primaryDomain} to ${secondaryDomain}`);
    
    // ✅ إزالة الـ port من الـ host
    const cleanSecondaryDomain = secondaryDomain.split(':')[0];
    
    // ✅ بناء URL الجديد مع الحفاظ على المسار
    const pathname = headersList.get('x-pathname') || '';
    const newUrl = `https://${cleanSecondaryDomain}${pathname}`;
    
    console.log(`🔄 Redirecting to: ${newUrl}`);
    
    // ✅ إعادة التوجيه - استخدام 'replace' بدلاً من 308
    return redirect(newUrl, 'replace');
  }

  const teacherId = teacherData.id;
  console.log(`👨‍🏫 Teacher ID: ${teacherId}`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: teacherData.name,
    description: teacherData.website?.home?.description || 'منصة تعليمية',
    url: `https://${fullHost}`,
    email: teacherData.email,
    telephone: teacherData.phone,
    image: teacherData.imageUrl || '',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Providers>
        <TeacherProvider 
          initialData={teacherData} 
          host={fullHost}
        >
          <div className="min-h-screen">
            {children}
          </div>
        </TeacherProvider>
      </Providers>
    </>
  );
}