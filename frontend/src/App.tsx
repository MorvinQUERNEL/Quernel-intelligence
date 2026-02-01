import { ParticleGrid } from './components/effects/ParticleGrid';
import { GlowCursor } from './components/effects/GlowCursor';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { ServicesWeb } from './components/sections/ServicesWeb';
import { ServicesIA } from './components/sections/ServicesIA';
import { Stats } from './components/sections/Stats';
import { HowItWorks } from './components/sections/HowItWorks';
import { UseCases } from './components/sections/UseCases';
import { Pricing } from './components/sections/Pricing';
import { Testimonials } from './components/sections/Testimonials';
import { FAQ } from './components/sections/FAQ';
import { Contact } from './components/sections/Contact';

function App() {
  return (
    <div className="relative min-h-screen bg-bg-primary">
      {/* Background Effects */}
      <ParticleGrid />
      <GlowCursor />

      {/* Layout */}
      <Header />

      <main>
        <Hero />
        <ServicesWeb />
        <ServicesIA />
        <Stats />
        <HowItWorks />
        <UseCases />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
