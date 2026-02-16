import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'

/* ── Intersection Observer hook for scroll-reveal ── */
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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [heroLoaded, setHeroLoaded] = useState(false)

  /* Reveal refs for each section */
  const trust   = useReveal()
  const cats    = useReveal()
  const feat    = useReveal()
  const story   = useReveal()
  const news    = useReveal()

  useEffect(() => {
    async function fetchFeatured() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(20)

      if (data) {
        const shuffled = data.sort(() => 0.5 - Math.random())
        setFeaturedProducts(shuffled.slice(0, 4))
      } else {
        console.error('Error fetching featured products:', error)
      }
    }
    fetchFeatured()
    // Trigger hero entry after a tiny delay for smoothness
    const t = setTimeout(() => setHeroLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="bg-white">

      {/* ═══════════════════ 1. HERO (FIXED) ═══════════════════ */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Background Image with Slow Zoom */}
        <div className="absolute inset-0">
          <img
            src="/images/watch-b.jpeg"
            alt="Hero Background"
            className={`w-full h-full object-cover transition-transform duration-[20s] ease-out ${heroLoaded ? 'scale-110' : 'scale-100'}`}
          />
          {/* Enhanced Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
        </div>

        {/* Hero Content */}
        <div 
          className="absolute inset-0 pt-20 flex flex-col justify-center md:justify-end pb-8 sm:pb-20 px-6 sm:px-12 md:px-20 lg:px-24 z-10 overflow-hidden pointer-events-none"
        >
          {/* Content wrapper */}
          <div className="max-w-4xl w-full pointer-events-auto">
            
            {/* Animated Eyebrow Text – placed before headline */}
            <div 
              className={`overflow-hidden transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="flex items-center gap-4 mb-5 md:mb-6">
                <span className="h-[1px] w-10 md:w-12 bg-white/60"></span>
                <span className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-white/90">
                  Est. 2026 • Swiss Precision
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 
              className={`text-5xl md:text-7xl lg:text-[6rem] font-light text-white leading-[0.9] tracking-tight mb-8 transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '350ms' }}
            >
              Timeless <br className="hidden md:block" />
              <span className="font-serif italic text-white/90">Elegance</span> & <br className="hidden md:block" />
              Mastery
            </h1>

            {/* Description & CTA Group */}
            <div 
              className={`flex flex-col md:flex-row gap-10 items-start md:items-end transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '600ms' }}
            >
              <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed max-w-md border-l border-white/20 pl-6">
                Discover a curated collection of the world's most prestigious timepieces. 
                Where engineering meets art, and every second is a statement.
              </p>

              <div className="flex flex-row gap-3 sm:gap-4">
                <Link
                  to="/products"
                  className="group bg-white text-black px-5 sm:px-10 py-3.5 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 sm:gap-3"
                >
                  Shop Now
                  <span className="material-symbols-outlined text-xs sm:text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                </Link>
                <Link
                  to="/about"
                  className="px-5 sm:px-8 py-3.5 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white border border-white/30 hover:bg-white/10 transition-colors backdrop-blur-sm text-center flex items-center justify-center"
                >
                  The Brand
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <div 
          className={`absolute bottom-8 right-8 md:right-16 flex items-center gap-4 transition-opacity duration-1000 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '1000ms' }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 hidden md:block">Scroll to Explore</span>
          <div className="h-16 w-[1px] bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-slide-down" />
          </div>
        </div>
      </section>

      {/* ═══════════════════ 2. TRUST STRIP ═══════════════════ */}
      <div className="bg-black text-white relative z-20 -mt-1 py-4 sm:py-5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {[
              { icon: 'local_shipping', label: 'Global Delivery', desc: 'Complimentary shipping' },
              { icon: 'verified_user',  label: '5-Year Warranty', desc: 'Certified authenticity' },
              { icon: 'support_agent',  label: 'Concierge Service', desc: '24/7 expert support' },
              { icon: 'lock',           label: 'Secure Payment', desc: 'Encrypted transactions' },
            ].map((t, i) => (
              <div
                key={i}
                className={`group flex items-center sm:items-start gap-2.5 sm:gap-4 transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${800 + i * 150}ms` }}
              >
                <div className="p-2 sm:p-3 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors shrink-0">
                  <span className="material-symbols-outlined text-lg sm:text-xl text-white/80">{t.icon}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-white mb-0.5 sm:mb-1 truncate">
                    {t.label}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-light tracking-wide uppercase hidden sm:block">
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════ 3. CATEGORIES ═══════════════════ */}
      <section ref={cats.ref} className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14 transition-all duration-700 ${cats.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-3 block">Explore</span>
              <h2 className="text-4xl md:text-5xl font-serif italic text-gray-900 tracking-tight">Shop by Collection</h2>
            </div>
            <Link
              to="/products"
              className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors"
            >
              View All
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">east</span>
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-1 h-auto md:h-160">
            {/* Large — left */}
            <div
              className={`md:col-span-7 group relative overflow-hidden cursor-pointer h-100 md:h-full transition-opacity duration-700 ease-out ${cats.visible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <img src="/images/luxury-collection.jpg" alt="Luxury" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <span className="text-[10px] text-white/60 uppercase tracking-[0.3em] font-semibold">Premium</span>
                <h3 className="text-3xl md:text-4xl font-light text-white mt-1 mb-4 tracking-tight">Luxury</h3>
                <Link to="/products" className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-[0.2em] border-b border-white/40 pb-1 hover:border-white transition-colors group/link">
                  Explore
                  <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">east</span>
                </Link>
              </div>
            </div>

            {/* Right Column — two stacked */}
            <div className="md:col-span-5 grid grid-rows-2 gap-1 h-150 md:h-full">
              <div
                className={`group relative overflow-hidden cursor-pointer transition-opacity duration-700 ease-out ${cats.visible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: '400ms' }}
              >
                <img src="/images/collection-sport.jpeg" alt="Sport" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="text-[10px] text-white/60 uppercase tracking-[0.3em] font-semibold">Active</span>
                  <h3 className="text-2xl font-light text-white mt-1 mb-3 tracking-tight">Sport</h3>
                  <Link to="/products" className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-[0.2em] border-b border-white/40 pb-1 hover:border-white transition-colors group/link">
                    Explore
                    <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">east</span>
                  </Link>
                </div>
              </div>
              <div
                className={`group relative overflow-hidden cursor-pointer transition-opacity duration-700 ease-out ${cats.visible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: '600ms' }}
              >
                <img src="/images/collection-dress.png" alt="Dress" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="text-[10px] text-white/60 uppercase tracking-[0.3em] font-semibold">Refined</span>
                  <h3 className="text-2xl font-light text-white mt-1 mb-3 tracking-tight">Minimalist</h3>
                  <Link to="/products" className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-[0.2em] border-b border-white/40 pb-1 hover:border-white transition-colors group/link">
                    Explore
                    <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">east</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 4. FEATURED PRODUCTS ═══════════════════ */}
      <section ref={feat.ref} className="py-24 lg:py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${feat.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-3 block">Curated For You</span>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-5">Featured Timepieces</h2>
            <p className="text-gray-500 font-light leading-relaxed">
              A rotating selection of our most coveted pieces. Each one chosen for its exceptional craft.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className={`group block bg-white transition-all duration-700 hover:shadow-xl ${feat.visible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${200 + idx * 150}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                    <span className="flex items-center justify-center gap-2 bg-white text-black text-xs font-bold uppercase tracking-[0.15em] py-3 hover:bg-black hover:text-white transition-colors">
                      View Details
                      <span className="material-symbols-outlined text-sm">east</span>
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-semibold">{product.category}</span>
                  <h3 className="text-base font-medium text-gray-900 mt-1 group-hover:text-gray-600 transition-colors truncate">{product.name}</h3>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className={`mt-16 text-center transition-all duration-700 ${feat.visible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '800ms' }}>
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-black border-b-2 border-black pb-2 hover:text-gray-500 hover:border-gray-500 transition-colors"
            >
              Browse All Watches
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">east</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 5. BRAND STORY SPLIT ═══════════════════ */}
      <section ref={story.ref} className="py-24 lg:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className={`relative transition-all duration-1000 ${story.visible ? 'animate-slide-left' : 'opacity-0'}`}>
              <div className="aspect-4/5 overflow-hidden">
                <img
                  src="/images/collection-luxury.jpg"
                  alt="Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div
                className={`absolute -bottom-6 -right-6 md:right-0 bg-black text-white px-8 py-6 transition-all duration-700 ${story.visible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: '500ms' }}
              >
                <p className="text-3xl font-light">15+</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mt-1">Years of Excellence</p>
              </div>
            </div>

            {/* Text Side */}
            <div className={`transition-all duration-1000 ${story.visible ? 'animate-slide-right' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-4 block">Our Philosophy</span>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-8 leading-tight">
                Where Craft Meets <br className="hidden md:block" />
                <span className="italic font-extralight">Conviction</span>
              </h2>
              <p className="text-gray-500 font-light leading-relaxed mb-8 text-lg">
                Every timepiece in our collection is more than an accessory — it's a statement of intent.
                We partner with heritage houses and independent artisans alike to bring you watches that
                tell a story worth wearing.
              </p>
              <div className="grid grid-cols-3 gap-8 mb-10 border-t border-gray-100 pt-8">
                {[
                  { num: '50k+', label: 'Collectors' },
                  { num: '4.9★',  label: 'Rating' },
                  { num: '100%', label: 'Authentic' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`transition-all duration-500 ${story.visible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${600 + i * 150}ms` }}
                  >
                    <p className="text-2xl font-medium text-gray-900">{s.num}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
              >
                Discover More
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">east</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 6. NEWSLETTER ═══════════════════ */}
      <section ref={news.ref} className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/b.logo.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" />
        </div>

        <div className={`relative z-10 max-w-2xl mx-auto px-4 text-center transition-all duration-1000 ${news.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <span className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-semibold block mb-6">Newsletter</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-5">Stay in the Loop</h2>
          <p className="text-gray-300 font-light leading-relaxed mb-10">
            Get <span className="text-white font-medium">10% off</span> your first order, plus early access to new arrivals and exclusive member events.
          </p>

          <form
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-white/50 transition-colors backdrop-blur-sm"
            />
            <button className="bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-gray-100 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>

          <p className="mt-6 text-[10px] text-gray-500 uppercase tracking-[0.15em]">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

    </div>
  )
}