/* eslint-disable @typescript-eslint/no-explicit-any */
// app/[subdomain]/page.tsx
'use client';

import { useSafeTeacher } from '@/context/TeacherContext';
import { useState } from 'react';

export default function SubdomainPage() {
  const { seo, teacher, host, home, stages, courses, features } = useSafeTeacher();
  const [activeTab, setActiveTab] = useState('seo');

  // ✅ التحقق من وجود البيانات (لتفادي مشكلة Prerendering)
  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  // ✅ دالة لعرض القيم بشكل جميل
  const renderValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500 italic">غير محدد</span>;
    }
    if (typeof value === 'string' && value.startsWith('http')) {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline break-all"
        >
          {value}
        </a>
      );
    }
    if (typeof value === 'object') {
      return (
        <pre className="text-xs whitespace-pre-wrap bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    return <span className="text-gray-800 dark:text-gray-200">{String(value)}</span>;
  };

  // ✅ تجميع بيانات الـ Title و Description الأساسية
  const titleData = [
    { label: 'عنوان الصفحة (SEO Title)', value: seo?.seo_title, icon: '📝' },
    { label: 'عنوان الموقع (Site Title)', value: seo?.site_title, icon: '🏷️' },
    { label: 'عنوان الصفحة الرئيسية', value: home?.title, icon: '🏠' },
    { label: 'عنوان الصفحة الرئيسية (عربي)', value: home?.title_ar, icon: '🌙' },
  ];

  const descriptionData = [
    { label: 'وصف الصفحة (SEO Description)', value: seo?.seo_description, icon: '📄' },
    { label: 'وصف الموقع (Site Description)', value: seo?.site_description, icon: '📋' },
    { label: 'وصف الصفحة الرئيسية', value: home?.description, icon: '📖' },
    { label: 'وصف الصفحة الرئيسية (عربي)', value: home?.description_ar, icon: '📕' },
  ];

  const ogData = [
    { label: 'عنوان المشاركة (OG Title)', value: seo?.og_title, icon: '🖼️' },
    { label: 'وصف المشاركة (OG Description)', value: seo?.og_description, icon: '📝' },
    { label: 'صورة المشاركة (OG Image)', value: seo?.og_image, icon: '🖼️' },
    { label: 'نوع المشاركة (OG Type)', value: seo?.og_type, icon: '📌' },
    { label: 'رابط المشاركة (OG URL)', value: seo?.og_url, icon: '🔗' },
    { label: 'اسم الموقع (OG Site Name)', value: seo?.og_site_name, icon: '🏷️' },
  ];

  // ✅ عرض بيانات SEO المهمة في أعلى الصفحة
  const getMainTitle = () => {
    return seo?.seo_title || seo?.site_title || home?.title || teacher?.name || 'منصة تعليمية';
  };

  const getMainDescription = () => {
    return seo?.seo_description || seo?.site_description || home?.description || 'منصة تعليمية متخصصة';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 md:p-8">
        
        {/* ✅ MAIN TITLE & DESCRIPTION - عرض كبير في الأعلى */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎯</span>
            <h2 className="text-sm font-medium text-blue-200">SEO Title & Description</h2>
          </div>
          
          {/* ✅ العنوان الرئيسي */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4 break-words">
            {getMainTitle()}
          </h1>
          
          {/* ✅ الوصف الرئيسي */}
          <p className="text-lg md:text-xl text-blue-100 mb-4 break-words">
            {getMainDescription()}
          </p>
          
          {/* ✅ معلومات إضافية */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-blue-400/30">
            <div className="flex items-center gap-2">
              <span className="text-blue-200">👨‍🏫</span>
              <span className="text-blue-100">{teacher?.name || 'المعلم'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-200">🌐</span>
              <span className="text-blue-100">{host}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-200">📧</span>
              <span className="text-blue-100">{teacher?.email}</span>
            </div>
          </div>
        </div>

        {/* ✅ Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'titles', label: '📝 العناوين', count: titleData.filter(d => d.value).length },
            { id: 'descriptions', label: '📄 الأوصاف', count: descriptionData.filter(d => d.value).length },
            { id: 'og', label: '🖼️ Open Graph', count: ogData.filter(d => d.value).length },
            { id: 'seo', label: '📊 كل البيانات', count: Object.keys(seo || {}).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ✅ Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          
          {/* ✅ العناوين (Titles) */}
          {activeTab === 'titles' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">📝 العناوين (Titles)</h2>
              <div className="grid grid-cols-1 gap-4">
                {titleData.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium text-lg mt-1">
                      {renderValue(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ الأوصاف (Descriptions) */}
          {activeTab === 'descriptions' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">📄 الأوصاف (Descriptions)</h2>
              <div className="grid grid-cols-1 gap-4">
                {descriptionData.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 text-base mt-1">
                      {renderValue(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Open Graph */}
          {activeTab === 'og' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">🖼️ Open Graph</h2>
              
              {/* ✅ عرض صورة OG */}
              {seo?.og_image && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">معاينة الصورة:</p>
                  <img 
                    src={seo.og_image} 
                    alt="OG Image"
                    className="max-w-full max-h-64 rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=No+Image';
                    }}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ogData.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {renderValue(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ كل بيانات الـ SEO */}
          {activeTab === 'seo' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">📊 كل بيانات الـ SEO</h2>
              
              {/* ✅ عرض الـ Title والـ Description بشكل مميز */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">🎯 العنوان الرئيسي</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">{getMainTitle()}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">📄 الوصف الرئيسي</p>
                  <p className="text-gray-800 dark:text-white">{getMainDescription()}</p>
                </div>
              </div>
              
              <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-auto max-h-96 text-xs">
                {JSON.stringify(seo, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* ✅ Home Page Info */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">🏠 معلومات الصفحة الرئيسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">العنوان</p>
              <p className="text-gray-800 dark:text-gray-200 font-medium text-lg">{home?.title || 'غير محدد'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">العنوان (عربي)</p>
              <p className="text-gray-800 dark:text-gray-200 font-medium text-lg">{home?.title_ar || 'غير محدد'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">الوصف</p>
              <p className="text-gray-800 dark:text-gray-200 text-base">{home?.description || 'غير محدد'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">الوصف (عربي)</p>
              <p className="text-gray-800 dark:text-gray-200 text-base">{home?.description_ar || 'غير محدد'}</p>
            </div>
          </div>
          {home?.imageUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">صورة الصفحة الرئيسية:</p>
              <img 
                src={home.imageUrl} 
                alt={home.title || 'Home'}
                className="max-w-full max-h-64 rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
            </div>
          )}
        </div>

        {/* ✅ Teacher Info */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">👨‍🏫 معلومات المعلم</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">الاسم</p>
              <p className="text-gray-800 dark:text-gray-200 font-medium">{teacher?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">البريد الإلكتروني</p>
              <p className="text-gray-800 dark:text-gray-200">{teacher?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">رقم الهاتف</p>
              <p className="text-gray-800 dark:text-gray-200">{teacher?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">النطاق الفرعي</p>
              <p className="text-gray-800 dark:text-gray-200">{teacher?.sub_domain}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">الثيم</p>
              <p className="text-gray-800 dark:text-gray-200">{teacher?.theme}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">الحالة</p>
              <p className={`font-medium ${teacher?.active ? 'text-green-600' : 'text-red-600'}`}>
                {teacher?.active ? '✅ نشط' : '❌ غير نشط'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}