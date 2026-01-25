import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bot,
  TrendingUp,
  Users,
  Sparkles,
  Star,
  ArrowRight,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Play,
  Zap,
  Shield,
  Globe,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { PricingSection } from "@/components/pricing/PricingSection"
import { backendApi } from "@/services/backend"

// Types
interface Agent {
  id: string
  name: string
  role: string
  description: string
  color: string
  gradient: string
  icon: React.ReactNode
}

interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  avatar: string
  rating: number
}

interface FAQItem {
  question: string
  answer: string
}

// Data - Les 3 Anges de QUERNEL INTELLIGENCE
const agents: Agent[] = [
  {
    id: "raphael",
    name: "Raphaël",
    role: "Assistant Général",
    description: "Ange guérisseur - Assistant polyvalent pour l'organisation, la rédaction et la productivité",
    color: "from-violet-500 to-purple-600",
    gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: "gabriel",
    name: "Gabriel",
    role: "Expert Marketing",
    description: "Ange messager - Stratégies marketing, SEO, contenu et communication digitale",
    color: "from-pink-500 to-rose-500",
    gradient: "bg-gradient-to-br from-pink-500 to-rose-500",
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    id: "michael",
    name: "Michaël",
    role: "Expert Commercial",
    description: "Ange protecteur - Vente, prospection, négociation et développement commercial",
    color: "from-emerald-500 to-green-600",
    gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
    icon: <Users className="w-6 h-6" />,
  },
]

const testimonials: Testimonial[] = [
  {
    name: "Marie Dubois",
    role: "Directrice Marketing",
    company: "TechStart SAS",
    content: "Gabriel a transformé notre approche marketing. Notre ROI publicitaire a doublé en 3 mois grâce à ses stratégies SEO et contenu. Un outil indispensable !",
    avatar: "MD",
    rating: 5,
  },
  {
    name: "Pierre Martin",
    role: "CEO",
    company: "LegalTech Pro",
    content: "Raphaël nous accompagne au quotidien. Son aide polyvalente nous fait gagner un temps précieux sur toutes nos tâches administratives.",
    avatar: "PM",
    rating: 5,
  },
  {
    name: "Sophie Laurent",
    role: "Responsable Commercial",
    company: "GrowthLab",
    content: "Michaël a révolutionné notre processus de prospection. Nos commerciaux sont 3x plus efficaces grâce aux scripts personnalisés.",
    avatar: "SL",
    rating: 5,
  },
  {
    name: "Thomas Bernard",
    role: "DAF",
    company: "FinanceFirst",
    content: "Les 3 anges travaillent en synergie : Raphaël organise, Gabriel communique, et Michaël conclut. Une équipe IA parfaite !",
    avatar: "TB",
    rating: 5,
  },
]

const faqItems: FAQItem[] = [
  {
    question: "Qu'est-ce que QUERNEL INTELLIGENCE ?",
    answer: "QUERNEL INTELLIGENCE est une plateforme SaaS française proposant 3 anges IA experts qui travaillent en synergie : Raphaël (assistant général), Gabriel (marketing) et Michaël (commercial).",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Toutes vos données sont hébergées en France, conformément au RGPD. Nous utilisons un chiffrement AES-256 de bout en bout et ne partageons jamais vos informations avec des tiers.",
  },
  {
    question: "Puis-je essayer gratuitement ?",
    answer: "Oui ! Vous pouvez tester notre démo interactive directement sur cette page sans créer de compte. Pour un accès complet, nous proposons une période d'essai de 7 jours.",
  },
  {
    question: "Combien coûte l'abonnement ?",
    answer: "Notre offre Pro est a 50eur/mois avec 7 jours d'essai gratuit. Elle inclut un acces illimite aux 3 Anges IA, le contexte partage entre agents, le support prioritaire, et 2M de tokens/mois.",
  },
  {
    question: "Les anges se partagent-ils des informations ?",
    answer: "Oui ! C'est notre force. Les 3 anges partagent un contexte utilisateur commun. Si vous parlez de votre entreprise à Raphaël, Gabriel et Michaël le sauront aussi.",
  },
  {
    question: "Quelle est la différence avec ChatGPT ?",
    answer: "Nos anges travaillent en synergie avec un contexte partagé. Ils sont spécialisés et optimisés pour les entreprises françaises. Ils se souviennent de vous et s'améliorent continuellement.",
  },
]

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Ultra Rapide",
    description: "Réponses en moins de 3 secondes grâce à notre infrastructure GPU dédiée",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "100% Français",
    description: "Données hébergées en France, conformité RGPD garantie",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "3 Anges IA",
    description: "Des experts qui travaillent en synergie avec un contexte partagé",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Disponible 24/7",
    description: "Vos assistants IA travaillent pour vous jour et nuit",
  },
]

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Components
interface LandingPageProps {
  onNavigateToLogin: () => void
  onNavigateToRegister: () => void
}

