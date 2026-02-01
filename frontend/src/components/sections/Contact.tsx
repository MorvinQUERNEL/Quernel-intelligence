import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { SectionTitle } from '../ui/SectionTitle';

type FormData = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
};

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          budget: '',
          message: '',
        });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClasses = `
    w-full px-4 py-3 rounded-xl
    bg-[#1A1F35]/50 border border-white/10
    text-[#F8FAFC] placeholder:text-[#94A3B8]/50
    focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/30
    transition-all duration-300
  `;

  return (
    <section id="contact" className="relative overflow-hidden">
      <div className="container-custom">
        <SectionTitle
          title="Contactez-nous"
          subtitle="Prêt à démarrer votre projet ? Parlons-en !"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#F8FAFC] mb-4 font-[var(--font-orbitron)]">
                Discutons de votre projet
              </h3>
              <p className="text-[#94A3B8] leading-relaxed">
                Que vous ayez une idée précise ou simplement une vision, notre équipe est là pour
                vous accompagner. Remplissez le formulaire et nous vous recontacterons sous 24h.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#94A3B8] text-sm">Email</p>
                  <a href="mailto:contact@quernel-intelligence.com" className="text-[#F8FAFC] hover:text-[#00F0FF] transition-colors">
                    contact@quernel-intelligence.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#94A3B8] text-sm">Localisation</p>
                  <p className="text-[#F8FAFC]">Vigneux-sur-Seine (91270)</p>
                </div>
              </div>

              {/* Response time */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#94A3B8] text-sm">Délai de réponse</p>
                  <p className="text-[#F8FAFC]">Sous 24h ouvrées</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="p-6 md:p-8" hover={false}>
              {status === 'success' ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#F8FAFC] mb-2 font-[var(--font-orbitron)]">
                    Message envoyé !
                  </h3>
                  <p className="text-[#94A3B8]">
                    Nous vous recontacterons dans les plus brefs délais.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-[#94A3B8] text-sm mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-[#94A3B8] text-sm mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                        placeholder="jean@exemple.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-[#94A3B8] text-sm mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                    <div>
                      <label htmlFor="projectType" className="block text-[#94A3B8] text-sm mb-2">
                        Type de projet *
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                      >
                        <option value="">Sélectionner...</option>
                        <option value="site-vitrine">Site vitrine</option>
                        <option value="e-commerce">E-commerce</option>
                        <option value="application-web">Application web</option>
                        <option value="refonte">Refonte de site</option>
                        <option value="agent-ia">Agent IA / Chatbot</option>
                        <option value="trading-bot">Bot de trading</option>
                        <option value="automatisation">Automatisation</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-[#94A3B8] text-sm mb-2">
                      Budget estimé
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={inputClasses}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="moins-500">Moins de 500€</option>
                      <option value="500-1000">500€ - 1000€</option>
                      <option value="1000-2000">1000€ - 2000€</option>
                      <option value="2000-5000">2000€ - 5000€</option>
                      <option value="plus-5000">Plus de 5000€</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[#94A3B8] text-sm mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className={`${inputClasses} resize-none`}
                      placeholder="Décrivez votre projet..."
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-400 text-sm">
                      Une erreur est survenue. Veuillez réessayer.
                    </p>
                  )}

                  <GlowButton
                    type="submit"
                    className="w-full"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        Envoyer le message
                      </>
                    )}
                  </GlowButton>
                </form>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
