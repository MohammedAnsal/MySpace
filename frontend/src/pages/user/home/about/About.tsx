import Navbar from '../../../../components/layouts/Navbar';
import Footer from '../../../../components/layouts/Footer';
import Scroll from '@/components/global/Scroll';
import { HeroSection } from './components/HeroSection';
import { OurStory } from './components/OurStory';
import { OurMission } from './components/OurMission';
import { TeamSection } from './components/TeamSection';
import { QuoteSection } from './components/QuoteSection';
import { CTASection } from './components/CTASection';

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#E2E1DF]">
        <HeroSection />
        <OurStory />
        <OurMission />
        <TeamSection />
        <QuoteSection />
        <CTASection />
      </main>
      <Scroll />
      <Footer />
    </>
  );
}
