/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SeoDisplay.tsx
'use client';

import { useTeacher } from '@/context/TeacherContext';
import { useState } from 'react';

export function SeoDisplay() {
  const { seo, teacher, host, home } = useTeacher();
  const [isOpen, setIsOpen] = useState(true);

  if (!seo && !teacher) {
    return (
      <div className="fixed bottom-4 left-4 bg-yellow-500/90 text-white p-4 rounded-lg z-50">
        No SEO data available
      </div>
    );
  }

  // ✅ دالة لعرض القيم بشكل جميل
  const renderValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500 italic">null</span>;
    }
    if (typeof value === 'string' && value.startsWith('http')) {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline break-all"
        >
          {value}
        </a>
      );
    }
    if (typeof value === 'object') {
      return (
        <pre className="text-xs whitespace-pre-wrap bg-gray-800 p-2 rounded">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    return <span className="text-green-400">{String(value)}</span>;
  };

  // ✅ تجميع كل بيانات الـ SEO في مجموعة واحدة
  const seoData = {
    '📋 Basic Info': {
      'Teacher Name': teacher?.name || 'N/A',
      'Teacher Email': teacher?.email || 'N/A',
      'Host': host || 'N/A',
      'Sub Domain': teacher?.sub_domain || 'N/A',
      'Theme': teacher?.theme || 'N/A',
    },
    '📝 SEO Meta': {
      'SEO Title': seo?.seo_title,
      'SEO Description': seo?.seo_description,
      'SEO Keywords': seo?.seo_keywords,
      'Site Name': seo?.site_name,
      'Site Title': seo?.site_title,
      'Site Description': seo?.site_description,
      'Site URL': seo?.site_url,
      'Site Keywords': seo?.site_keywords,
      'Default Language': seo?.default_language,
      'Language': seo?.language,
    },
    '🖼️ Open Graph (OG)': {
      'OG Title': seo?.og_title,
      'OG Description': seo?.og_description,
      'OG Image': seo?.og_image,
      'OG Type': seo?.og_type,
      'OG URL': seo?.og_url,
      'OG Site Name': seo?.og_site_name,
      'OG Image Width': seo?.og_image_width,
      'OG Image Height': seo?.og_image_height,
    },
    '🐦 Twitter Card': {
      'Twitter Card': seo?.twitter_card,
      'Twitter Username': seo?.twitter_username,
    },
    '🔗 Social Links': {
      'Facebook Page': (seo as any)?.facebook_page, // ✅ استخدام as any
      'Facebook App ID': (seo as any)?.facebook_app_id, // ✅ استخدام as any
      'Instagram URL': (seo as any)?.instagram_url, // ✅ استخدام as any
      'YouTube URL': (seo as any)?.youtube_url, // ✅ استخدام as any
      'LinkedIn URL': (seo as any)?.linkedin_url, // ✅ استخدام as any
    },
    '📊 Analytics': {
      'Google Analytics ID': seo?.google_analytics_id,
      'Google Tag Manager ID': seo?.google_tag_manager_id,
      'Facebook Pixel ID': seo?.facebook_pixel_id,
      'Clarity ID': seo?.clarity_id,
    },
    '🌍 Geo Tags': {
      'Geo Region': seo?.geo_region,
      'Geo Placename': seo?.geo_placename,
      'Geo Position': seo?.geo_position,
      'Geo ICBM': seo?.geo_icbm,
    },
    '🔗 Canonical & Manifest': {
      'Canonical URL': seo?.canonical_url,
      'Manifest JSON': seo?.manifest_json,
      'Browserconfig XML': seo?.browserconfig_xml,
    },
    '🎨 Favicons': {
      'Favicon': seo?.favicon,
      'Favicon SVG': seo?.favicon_svg,
      'Favicon 16x16': seo?.favicon_16,
      'Favicon 32x32': seo?.favicon_32,
      'Favicon Apple': seo?.favicon_apple,
      'Favicon Android': seo?.favicon_android,
      'Favicon MS': seo?.favicon_ms,
    },
    '🏠 Home Page': {
      'Home Title': home?.title,
      'Home Title (AR)': home?.title_ar,
      'Home Sub Title': home?.sub_title,
      'Home Sub Title (AR)': home?.sub_title_ar,
      'Home Description': home?.description,
      'Home Description (AR)': home?.description_ar,
      'Home Image': home?.imageUrl,
    },
    '📅 Dates': {
      
      'Teacher Created At': teacher?.createdAt,
    },
  };

  // ✅ عرض الصور
  const renderImages = () => {
    const images = [];
    
    if (seo?.og_image) {
      images.push({ label: 'OG Image', url: seo.og_image });
    }
    if (seo?.favicon) {
      images.push({ label: 'Favicon', url: seo.favicon });
    }
    if (seo?.favicon_svg) {
      images.push({ label: 'Favicon SVG', url: seo.favicon_svg });
    }
    if (seo?.favicon_32) {
      images.push({ label: 'Favicon 32x32', url: seo.favicon_32 });
    }
    if (seo?.favicon_16) {
      images.push({ label: 'Favicon 16x16', url: seo.favicon_16 });
    }
    if (seo?.favicon_apple) {
      images.push({ label: 'Favicon Apple', url: seo.favicon_apple });
    }
    if (seo?.favicon_android) {
      images.push({ label: 'Favicon Android', url: seo.favicon_android });
    }
    if (home?.imageUrl) {
      images.push({ label: 'Home Image', url: home.imageUrl });
    }
    if (teacher?.imageUrl) {
      images.push({ label: 'Teacher Image', url: teacher.imageUrl });
    }

    if (images.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="font-bold text-sm mb-2 text-purple-400">🖼️ Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {images.map((img, index) => (
            <div key={index} className="bg-gray-800 rounded p-2">
              <p className="text-xs text-gray-400 mb-1">{img.label}</p>
              <img 
                src={img.url} 
                alt={img.label}
                className="w-full h-20 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=No+Image';
                }}
              />
              <a 
                href={img.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 truncate block mt-1"
              >
                {img.url.substring(0, 40)}...
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-4xl max-h-[90vh] overflow-auto">
      <div className="bg-gray-900/95 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-green-400">
            🔍 SEO Data {seo ? '✅' : '❌'}
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded"
          >
            {isOpen ? '📕' : '📗'}
          </button>
        </div>

        {isOpen && (
          <div className="space-y-4 text-xs">
            {/* Images Section */}
            {renderImages()}

            {/* All Data Sections */}
            {Object.entries(seoData).map(([section, data]) => {
              const hasData = Object.values(data).some(v => v !== null && v !== undefined);
              if (!hasData) return null;

              return (
                <div key={section} className="border-t border-gray-700 pt-2">
                  <h3 className="font-bold text-sm mb-1 text-yellow-400">{section}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {Object.entries(data).map(([key, value]) => {
                      if (value === null || value === undefined) return null;
                      return (
                        <div key={key} className="flex items-start gap-1 py-0.5">
                          <span className="text-gray-400 min-w-[100px]">{key}:</span>
                          <span className="text-green-300 break-all">
                            {renderValue(value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Raw JSON */}
            <div className="border-t border-gray-700 pt-2">
              <h3 className="font-bold text-sm mb-1 text-purple-400">📦 Raw SEO Data</h3>
              <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(seo, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}