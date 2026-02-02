import { useState } from 'react';
import { motion } from 'framer-motion';

type FormData = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
};

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const projectTypes = [
  { value: '', label: 'Sélectionner...' },
  { value: 'site-vitrine', label: 'Site vitrine' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'agent-ia', label: 'Agent IA' },
  { value: 'bot-trading', label: 'Bot de trading' },
  { value: 'automatisation', label: 'Automatisation' },
  { value: 'autre', label: 'Autre' },
];

const budgetOptions = [
  { value: '', label: 'Sélectionner...' },
  { value: '<500', label: 'Moins de 500€' },
  { value: '500-1000', label: '500€ - 1 000€' },
  { value: '1000-2000', label: '1 000€ - 2 000€' },
  { value: '>2000', label: 'Plus de 2 000€' },
];

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
    w-full px-0 py-4 bg-transparent border-0 border-b border-border
    text-text-primary placeholder:text-text-muted
    focus:outline-none focus:border-accent
    transition-colors duration-300
    font-light
  `;

  const selectClasses = `
    w-full px-0 py-4 bg-transparent border-0 border-b border-border
    text-text-primary
    focus:outline-none focus:border-accent
    transition-colors duration-300
    font-light appearance-none cursor-pointer
  `;

  return (
    <section id="contact" className="relative bg-bg-primary overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm text-accent">005</span>
              <div className="h-px w-12 bg-accent" />
              <span className="font-mono text-xs text-text-muted tracking-wider">CONTACT</span>
            </div>

            <h2 className="text-text-primary mb-8">
              PARLONS<br />
              <span className="text-accent">PROJET</span>
            </h2>

            <p className="text-text-secondary text-lg mb-12 max-w-md">
              Décrivez votre projet, on vous rappelle sous 24h avec des solutions concrètes. Aucun engagement, devis gratuit.
            </p>

            {/* Contact info */}
            <div className="space-y-8">
              {[
                {
                  label: 'EMAIL',
                  value: 'contact@quernel-intelligence.com',
                  href: 'mailto:contact@quernel-intelligence.com',
                },
                {
                  label: 'BASÉS EN',
                  value: 'Île-de-France (91)',
                },
                {
                  label: 'ENGAGEMENT',
                  value: 'Réponse garantie sous 24h',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <span className="font-mono text-xs text-text-muted block mb-2">
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-text-primary hover:text-accent transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-text-primary">{item.value}</span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Decorative */}
            <motion.div
              className="mt-16 hidden lg:block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="w-32 h-32 border border-border relative">
                <div className="absolute inset-4 border border-accent/30" />
                <div className="absolute inset-8 border border-accent/10" />
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {status === 'success' ? (
              <motion.div
                className="h-full flex flex-col items-center justify-center text-center py-20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-20 h-20 border border-accent flex items-center justify-center mb-8">
                  <span className="text-accent text-3xl">✓</span>
                </div>
                <h3 className="text-text-primary mb-4">BIEN REÇU !</h3>
                <p className="text-text-secondary">
                  On analyse votre projet et on vous recontacte sous 24h avec des propositions concrètes.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name & Email row */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="font-mono text-xs text-text-muted block mb-2">
                      NOM COMPLET <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jean Dupont"
                      required
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-text-muted block mb-2">
                      EMAIL <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jean@exemple.com"
                      required
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Phone & Project type row */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="font-mono text-xs text-text-muted block mb-2">
                      TÉLÉPHONE
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="06 12 34 56 78"
                      className={inputClasses}
                    />
                  </div>
                  <div className="relative">
                    <label className="font-mono text-xs text-text-muted block mb-2">
                      TYPE DE PROJET <span className="text-accent">*</span>
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      required
                      className={selectClasses}
                    >
                      {projectTypes.map((type) => (
                        <option key={type.value} value={type.value} className="bg-bg-primary">
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-0 top-1/2 translate-y-1 text-text-muted pointer-events-none">
                      ↓
                    </span>
                  </div>
                </div>

                {/* Budget */}
                <div className="relative">
                  <label className="font-mono text-xs text-text-muted block mb-2">
                    BUDGET ESTIMÉ
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className={selectClasses}
                  >
                    {budgetOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-bg-primary">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-0 top-1/2 translate-y-1 text-text-muted pointer-events-none">
                    ↓
                  </span>
                </div>

                {/* Message */}
                <div>
                  <label className="font-mono text-xs text-text-muted block mb-2">
                    MESSAGE <span className="text-accent">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre projet en quelques mots : vos objectifs, vos défis actuels, vos questions..."
                    rows={4}
                    required
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                {/* Error message */}
                {status === 'error' && (
                  <p className="text-error font-mono text-sm">
                    Oups ! Un problème technique. Réessayez ou écrivez-nous directement par email.
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-5 bg-accent text-bg-primary font-mono text-sm tracking-wider hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'ENVOI EN COURS...' : 'ENVOYER MA DEMANDE'}
                </button>

                {/* Reassurance */}
                <p className="text-text-muted text-xs text-center mt-4">
                  Vos données restent confidentielles. Aucun engagement.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <span className="font-display text-[30vw] leading-none text-white">
          05
        </span>
      </div>
    </section>
  );
}
