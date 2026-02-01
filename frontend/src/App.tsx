import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services';
import { Pricing } from './components/sections/Pricing';
import { FAQ } from './components/sections/FAQ';
import { Contact } from './components/sections/Contact';

function App() {
  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary">
      {/* Grain texture overlay */}
      <div className="grain-overlay" />

      {/* Subtle background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="bg-gradient-blob-1" />
        <div className="bg-gradient-blob-2" />
      </div>

      {/* Layout */}
      <Header />

      <main className="relative z-10">
        <Hero />
        <Services />
        <Pricing />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
