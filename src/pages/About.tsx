import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
// Importing icons from 'react-icons/fi' for a clean, luxury aesthetic
import { 
  FiAward,       // For Quality/Diamond
  FiPenTool,     // For Design/Palette
  FiShield,      // For Integrity/Handshake
  FiSun,         // For Sustainability/Eco
  FiUsers,       // For Community/Groups
  FiStar,        // For Excellence/Star
  FiArrowRight   // For CTA Arrow
} from 'react-icons/fi'

/* ── Scroll-reveal hook (reused from Home) ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

export default function About() {
  const [heroLoaded, setHeroLoaded] = useState(false)
  const story = useReveal()
  const values = useReveal()
  const stats = useReveal()
  const cta = useReveal()

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="bg-white">

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative h-[70vh] sm:h-[80vh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img
            src="/images/about-hero-background2.jpg"
            alt="About Éclat"
            className={`w-full h-full object-cover transition-transform duration-[15s] ease-out ${heroLoaded ? 'scale-110' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/20" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end pb-12 sm:pb-20 px-6 sm:px-12 md:px-20 lg:px-24 z-10">
          <div className="max-w-3xl">
            <p className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-white/60 mb-3 sm:mb-4 transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Our Story
            </p>
            <h1 className={`font-serif text-3xl sm:text-5xl md:text-6xl text-white leading-[1.1] mb-4 sm:mb-6 transition-all duration-1000 delay-200 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              The Art of
              <br />
              Refined Living
            </h1>
            <p className={`text-white/50 text-sm sm:text-base max-w-lg leading-relaxed transition-all duration-1000 delay-400 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Born from a passion for exceptional craftsmanship and timeless design,
              Éclat curates pieces that transcend trends and define personal style.
            </p>
          </div>
        </div>
      </section>


      {/* ═══════════════════ OUR STORY ═══════════════════ */}
      <section ref={story.ref} className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-24">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${story.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative aspect-4/5 overflow-hidden bg-stone-100">
              <img
                src="/images/about-story-image.jpg"
                alt="Éclat craftsmanship"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-black/20 to-transparent" />
            </div>

            {/* Text */}
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-4">
                Est. 2024
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight mb-6">
                Where Luxury Meets
                <br />
                Intention
              </h2>
              <div className="space-y-4 text-gray-500 text-sm sm:text-base leading-relaxed">
                <p>
                  Éclat was founded on a simple belief: that the objects we surround ourselves
                  with should inspire us. Every piece in our collection is carefully selected
                  for its quality, design integrity, and the story it tells.
                </p>
                <p>
                  We partner with artisans and designers who share our commitment to
                  excellence — those who understand that true luxury lies not in excess,
                  but in the thoughtful pursuit of perfection.
                </p>
                <p>
                  From precision-engineered timepieces to meticulously crafted accessories,
                  each product represents our unwavering dedication to bringing you only
                  the finest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════ VALUES ═══════════════════ */}
      <section ref={values.ref} className="py-20 sm:py-28 bg-stone-50">
        <div className={`max-w-6xl mx-auto px-6 sm:px-12 md:px-20 lg:px-24 transition-all duration-1000 ${values.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-14 sm:mb-16">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-3">
              What We Stand For
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                icon: <FiAward className="text-2xl" />, // Replaces 'diamond'
                title: 'Quality First',
                desc: 'Every product undergoes rigorous selection. We accept nothing less than exceptional craftsmanship and premium materials.',
              },
              {
                icon: <FiPenTool className="text-2xl" />, // Replaces 'palette'
                title: 'Timeless Design',
                desc: 'We curate pieces that transcend seasonal trends — items designed to be cherished for years, not discarded after months.',
              },
              {
                icon: <FiShield className="text-2xl" />, // Replaces 'handshake'
                title: 'Integrity',
                desc: 'Transparent pricing, honest descriptions, and a genuine commitment to your satisfaction drive everything we do.',
              },
              {
                icon: <FiSun className="text-2xl" />, // Replaces 'eco'
                title: 'Sustainability',
                desc: 'We prioritize partners who share our respect for the environment, favoring sustainable practices and responsible sourcing.',
              },
              {
                icon: <FiUsers className="text-2xl" />, // Replaces 'groups'
                title: 'Community',
                desc: 'Éclat is more than a marketplace — it\'s a community of individuals who appreciate the finer things, thoughtfully chosen.',
              },
              {
                icon: <FiStar className="text-2xl" />, // Replaces 'star'
                title: 'Excellence',
                desc: 'From browsing to unboxing, every touchpoint is crafted with care. We believe the experience should match the product.',
              },
            ].map((value) => (
              <div key={value.title} className="bg-white p-6 sm:p-8 border border-gray-100 group hover:border-gray-200 transition-colors">
                <div className="text-gray-300 group-hover:text-gray-900 transition-colors mb-5 block">
                  {value.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════ STATS ═══════════════════ */}
      <section ref={stats.ref} className="py-20 sm:py-24 border-y border-gray-100">
        <div className={`max-w-5xl mx-auto px-6 sm:px-12 transition-all duration-1000 ${stats.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center">
            {[
              { number: '10K+', label: 'Happy Customers' },
              { number: '500+', label: 'Premium Products' },
              { number: '50+', label: 'Brand Partners' },
              { number: '24/7', label: 'Customer Support' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-2">
                  {stat.number}
                </p>
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-gray-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════ CTA ═══════════════════ */}
      <section ref={cta.ref} className="relative py-20 sm:py-28 bg-black text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-40">
           <img
            src="/images/about-hero-background2.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className={`relative z-10 max-w-3xl mx-auto px-6 sm:px-12 text-center transition-all duration-1000 ${cta.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">
            Join the Éclat Experience
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white leading-tight mb-6">
            Discover What Sets
            <br />
            Us Apart
          </h2>
          <p className="text-white/40 text-sm sm:text-base leading-relaxed mb-10 max-w-lg mx-auto">
            Browse our curated collection of premium products, each selected
            with the same care and attention to detail that defines everything we do.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition-colors"
          >
            Shop Now
            <FiArrowRight className="text-base" />
          </Link>
        </div>
      </section>
    </div>
  )
}