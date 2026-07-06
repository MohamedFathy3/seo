/* eslint-disable @typescript-eslint/no-explicit-any */
// context/TeacherContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loading from '@/components/Landing';
import { fetchTeacherByHost, TeacherWebsiteData, SeoSettings } from '@/lib/teacher-data';

// ✅ إضافة useLang
const useLang = () => {
  const [lang, setLang] = useState('ar');
  return { lang };
};

interface TeacherContextValue {
  teacher: TeacherWebsiteData | null;
  subdomain: string;
  host: string;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  pick: (en?: string, ar?: string) => string;
  stages: any[];
  courses: any[];
  books: any[];
  features: any[];
  about: any;
  footer: any;
  future: any[];
  home: any;
  centerHours: any[];
  featured_courses: any[];
  initialDataLoaded?: boolean;
  seo: SeoSettings | null;
}

const TeacherContext = createContext<TeacherContextValue | undefined>(undefined);

const STATIC_PAGES = ['forgot-password', 'reset-password', 'login', 'register'];

interface TeacherProviderProps {
  children: ReactNode;
  initialData?: TeacherWebsiteData | null;
  host?: string;
  theme?: 'default' | 'nature';
  bgColor?: string;
  textColor?: string;
}

// ✅ القيم الافتراضية للـ Context
const DEFAULT_VALUE: TeacherContextValue = {
  teacher: null,
  subdomain: "",
  host: "",
  isLoading: false,
  error: null,
  refetch: () => {},
  pick: (en?: string, ar?: string) => en || ar || "",
  stages: [],
  courses: [],
  books: [],
  features: [],
  about: null,
  footer: null,
  future: [],
  home: null,
  centerHours: [],
  featured_courses: [],
  initialDataLoaded: false,
  seo: null,
};

export const TeacherProvider = ({ 
  children, 
  initialData = null,
  host: propHost,
  theme: propTheme,
  bgColor: propBgColor,
  textColor: propTextColor
}: TeacherProviderProps) => {
  const pathname = usePathname();
  const { lang } = useLang();
  
  const [isPageLoading, setIsPageLoading] = useState(!initialData);
  const [host, setHost] = useState<string>(propHost || '');
  const [subdomain, setSubdomain] = useState<string>('');
  const [themeLoaded, setThemeLoaded] = useState(!!initialData);

  // ✅ جيب الـ host و subdomain من المتصفح
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fullHost = window.location.hostname;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!propHost) setHost(fullHost);
      
      const parts = fullHost.split('.');
      if (parts.length > 2) {
        setSubdomain(parts[0]);
      }
    }
  }, [propHost]);

  const currentHost = propHost || host;
  const currentSubdomain = subdomain;
  const currentPath = pathname?.split('/').pop() || '';
  const isStaticPage = STATIC_PAGES.includes(currentPath);
  
  const shouldFetch = !!currentHost && !isStaticPage && !initialData;

  const {
    data: teacher,
    isLoading: isQueryLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['teacher', currentHost],
    queryFn: () => fetchTeacherByHost(currentHost!),
    enabled: shouldFetch,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    initialData: initialData || undefined,
  });

  const pick = (en?: string, ar?: string) => {
    if (!en && !ar) return "";
    if (lang === "ar") return ar || en || "";
    return en || ar || "";
  };

  // ✅ استخراج الـ SEO من البيانات
  const getSeoData = (): SeoSettings | null => {
    const teacherData = teacher || initialData;
    if (!teacherData) return null;
    
    if (teacherData.website?.seo) {
      return teacherData.website.seo;
    }
    
    if (teacherData.website?.about?.seo_setting) {
      return teacherData.website.about.seo_setting;
    }
    
    return null;
  };

  const safeData = {
    stages: teacher?.website?.stages || [],
    courses: teacher?.website?.courses || [],
    books: teacher?.website?.books || [],
    features: teacher?.website?.features || [],
    about: teacher?.website?.about || null,
    footer: teacher?.website?.footer || null,
    future: teacher?.website?.future || [],
    home: teacher?.website?.home || null,
    centerHours: teacher?.website?.centerHours || [],
    featured_courses: teacher?.website?.featured_courses || [],
    seo: getSeoData(),
  };

  // ✅ حفظ الثيم في localStorage
  useEffect(() => {
    const saveTheme = () => {
      const teacherId = teacher?.id || initialData?.id;
      
      if (teacherId) {
        console.log("🎯 Saving theme for teacher ID:", teacherId);
        
        try {
          localStorage.setItem('teacher-data', JSON.stringify({ id: teacherId }));
          
          const finalTheme = propTheme || 'default';
          const finalBgColor = propBgColor || '#FFFFFF';
          const finalTextColor = propTextColor || '#111827';
          
          console.log("📦 Saving to localStorage:", { 
            theme: finalTheme, 
            bgColor: finalBgColor, 
            textColor: finalTextColor 
          });
          
          localStorage.setItem('app-theme', finalTheme);
          localStorage.setItem('api-bg-color', finalBgColor);
          localStorage.setItem('api-text-color', finalTextColor);
          
          window.dispatchEvent(new CustomEvent('theme-updated', {
            detail: {
              theme: finalTheme,
              bgColor: finalBgColor,
              textColor: finalTextColor
            }
          }));
          
          setThemeLoaded(true);
          console.log("✅ Theme saved to localStorage successfully!");
        } catch (error) {
          console.error("❌ Error saving theme:", error);
        }
      } else {
        console.log("ℹ️ No teacherId available yet");
      }
    };
    
    saveTheme();
  }, [teacher?.id, initialData?.id, propTheme, propBgColor, propTextColor]);

  // ✅ تحسين عملية التحميل
  useEffect(() => {
    if (!isQueryLoading && shouldFetch) {
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPageLoading(false);
    }
  }, [isQueryLoading, shouldFetch, initialData]);

  useEffect(() => {
    if (isStaticPage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect 
      setIsPageLoading(false);
    }
  }, [isStaticPage]);

  const isLoading = isPageLoading && shouldFetch && isQueryLoading;

  if (isLoading) {
    return (
      <Loading 
        message={{
          ar: 'جاري تحميل المنصة...',
          en: 'Loading platform...'
        }}
        minDisplayTime={600}
      />
    );
  }

  if (error && shouldFetch && !initialData) {
    console.error("❌ TeacherProvider Error:", error);
    return (
      <div className="min-h-screen grid place-items-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-black mb-3 text-red-500">
            {lang === 'ar' ? 'حدث خطأ' : 'Error'}
          </h1>
          <p className="text-foreground/60 mb-4">
            {error?.message || (lang === 'ar' ? 'حدث خطأ ما' : 'Something went wrong')}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:scale-105 transition-transform"
          >
            {lang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  const finalTeacher = teacher || initialData;

  return (
    <TeacherContext.Provider
      value={{
        teacher: finalTeacher || null,
        subdomain: currentSubdomain || "",
        host: currentHost || "",
        isLoading: isLoading,
        error: error || null,
        refetch,
        pick,
        ...safeData,
        initialDataLoaded: !!initialData,
        seo: safeData.seo,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacher must be used within TeacherProvider");
  }
  return context;
};

// ✅ ✅ ✅ إصلاح useSafeTeacher - لا تستخدم useTeacher داخلياً
export const useSafeTeacher = (): TeacherContextValue => {
  const context = useContext(TeacherContext);
  if (!context) {
    // ✅ إرجاع القيم الافتراضية بدلاً من رمي خطأ
    return DEFAULT_VALUE;
  }
  return context;
};