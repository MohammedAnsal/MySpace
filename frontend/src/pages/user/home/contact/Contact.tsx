import Navbar from '../../../../components/layouts/Navbar';
import Footer from '../../../../components/layouts/Footer';
import Scroll from '@/components/global/Scroll';
import { HeroSection } from './components/HeroSection';
import { ContactInfo } from './components/ContactInfo';
import { ContactForm } from './components/ContactForm';
import { MapSection } from './components/MapSection';
import { FAQSection } from './components/FAQSection';

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#E2E1DF]">
        <HeroSection />
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <ContactInfo />
              <ContactForm />
            </div>
          </div>
        </section>
        <MapSection />
        <FAQSection />
      </main>
      <Scroll />
      <Footer />
    </>
  );
}
