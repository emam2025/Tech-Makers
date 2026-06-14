import Link from 'next/link';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import RevealObserverClient from '@/components/RevealObserverClient';

export const metadata = {
  title: 'Tech Makers Egypt — Building Future Tech Leaders',
  description: 'من مستهلك للتكنولوجيا إلى صانع ومطور وقائد',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface font-body-md text-body-md min-h-dvh overflow-x-hidden">
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only">تخطي إلى المحتوى</a>
        <SiteHeader />
        <RevealObserverClient />

        <main id="main-content">{children}</main>

        <footer className="bg-on-background text-surface-bright py-8 md:py-10 px-margin-mobile md:px-margin-desktop w-full rtl">
          <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-start gap-5 md:gap-8">
            <div className="max-w-sm">
              <img src="/w-%20logo.png" alt="تك ميكرز" className="h-8 w-auto mb-4" />
              <p className="text-surface-variant/70 font-body-md text-xs leading-relaxed mb-4">
                مبادرة تعليمية رائدة تهدف إلى تمكين جيل الغد بأدوات التكنولوجيا المتقدمة وبناء عقليات مبتكرة قادرة على المنافسة عالمياً.
              </p>
              <div className="flex gap-2">
                <a className="text-surface-variant/70 hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="https://www.facebook.com/TKA.Egypt/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </a>
                <a className="text-surface-variant/70 hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="https://wa.me/201062540164" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a className="text-surface-variant/70 hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="https://www.instagram.com/tech.makers.egypt/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a className="text-surface-variant/70 hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="https://www.linkedin.com/company/techmakers/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 md:gap-16">
              <div>
                <h5 className="font-label-sm text-white mb-4 text-xs">الروابط السريعة</h5>
                <ul className="flex flex-col gap-1.5">
                  <li><Link href="/about" className="text-surface-variant/70 hover:text-secondary-fixed transition-colors text-xs">من نحن</Link></li>
                  <li><Link href="/tracks" className="text-surface-variant/70 hover:text-secondary-fixed transition-colors text-xs">المسارات التعليمية</Link></li>
                  <li><Link href="/#faq" className="text-surface-variant/70 hover:text-secondary-fixed transition-colors text-xs">الأسئلة الشائعة</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-label-sm text-white mb-4 text-xs">اتصل بنا</h5>
                <ul className="flex flex-col gap-1.5">
                  <li className="flex items-center gap-1.5 text-surface-variant/70 text-xs"><span className="material-symbols-outlined text-[10px]">mail</span> info@tka-egypt.com</li>
                  <li><a href="https://wa.me/201062540164" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-surface-variant/70 hover:text-secondary-fixed transition-colors text-xs"><span className="material-symbols-outlined text-[10px]">chat</span> 0106 254 0164</a></li>
                  <li className="flex items-center gap-1.5 text-surface-variant/70 text-xs"><span className="material-symbols-outlined text-[10px]">location_on</span> القاهرة، مصر</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-container-max mx-auto mt-10 pt-5 border-t border-outline-variant/10 text-center">
            <p className="text-surface-variant/70 text-[10px]">© 2026 TKA-Egypt. جميع الحقوق محفوظة.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
