import Link from 'next/link';
import Image from 'next/image';
import HeroWithHalo from '@/components/HeroWithHalo';

export default function HeroSection() {
  return (
    <section role="banner" aria-label="Hero" className="relative min-h-[90vh] md:min-h-[85vh] flex items-center pt-20 md:pt-24 px-4 md:px-margin-desktop text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-[#6b8aff] via-[#2F6FE4] to-[#0f2d6e]"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#f59e0b]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>
      <div className="max-w-container-max mx-auto relative z-10 w-full py-12 md:py-20">
        <div className="flex flex-col items-center text-center gap-6 md:hidden">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#f59e0b] w-fit rounded-full">
            <span className="material-symbols-outlined text-[#1a3fa0] text-lg">military_tech</span>
            <span className="text-[#1a3fa0] font-bold text-sm">الدفعة الخامسة — يونيو 2026</span>
          </div>
          <h1 className="text-[13vw] sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.2] tracking-tight">
            من <span className="text-[#f59e0b]">مستهلك</span> للتكنولوجيا
            <br />إلى <span className="text-[#f59e0b]">صانع</span> ومطور و<span className="text-[#f59e0b]">قائد</span>
          </h1>
          <p className="text-white/60 text-lg font-medium">Tech Makers • Building Future Tech Leaders</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { age: '8–11', color: 'bg-emerald-500' },
              { age: '12–15', color: 'bg-blue-500' },
              { age: '16–20', color: 'bg-purple-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <div className={`w-2.5 h-2.5 ${item.color} rounded-full`}></div>
                <span className="font-bold text-sm">{item.age} سنة</span>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-center gap-1.5 w-full mt-2">
            <Link href="/#plans" className="inline-flex items-center justify-center gap-1 bg-[#f59e0b] text-[#1a3fa0] px-2.5 py-1.5 rounded-full font-black text-xs shadow-lg shadow-[#f59e0b]/30 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-sm">app_registration</span>
              سجّل الآن
            </Link>
            <Link href="/tracks" className="inline-flex items-center justify-center gap-1 border-2 border-white/30 text-white px-2.5 py-1.5 rounded-full font-bold text-xs hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-sm">explore</span>
              استكشف المسارات
            </Link>
          </div>
        </div>
        <div className="hidden md:grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-6 order-1 lg:order-1">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#f59e0b] w-fit rounded-full">
              <span className="material-symbols-outlined text-[#1a3fa0] text-lg">military_tech</span>
              <span className="text-[#1a3fa0] font-bold text-sm">الدفعة الخامسة — يونيو 2026</span>
            </div>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.2] tracking-tight">
              من <span className="text-[#f59e0b]">مستهلك</span> للتكنولوجيا
              <br />إلى <span className="text-[#f59e0b]">صانع</span> ومطور و<span className="text-[#f59e0b]">قائد</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-medium">Tech Makers • Building Future Tech Leaders</p>
            <div className="flex flex-wrap gap-3">
              {[
                { age: '8–11', color: 'bg-emerald-500' },
                { age: '12–15', color: 'bg-blue-500' },
                { age: '16–20', color: 'bg-purple-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                  <div className={`w-2.5 h-2.5 ${item.color} rounded-full`}></div>
                  <span className="font-bold text-sm">{item.age} سنة</span>
                </div>
              ))}
            </div>
            <div className="flex flex-row gap-2 mt-2">
              <Link href="/#plans" className="inline-flex items-center justify-center gap-1.5 bg-[#f59e0b] text-[#1a3fa0] px-5 py-2.5 rounded-full font-black text-sm shadow-xl shadow-[#f59e0b]/30 hover:scale-105 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-base">app_registration</span>
                سجّل الآن
              </Link>
              <Link href="/tracks" className="inline-flex items-center justify-center gap-1.5 border-2 border-white/30 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-white/10 transition-all">
                <span className="material-symbols-outlined text-base">explore</span>
                استكشف المسارات
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center order-2 lg:order-2">
            <HeroWithHalo />
          </div>
        </div>
      </div>
    </section>
  );
}
