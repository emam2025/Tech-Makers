'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function CertificatePrintPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!canvasRef.current || window.innerWidth < 1024) return;
      const { left, top, width, height } = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      canvasRef.current.style.transform = `perspective(1000px) rotateY(${x * 2}deg) rotateX(${-y * 2}deg)`;
    };

    const handleMouseLeave = () => {
      if (!canvasRef.current) return;
      canvasRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
      canvasRef.current.style.transition = 'transform 0.5s ease';
    };

    const handleMouseEnter = () => {
      if (!canvasRef.current) return;
      canvasRef.current.style.transition = 'none';
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      canvas.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
        canvas.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, []);

  return (
    <div className="bg-surface-container-low min-h-screen flex flex-col p-md font-ibm-plex-arabic" dir="ltr">
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          .certificate-canvas { 
            box-shadow: none !important; 
            border: none !important; 
            width: 100% !important; 
            height: 100vh !important;
            transform: none !important;
          }
        }
        .certificate-canvas {
          aspect-ratio: 1.414 / 1;
          max-width: 1120px;
          margin: auto;
          position: relative;
          background: #ffffff;
          overflow: hidden;
        }
        .border-pattern {
          position: absolute;
          inset: 12px;
          border: 2px solid #002045;
          pointer-events: none;
        }
        .border-inner {
          position: absolute;
          inset: 24px;
          border: 1px solid #775a19;
          pointer-events: none;
        }
        .corner-decoration {
          position: absolute;
          width: 120px;
          height: 120px;
          border: 8px solid #002045;
        }
        .top-left { top: 0; left: 0; border-right: none; border-bottom: none; }
        .top-right { top: 0; right: 0; border-left: none; border-bottom: none; }
        .bottom-left { bottom: 0; left: 0; border-right: none; border-top: none; }
        .bottom-right { bottom: 0; right: 0; border-left: none; border-top: none; }
        .guilloche-bg {
          background-image: radial-gradient(circle at 2px 2px, rgba(0,32,69,0.03) 1px, transparent 0);
          background-size: 24px 24px;
        }
      `}</style>

      {/* Header Actions */}
      <header className="no-print w-full max-w-container-max mx-auto flex justify-between items-center mb-xl">
        <button 
          className="flex items-center gap-xs text-primary font-bold hover:underline transition-all"
          onClick={() => window.history.back()}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Dashboard
        </button>
        <div className="flex gap-sm">
          <button 
            className="flex items-center gap-xs bg-primary text-on-primary px-md py-sm rounded-lg font-bold hover:opacity-90 transition-all shadow-sm"
            onClick={() => window.print()}
          >
            <span className="material-symbols-outlined">print</span>
            Print Certificate
          </button>
          <button className="flex items-center gap-xs border border-primary text-primary px-md py-sm rounded-lg font-bold hover:bg-primary-fixed transition-all">
            <span className="material-symbols-outlined">download</span>
            Download PDF
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        {/* Certificate Canvas */}
        <article 
          ref={canvasRef}
          className="certificate-canvas shadow-xl ring-1 ring-outline-variant p-xl flex flex-col items-center justify-between text-center guilloche-bg"
        >
          {/* Corner Decorative Elements */}
          <div className="corner-decoration top-left"></div>
          <div className="corner-decoration top-right"></div>
          <div className="corner-decoration bottom-left"></div>
          <div className="corner-decoration bottom-right"></div>
          
          {/* Structural Borders */}
          <div className="border-pattern"></div>
          <div className="border-inner"></div>

          {/* Header Section */}
          <section className="z-10 w-full pt-lg">
            <div className="flex flex-col items-center gap-sm">
              <div className="relative w-48 h-20">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuASodrZ8hZasnhvLHal1e2CHEsdQosd3dt7I39ncokmSD4isr1tk_Kq9Of2VOBR0H5xEYTm0wBZNdxu8jP-XCBAwQJX62qYULb8_9mjkSsOkczHXlhtEmpwi6tc1dDY8FR68Fxmsx2sX4O2dj6mBSq8g-LLNqTuhKwXAP5Gx9V9KTfuDhF-J5l10SHNbelH9uZ_Dwf84mWIQGY-HT9BuUcLtd--evekbSnFSv_oAif7hZAbqe8emDfalUk5wocKAJrEFpZcoCOPHt0"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="space-y-xs mt-2">
                <h1 className="text-2xl text-primary uppercase tracking-widest font-bold">TKA-Egypt</h1>
                <p className="text-[10px] text-secondary tracking-[0.3em] uppercase font-bold">Academy of Institutional Excellence</p>
              </div>
            </div>
          </section>

          {/* Body Section */}
          <section className="z-10 w-full px-xl space-y-md">
            <div className="space-y-sm">
              <p className="text-lg text-on-surface-variant italic font-serif">This is to certify that</p>
              <h2 className="text-4xl text-primary font-bold border-b-2 border-outline-variant inline-block px-xl pb-xs">
                Ahmed Mustafa Hassan
              </h2>
            </div>
            <div className="space-y-sm pt-md">
              <p className="text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                has successfully fulfilled all requirements and demonstrated academic proficiency in the professional certification program of
              </p>
              <h3 className="text-2xl text-secondary font-bold uppercase tracking-wide">
                Advanced AI & Programming
              </h3>
              <p className="text-xs text-on-surface-variant">
                Conducted by TKA-Egypt Academy, confirming the recipient's expertise and commitment to technical innovation.
              </p>
            </div>
          </section>

          {/* Footer Section */}
          <section className="z-10 w-full grid grid-cols-3 items-end pb-lg px-xl">
            {/* Date & ID */}
            <div className="text-left space-y-xs">
              <div className="border-b border-outline-variant w-40 pb-xs">
                <p className="text-sm text-on-surface font-bold">October 24, 2024</p>
              </div>
              <label className="text-xs text-on-surface-variant">Date of Issuance</label>
              <p className="text-xs text-primary font-bold mt-sm">ID: TKA-2024-8842</p>
            </div>

            {/* Seal */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-secondary-fixed flex items-center justify-center bg-white dark:bg-surface shadow-sm overflow-hidden relative">
                  <Image 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsI3An6yBqcmFCon_UeV4IRCHsgGZYRBuggWWZ5sbtqgDmyJqUVuILv5kURMHJ9RYUL_BnXjq2oOHJ45L2Ocl-NezG4ucE2qs4bTCDwT4-wjjHjgfb6BgOBYS2VdbWGIJMxfxhCdiy_r_aO3Byh0XG2JHRG2WEBAzKK6nRMmGCOHL2Dvwm1mUCc0Ci6TmPTtxElUkfB0lcHEpr2msDjZ6vo34jHv2qvBsxAgjuxANzIAZWiB9xBU7qIf1Drlz5tXcX7CdMwpoy0r0"
                    alt="Seal"
                    fill
                    className="object-cover p-4 opacity-80"
                  />
                </div>
                <div className="absolute -bottom-2 w-full text-center">
                  <span className="bg-primary text-white text-[8px] px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">OFFICIAL SEAL</span>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="text-right space-y-xs flex flex-col items-end">
              <div className="border-b border-outline-variant w-48 pb-xs relative h-12">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOQGmarLQMulaUXAEKY7AOVBiyVObFwj9lcDVY5kMNRre9rMAj5LwTPC5Udh0OXnbUD9ePilDSQ_J4-fNkiVNlZTsc3l8ljkKid2UbF-Gl1g_8bBZm_CHvJcDwhiLhPjKRRHNgmVFAgbh9SVC3PSNsD2_gkLxjJQlvl2TfCTMiVpuAQBd2p14K_pLtnNbgCndsLMTIy4AHiqIwautEkHZw2Z3jyP5_mWdOW8ByHLPEtFHj3vllmOvJQM5DJprX_7gVxhQZlZOGLc8"
                  alt="Signature"
                  fill
                  className="object-contain filter brightness-0"
                />
              </div>
              <label className="text-sm text-on-surface font-bold">Dr. Youssef El-Menshawy</label>
              <p className="text-[10px] text-on-surface-variant">Academic Director, TKA-Egypt</p>
            </div>
          </section>

          {/* Verification Metadata */}
          <aside className="absolute bottom-6 left-6 z-10 flex items-center gap-md">
            <div className="bg-white dark:bg-surface p-1 border border-outline-variant rounded relative w-16 h-16">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvjjU5OYrbI38WN48gw37ypVb22nYK1xdn8C-qPPuQTQtw9X9THe-JCcsZoCPrTzC-OzCHiE-QvnwlOFYVkEbrXwv_WaBF37dAzEw--oieW7qMBtiA-Rz_59wrCayTGBLKbiiwR8XMtaLexEwjnBDVySejZrmdSt_esdYdCywIhAJmUsTbolWwzSiQalg5Q6UVZwnzLNhHQSUkfcjKFhfON7J63tjtHlzC_CQQ1NOtpA5psqqwvUGOr_J1nZiPqf3SWsATRZ1p_6I"
                alt="QR"
                fill
                className="object-cover grayscale opacity-80"
              />
            </div>
            <div className="text-left">
              <p className="text-[9px] text-on-surface-variant leading-tight">
                Verify at: <br/>
                <span className="text-primary font-bold">verify.tka-egypt.com/cert/8842</span>
              </p>
            </div>
          </aside>
        </article>
      </main>

      {/* Footer Area */}
      <footer className="no-print w-full py-xl px-8 grid grid-cols-1 md:grid-cols-4 gap-lg mx-auto max-w-container-max mt-xl border-t border-outline-variant">
        <div className="space-y-md">
          <h4 className="text-xl font-bold text-primary">TKA-Egypt</h4>
          <p className="text-xs text-on-surface-variant">Institutional Excellence in Higher Education and Professional Development across the MENA region.</p>
        </div>
        <div className="flex flex-col gap-sm">
          <h5 className="text-xs text-primary uppercase font-bold">Quick Links</h5>
          <Link href="#" className="text-xs text-on-surface-variant hover:text-secondary transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-xs text-on-surface-variant hover:text-secondary transition-colors">Terms of Service</Link>
        </div>
        <div className="flex flex-col gap-sm">
          <h5 className="text-xs text-primary uppercase font-bold">Support</h5>
          <Link href="#" className="text-xs text-on-surface-variant hover:text-secondary transition-colors">Contact Support</Link>
          <Link href="#" className="text-xs text-on-surface-variant hover:text-secondary transition-colors">Career Opportunities</Link>
        </div>
        <div className="space-y-md">
          <p className="text-xs text-on-surface-variant">© 2024 TKA-Egypt Academy. All Rights Reserved.</p>
          <div className="flex gap-md">
            <span className="material-symbols-outlined text-primary-fixed-dim hover:text-primary cursor-pointer">language</span>
            <span className="material-symbols-outlined text-primary-fixed-dim hover:text-primary cursor-pointer">mail</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
