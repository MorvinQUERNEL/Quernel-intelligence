import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { SectionTitle } from '../ui/SectionTitle';

const testimonials = [
  {
    name: 'Sophie Martin',
    role: 'Gérante, Restaurant Le Gourmet',
    image: '/api/placeholder/80/80',
    content: 'Le chatbot a complètement transformé notre gestion des réservations. Nos clients adorent pouvoir réserver à n\'importe quelle heure, et nous avons réduit nos appels de 70%. L\'équipe de QUERNEL a été à l\'écoute et très professionnelle.',
    rating: 5,
    color: '#00F0FF',
  },
  {
    name: 'Thomas Dubois',
    role: 'CEO, TechStartup.io',
    image: '/api/placeholder/80/80',
    content: 'Notre site e-commerce est passé de 0 à 50K€ de CA mensuel en 6 mois grâce à leur solution de relance panier IA. Le ROI est incroyable et l\'accompagnement au top. Je recommande vivement !',
    rating: 5,
    color: '#7C3AED',
  },
  {
    name: 'Marie Lefebvre',
    role: 'Trader indépendante',
    image: '/api/placeholder/80/80',
    content: 'Le bot de trading a été développé exactement selon mes stratégies. L\'équipe a pris le temps de comprendre mes besoins et le résultat dépasse mes attentes. Le dashboard est clair et les alertes Telegram sont super pratiques.',
    rating: 5,
    color: '#10B981',
  },
  {
    name: 'Jean-Pierre Moreau',
    role: 'Directeur, Agence Immo+',
    image: '/api/placeholder/80/80',
    content: 'Notre nouveau site vitrine est magnifique et très performant. Les leads arrivent naturellement grâce au SEO et le formulaire intelligent pré-qualifie les contacts. Un investissement rentabilisé en quelques mois.',
    rating: 5,
    color: '#00F0FF',
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="relative overflow-hidden">
      <div className="container-custom">
        <SectionTitle
          title="Témoignages"
          subtitle="Ce que nos clients disent de nous"
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-8 md:p-10" hover={false}>
                {/* Quote icon */}
                <div className="mb-6">
                  <svg
                    className="w-12 h-12 opacity-30"
                    style={{ color: testimonials[currentIndex].color }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Content */}
                <p className="text-lg md:text-xl text-[#F8FAFC] mb-8 leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {/* Avatar placeholder */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
                    style={{ backgroundColor: `${testimonials[currentIndex].color}20`, color: testimonials[currentIndex].color }}
                  >
                    {testimonials[currentIndex].name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[#F8FAFC] font-semibold">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-[#94A3B8] text-sm">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                  {/* Rating */}
                  <div className="ml-auto flex gap-1">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5"
                        style={{ color: testimonials[currentIndex].color }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-[#1A1F35] border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#00F0FF] hover:border-[#00F0FF]/50 transition-all"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-[#00F0FF] w-8'
                      : 'bg-[#94A3B8]/30 hover:bg-[#94A3B8]/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-[#1A1F35] border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#00F0FF] hover:border-[#00F0FF]/50 transition-all"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
