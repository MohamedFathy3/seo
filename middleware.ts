// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ✅ قائمة الـ subdomains للتوجيه
// المفتاح: الـ subdomain الحالي, القيمة: الـ subdomain المستهدف
const REDIRECT_MAP: Record<string, string> = {
  'drahmedhusseinbi': 'drahmedhusseinbio',
  // يمكنك إضافة المزيد هنا
  // 'example': 'example-target',
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // ✅ جلب الـ host من الـ headers
  const host = request.headers.get('host') || '';
  const cleanHost = host.split(':')[0].trim().toLowerCase();
  
  console.log(`🌐 Host: ${host}, Path: ${url.pathname}`);
  
  // ✅ 1. استثناء الملفات الثابتة
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js|json)$/) ||
      url.pathname === '/favicon.ico' ||
      url.pathname === '/manifest.json' ||
      url.pathname === '/robots.txt' ||
      url.pathname === '/sitemap.xml') {
    return NextResponse.next();
  }
  
  // ✅ 2. استثناء الـ API Routes
  if (url.pathname.startsWith('/api')) {
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
    return NextResponse.next();
  }

  // ✅ 5. استخراج الـ subdomain من الـ host
  const parts = cleanHost.split('.');
  
  // ✅ 6. لو في subdomain (عدد الأجزاء > 2)
  if (parts.length > 2) {
    const subdomain = parts[0];
    
    // ✅ التأكد أن subdomain ليس رقم
    if (!isNaN(Number(subdomain))) {
      console.log(`⚠️ Invalid subdomain (number): ${subdomain}, skipping`);
      return NextResponse.next();
    }
    
    console.log(`🔍 Subdomain detected: ${subdomain}`);
    
    // ✅ ✅ ✅ التحقق من الـ Redirect Map
    if (REDIRECT_MAP[subdomain]) {
      const targetSubdomain = REDIRECT_MAP[subdomain];
      const targetHost = cleanHost.replace(subdomain, targetSubdomain);
      
      console.log(`🔄 Redirecting from ${subdomain} to ${targetSubdomain}`);
      
      // ✅ بناء URL الجديد
      const newUrl = new URL(url);
      newUrl.host = targetHost;
      newUrl.hostname = targetHost;
      
      console.log(`🔄 Redirecting to: ${newUrl.toString()}`);
      
      // ✅ إعادة توجيه دائمة (301 Moved Permanently)
      return NextResponse.redirect(newUrl, 301);
    }
    
    // ✅ حفظ الـ host الكامل في headers (للمسارات العادية)
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
    
    return NextResponse.rewrite(newUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$|.*\\.json$|manifest.json|robots.txt|sitemap.xml).*)',
  ],
};