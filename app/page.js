import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import TracksSection from '@/components/TracksSection';
import ResultsSection from '@/components/ResultsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import PricingSection from '@/components/PricingSection';

export const metadata = {
  title: 'Tech Makers Egypt — الدفعة الخامسة 2026',
  description: 'برنامج Tech Makers Egypt — الدفعة الخامسة 2026. برنامج تدريبي مصري للأطفال والناشئين من 8 إلى 20 سنة في البرمجة والذكاء الاصطناعي.',
  openGraph: {
    title: 'Tech Makers Egypt — الدفعة الخامسة 2026',
    description: 'برنامج تدريبي مصري للأطفال والناشئين من 8 إلى 20 سنة — يحوّل حب التكنولوجيا لمشاريع حقيقية.',
    url: 'https://tka-egypt.com',
  },
};

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <StatsSection />
      <TracksSection />
      <ResultsSection />
      <TestimonialsSection />
      <FAQSection />
      <PricingSection />
    </main>
  );
}
