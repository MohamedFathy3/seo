/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/teacher-data.ts
import api from "@/lib/api";

export interface SeoSettings {
  site_name?: string | null;
  site_title?: string | null;
  site_description?: string | null;
  site_url?: string | null;
  site_keywords?: string | null;
  default_language?: string | null;
  favicon?: string | null;
  favicon_svg?: string | null;
  favicon_32?: string | null;
  favicon_16?: string | null;
  favicon_apple?: string | null;
  favicon_android?: string | null;
  favicon_ms?: string | null;
  manifest_json?: string | null;
  browserconfig_xml?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  og_image_width?: string | null;
  og_image_height?: string | null;
  og_type?: string | null;
  og_url?: string | null;
  og_site_name?: string | null;
  geo_region?: string | null;
  geo_placename?: string | null;
  geo_position?: string | null;
  geo_icbm?: string | null;
  canonical_url?: string | null;
  language?: string | null;
  twitter_card?: string | null;
  facebook_app_id?: string | null;
  facebook_page?: string | null;
  twitter_username?: string | null;
  instagram_url?: string | null;
  youtube_url?: string | null;
  linkedin_url?: string | null;
  google_analytics_id?: string | null;
  google_tag_manager_id?: string | null;
  facebook_pixel_id?: string | null;
  clarity_id?: string | null;
  createdAt?: string | null;
}

export interface TeacherWebsiteData {
  id: number;
  name: string;
  name_ar?: string;
  email: string;
  site_url?: string | null;
  second_sub_domain?: string; // ✅ إضافة الحقل الجديد
  sub_domain: string;
  phone: string;
  active: boolean;
  theme?: string;
  backgroud_color?: string;
  font_color?: string;
  imageUrl?: string;
  logoUrl?: string;
  image?: {
    id: number;
    name: string;
    mimeType: string;
    size: number;
    authorId: number | null;
    previewUrl: string;
    fullUrl: string;
    createdAt: string | null;
  };
  logo?: any;
  website: {
    home: {
      title?: string;
      title_ar?: string;
      sub_title?: string;
      sub_title_ar?: string;
      description?: string;
      description_ar?: string;
      imageUrl?: string;
      image?: { fullUrl?: string };
    };
    features: any[];
    about: {
      id?: number;
      name?: string;
      description?: string;
      name_ar?: string;
      description_ar?: string;
      seo_setting?: SeoSettings;
      image?: any;
      imageUrl?: string;
    };
    stages: any[];
    subjects: any[];
    courses: any[];
    books: any[];
    footer: any;
    future?: any[];
    featured_courses: any[];
    centerHours?: any[];
    seo?: SeoSettings;
  };
  createdAt: string;
}

// ✅ دالة جلب البيانات بالـ host كامل
export const fetchTeacherByHost = async (host: string): Promise<TeacherWebsiteData> => {
  if (!host) {
    throw new Error('Host is required');
  }

  // ✅ تنظيف الـ host من الـ port (زي :3000)
  // ✅ مهم: لا نغير حالة الأحرف (لا نستخدم toLowerCase)
  const cleanHost = host.split(':')[0].trim();
  
  console.log(`📡 Fetching teacher for host: "${cleanHost}"`);
  
  // ✅ IMPORTANT: إرسال الـ host كامل كما هو
  const encodedHost = encodeURIComponent(cleanHost);
  console.log(`📡 Encoded host: "${encodedHost}"`);
  
  try {
    const response = await api.get(`/${encodedHost}`);
    const { data } = response;

    if (data.status !== 200) {
      throw new Error(data.message || `Failed to fetch teacher for host: ${cleanHost}`);
    }

    return data.data;
  } catch (error: any) {
    console.error(`❌ Error fetching teacher for host: ${cleanHost}`, error);
    throw error;
  }
};

// ✅ دالة جلب البيانات للـ SSR (بتشتغل من السيرفر)
export const fetchTeacherDataForSSR = async (host: string): Promise<TeacherWebsiteData | null> => {
  try {
    // ✅ مهم: لا نغير حالة الأحرف
    const cleanHost = host.split(':')[0].trim();
    console.log(`🏠 SSR: Fetching teacher for host: "${cleanHost}"`);
    
    const teacher = await fetchTeacherByHost(cleanHost);
    return teacher;
  } catch (error) {
    console.error('❌ SSR: Error fetching teacher data for host:', host, error);
    return null;
  }
};