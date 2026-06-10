import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Tech Makers Egypt — Building Future Tech Leaders',
  description: 'من مستهلك للتكنولوجيا إلى صانع ومطور وقائد',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <div className="brand">
              <img src="/logo.png" alt="TKA Logo" className="brand-logo" />
              <span className="brand-name">TKA-Egypt</span>
            </div>
            <nav className="header-nav">
              <Link href="/">الرئيسية</Link>
              <Link href="/about">من نحن</Link>
              <Link href="/certificate">التحقق من الشهادة</Link>
              <Link href="/join">انضم الينا</Link>
            </nav>
            <Link href="/join" className="header-cta">
              <span className="header-tag">انضم لفريق العمل</span>
            </Link>
          </div>
          <div className="funding-strip">
            <span className="funding-dot"></span>
            مدعوم جزئياً من <strong>TKA-Egypt</strong>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="footer-brand">
              <img src="/logo.png" alt="TKA Logo" className="footer-logo" />
              <span className="brand-name">TKA-Egypt</span>
            </div>
            <div className="footer-text">
              <p>© 2026 <strong>Tech Makers Egypt</strong> — بالشراكة مع <strong>TKA-Egypt</strong></p>
              <p className="footer-funding">مدعوم جزئياً من TKA-Egypt لتأهيل جيل المستقبل التكنولوجي</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
