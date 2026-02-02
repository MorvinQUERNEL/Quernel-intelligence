import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PageTransition } from './components/layout/PageTransition';
import { CookieBanner } from './components/CookieBanner';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PricingPage } from './pages/PricingPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { MentionsLegales } from './pages/MentionsLegales';
import { PolitiqueConfidentialite } from './pages/PolitiqueConfidentialite';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <HomePage />
          </PageTransition>
        } />
        <Route path="/services" element={
          <PageTransition>
            <ServicesPage />
          </PageTransition>
        } />
        <Route path="/tarifs" element={
          <PageTransition>
            <PricingPage />
          </PageTransition>
        } />
        <Route path="/faq" element={
          <PageTransition>
            <FAQPage />
          </PageTransition>
        } />
        <Route path="/contact" element={
          <PageTransition>
            <ContactPage />
          </PageTransition>
        } />
        <Route path="/mentions-legales" element={
          <PageTransition>
            <MentionsLegales />
          </PageTransition>
        } />
        <Route path="/confidentialite" element={
          <PageTransition>
            <PolitiqueConfidentialite />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-bg-primary text-text-primary">
        {/* Noise texture overlay */}
        <div className="noise" />

        {/* Layout */}
        <Navbar />

        <main className="relative z-10">
          <AnimatedRoutes />
        </main>

        <Footer />

        {/* RGPD Cookie Consent Banner */}
        <CookieBanner />
      </div>
    </Router>
  );
}

export default App;
