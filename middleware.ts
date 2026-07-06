// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ✅ قائمة الـ subdomains المعروفة (للتجربة السريعة)
const DOMAIN_MAPPING: Record<string, string> = {
  'mrmahmoudade.web-lec.com': 'mrmahmoudadel.web-lec.com',
  // يمكنك إضافة المزيد هنا
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get('host') || '';
  
  console.log(`🌐 Host: ${host}, Path: ${url.pathname}`);
  
  // ✅ 1. استثناء الـ API Routes
  if (url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // ✅ 2. استثناء الملفات الثابتة
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js)$/)) {
    return NextResponse.next();
  }

  // ✅ 3. استثناء الملفات الـ _next
  if (url.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // ✅ 4. استثناء صفحات المصادقة
  if (url.pathname.startsWith('/login') || 
      url.pathname.startsWith('/register') ||
      url.pathname.startsWith('/forgot-password') ||
      url.pathname.startsWith('/reset-password')) {
    console.log(`🔐 Auth page detected: ${url.pathname}, serving directly`);
    return NextResponse.next();
  }

  // ✅ 5. تنظيف الـ host من الـ port
  const cleanHost = host.split(':')[0].trim().toLowerCase();
  
  console.log(`🔍 Clean Host: ${cleanHost}`);
  
  // ✅ 6. التحقق من الـ mapping (للحالات المعروفة)
  if (DOMAIN_MAPPING[cleanHost]) {
    const targetDomain = DOMAIN_MAPPING[cleanHost];
    console.log(`🔄 Redirecting from ${cleanHost} to ${targetDomain}`);
    
    // ✅ بناء URL الجديد مع الحفاظ على المسار
    const newUrl = new URL(`https://${targetDomain}${url.pathname}`);
    
    // ✅ إضافة Query Parameters
    url.searchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value);
    });
    
    console.log(`🔄 Redirecting to: ${newUrl.toString()}`);
    
    // ✅ إعادة توجيه دائمة (301 Moved Permanently)
    return NextResponse.redirect(newUrl, 301);
  }

  // ✅ 7. جلب بيانات المعلم من API للتحقق الديناميكي
  try {
    const response = await fetch(`https://web-lec.com/api/${encodeURIComponent(cleanHost)}`);
    const data = await response.json();
    
    if (data.status === 200 && data.data) {
      const teacher = data.data;
      const primaryDomain = teacher.sub_domain?.toLowerCase().trim();
      const secondaryDomain = teacher.second_sub_domain?.toLowerCase().trim();
      
      console.log(`🔍 Primary Domain: ${primaryDomain}`);
      console.log(`🔍 Secondary Domain: ${secondaryDomain}`);
      
      // ✅ إذا كان المستخدم على الـ secondary domain، حوله للـ primary
      if (secondaryDomain && cleanHost === secondaryDomain && primaryDomain) {
        console.log(`🔄 Redirecting from ${secondaryDomain} to ${primaryDomain}`);
        
        const newUrl = new URL(`https://${primaryDomain}${url.pathname}`);
        url.searchParams.forEach((value, key) => {
          newUrl.searchParams.set(key, value);
        });
        
        console.log(`🔄 Redirecting to: ${newUrl.toString()}`);
        return NextResponse.redirect(newUrl, 301);
      }
    }
  } catch (error) {
    console.error('❌ Error fetching teacher data:', error);
  }

  // ✅ 8. استخراج الـ subdomain من الـ host
  const parts = cleanHost.split('.');
  
  // ✅ 9. لو في subdomain (عدد الأجزاء > 2)
  if (parts.length > 2) {
    const subdomain = parts[0];
    
    console.log(`🔍 Subdomain detected: ${subdomain}`);
    
    // ✅ حفظ الـ host الكامل والمسار في headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-full-host', host);
    requestHeaders.set('x-subdomain', subdomain);
    requestHeaders.set('x-pathname', url.pathname);
    
    // ✅ بناء URL الجديد
    let newPath = '';
    if (url.pathname === '/') {
      newPath = `/${subdomain}`;
    } else {
      newPath = `/${subdomain}${url.pathname}`;
    }
    
    console.log(`🔄 Rewriting to: ${newPath}`);
    
    const newUrl = new URL(newPath, request.url);
    
    // ✅ إعادة الكتابة مع الـ headers
    return NextResponse.rewrite(newUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  // ✅ 10. لو مفيش subdomain، اعرض الصفحة العادية
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
  ],
};