export function LandingPage({ onNavigateToLogin, onNavigateToRegister }: LandingPageProps) {
  const [isDark, setIsDark] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeAgent, setActiveAgent] = useState(agents[0])
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [demoMessage, setDemoMessage] = useState("")
  const [demoResponse, setDemoResponse] = useState("")
  const [isDemoTyping, setIsDemoTyping] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  // Demo chat - connected to real AI via webhook
  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!demoMessage.trim()) return

    setIsDemoTyping(true)
    setDemoResponse("")

    // System prompts for each angel
    const systemPrompts: Record<string, string> = {
      raphael: "Tu es Raphaël, l'ange guérisseur de QUERNEL INTELLIGENCE. Tu es un assistant polyvalent qui aide sur l'organisation, la rédaction et la productivité. Réponds en français de manière claire et bienveillante. Sois concis (max 3 phrases).",
      gabriel: "Tu es Gabriel, l'ange messager de QUERNEL INTELLIGENCE. Tu es l'expert marketing : stratégies, SEO, contenu, publicité. Réponds en français avec des conseils actionnables. Sois concis (max 3 phrases).",
      michael: "Tu es Michaël, l'ange protecteur de QUERNEL INTELLIGENCE. Tu es l'expert commercial : vente, prospection, négociation. Réponds en français avec énergie et des conseils terrain. Sois concis (max 3 phrases).",
    }

    try {
      // Call real AI webhook
      const response = await backendApi.callAIWebhook(
        demoMessage,
        activeAgent.id,
        systemPrompts[activeAgent.id]
      )

      // Typing effect for the response
      for (let i = 0; i <= response.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 12))
        setDemoResponse(response.slice(0, i))
      }
    } catch (error) {
      console.error("Demo chat error:", error)
      // Fallback to simulated response if webhook fails
      const fallback = `Bonjour ! Je suis ${activeAgent.name}. Notre service est temporairement indisponible, mais je serai bientôt prêt à vous aider !`
      setDemoResponse(fallback)
    }

    setIsDemoTyping(false)
    setDemoMessage("")
  }

  return (
    <div className={`min-h-screen ${isDark ? "dark bg-[#0a0a0f]" : "bg-white"} transition-colors duration-300`}>
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? isDark
              ? "bg-[#0a0a0f]/90 backdrop-blur-lg border-b border-white/10"
              : "bg-white/90 backdrop-blur-lg border-b border-gray-200"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src="/logo-qi.png"
                alt="QUERNEL INTELLIGENCE"
                className="h-10 w-auto"
              />
              <span className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
                QUERNEL INTELLIGENCE
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#agents" className={`text-sm font-medium hover:text-violet-500 transition-colors ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Agents
              </a>
              <a href="#features" className={`text-sm font-medium hover:text-violet-500 transition-colors ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Fonctionnalités
              </a>
              <a href="#pricing" className={`text-sm font-medium hover:text-violet-500 transition-colors ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Tarifs
              </a>
              <a href="#faq" className={`text-sm font-medium hover:text-violet-500 transition-colors ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                FAQ
              </a>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="hidden md:flex items-center gap-3">
                <Button variant="ghost" onClick={onNavigateToLogin} className={isDark ? "text-white hover:bg-white/10" : ""}>
                  Connexion
                </Button>
                <Button onClick={onNavigateToRegister} className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0">
                  Essai gratuit
                </Button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg ${isDark ? "hover:bg-white/10 text-white" : "hover:bg-gray-100"}`}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t ${isDark ? "bg-[#0a0a0f] border-white/10" : "bg-white border-gray-200"}`}
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#agents" className={`block py-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Agents</a>
                <a href="#features" className={`block py-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Fonctionnalités</a>
                <a href="#pricing" className={`block py-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Tarifs</a>
                <a href="#faq" className={`block py-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>FAQ</a>
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full" onClick={onNavigateToLogin}>Connexion</Button>
                  <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600" onClick={onNavigateToRegister}>Essai gratuit</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse ${isDark ? "bg-violet-500" : "bg-violet-300"}`} />
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? "bg-purple-500" : "bg-purple-300"}`} style={{ animationDelay: "1s" }} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 ${isDark ? "bg-blue-500" : "bg-blue-200"}`} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 mb-6"
              >
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className={`text-sm font-medium ${isDark ? "text-violet-300" : "text-violet-600"}`}>
                  Propulsé par l'IA française
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-6"
              >
                <img
                  src="/logo-quernel-intelligence.png"
                  alt="QUERNEL INTELLIGENCE"
                  className="h-20 sm:h-24 lg:h-28 w-auto"
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  3 Anges IA
                </span>
                <br />
                au service de votre entreprise
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-lg sm:text-xl mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Marketing, commercial, productivite... Nos 3 Anges IA travaillent en synergie pour vous 24/7.
                <span className="font-semibold"> 100% heberge en France. 50eur/mois apres 7 jours d'essai.</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  onClick={onNavigateToRegister}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 text-lg px-8 py-6 h-auto"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`text-lg px-8 py-6 h-auto ${isDark ? "border-white/20 text-white hover:bg-white/10" : ""}`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Voir la démo
                </Button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-12 flex items-center gap-8"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className={`ml-2 font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>4.9/5</span>
                </div>
                <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <span className="font-semibold">+500</span> entreprises nous font confiance
                </div>
              </motion.div>
            </motion.div>

            {/* Right side - Demo Chat */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className={`rounded-2xl border ${isDark ? "bg-[#12121a] border-white/10" : "bg-white border-gray-200"} shadow-2xl overflow-hidden`}>
                {/* Chat header */}
                <div className={`p-4 border-b ${isDark ? "border-white/10" : "border-gray-200"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${activeAgent.gradient} flex items-center justify-center text-white`}>
                      {activeAgent.icon}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{activeAgent.name}</h3>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{activeAgent.role}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>En ligne</span>
                    </div>
                  </div>
                </div>

                {/* Agent selector */}
                <div className={`p-3 border-b ${isDark ? "border-white/10" : "border-gray-200"} overflow-x-auto`}>
                  <div className="flex gap-2">
                    {agents.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => {
                          setActiveAgent(agent)
                          setDemoResponse("")
                        }}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          activeAgent.id === agent.id
                            ? `${agent.gradient} text-white`
                            : isDark
                            ? "bg-white/5 text-gray-400 hover:bg-white/10"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {agent.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat messages */}
                <div className={`p-4 min-h-[200px] ${isDark ? "bg-[#0a0a0f]/50" : "bg-gray-50"}`}>
                  {demoResponse ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className={`w-8 h-8 rounded-lg ${activeAgent.gradient} flex items-center justify-center text-white flex-shrink-0`}>
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className={`flex-1 p-3 rounded-lg ${isDark ? "bg-white/5" : "bg-white"}`}>
                        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {demoResponse}
                          {isDemoTyping && <span className="animate-pulse">|</span>}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className={`text-center py-8 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Envoyez un message pour tester {activeAgent.name}</p>
                    </div>
                  )}
                </div>

                {/* Chat input */}
                <form onSubmit={handleDemoSubmit} className={`p-4 border-t ${isDark ? "border-white/10" : "border-gray-200"}`}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={demoMessage}
                      onChange={(e) => setDemoMessage(e.target.value)}
                      placeholder={`Posez une question à ${activeAgent.name}...`}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                      } focus:outline-none focus:ring-2 focus:ring-violet-500`}
                    />
                    <Button
                      type="submit"
                      disabled={isDemoTyping}
                      className="bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                    >
                      Envoyer
                    </Button>
                  </div>
                </form>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full blur-2xl opacity-30" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full blur-2xl opacity-20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section id="agents" className={`py-20 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Decouvrez nos <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">3 Anges IA</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Raphael, Gabriel et Michael travaillent en synergie avec un contexte partage pour vous offrir une experience unique.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                  isDark
                    ? "bg-[#12121a] border-white/10 hover:border-white/20"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg"
                }`}
              >
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl ${agent.gradient} flex items-center justify-center text-white mb-4`}>
                    {agent.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {agent.name}
                  </h3>
                  <p className={`text-sm font-medium mb-3 ${isDark ? "text-violet-400" : "text-violet-600"}`}>
                    {agent.role}
                  </p>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {agent.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 ${isDark ? "bg-[#12121a]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Pourquoi choisir <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">QUERNEL</span> ?
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 ${isDark ? "text-violet-400" : "text-violet-600"}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Ils nous font <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">confiance</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl border ${
                  isDark
                    ? "bg-[#12121a] border-white/10"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {testimonial.name}
                    </p>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {testimonial.role} - {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection isDark={isDark} onNavigateToRegister={onNavigateToRegister} />

      {/* FAQ Section */}
      <section id="faq" className={`py-20 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Questions <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">fréquentes</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border overflow-hidden ${
                  isDark
                    ? "bg-[#12121a] border-white/10"
                    : "bg-white border-gray-200"
                }`}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className={`w-full flex items-center justify-between p-4 text-left ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                >
                  <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      expandedFAQ === index ? "rotate-180" : ""
                    } ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className={`px-4 pb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${isDark ? "bg-[#12121a]" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Prêt à transformer votre entreprise ?
            </h2>
            <p className={`text-lg mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Rejoignez les +500 entreprises qui utilisent déjà QUERNEL INTELLIGENCE
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={onNavigateToRegister}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 text-lg px-8 py-6 h-auto"
              >
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={`text-lg px-8 py-6 h-auto ${isDark ? "border-white/20 text-white hover:bg-white/10" : ""}`}
              >
                Contacter l'équipe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${isDark ? "bg-[#0a0a0f] border-white/10" : "bg-gray-50 border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/logo-qi.png"
                  alt="QUERNEL INTELLIGENCE"
                  className="h-10 w-auto"
                />
                <span className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
                  QUERNEL INTELLIGENCE
                </span>
              </div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                L'intelligence artificielle au service des entreprises françaises.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Produit</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <li><a href="#agents" className="hover:text-violet-500 transition-colors">Nos Agents</a></li>
                <li><a href="#pricing" className="hover:text-violet-500 transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-violet-500 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-violet-500 transition-colors">Intégrations</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Entreprise</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <li><a href="#" className="hover:text-violet-500 transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-violet-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-violet-500 transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-violet-500 transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Légal</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <li><a href="#legal" className="hover:text-violet-500 transition-colors">Mentions légales</a></li>
                <li><a href="#privacy" className="hover:text-violet-500 transition-colors">Politique de confidentialité</a></li>
                <li><a href="#terms" className="hover:text-violet-500 transition-colors">CGU</a></li>
                <li><a href="#cookies" className="hover:text-violet-500 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? "border-white/10" : "border-gray-200"}`}>
            <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              © 2026 QUERNEL INTELLIGENCE SASU. Tous droits réservés.
            </p>
            <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              SIREN: 979632072 - Hébergé en France 🇫🇷
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
