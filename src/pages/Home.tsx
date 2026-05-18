import { FiArrowRight, FiTruck, FiShield, FiHeadphones, FiLock } from 'react-icons/fi'
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
  const cats    = useReveal()
  const feat    = useReveal()
  const story   = useReveal()
  const news    = useReveal()

  // ⚡ HELPER: Prefetch ALL main public pages
  const prefetchMainPages = () => {
    const pages = [
      import('./ProductList'),    // The Shop
      import('./About'),          // The Brand
      import('./Cart'),           // The Cart
      import('./ProductDetails')  // The Product Layout
    ];

    Promise.all(pages)
      .then(() => console.log('⚡ All main pages prefetched in background'))
      .catch((err) => console.log('Prefetch error (likely path mismatch)', err));
  };

  useEffect(() => {
    // 1. Fetch Supabase Data
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
    
    // 2. Trigger Hero Animation
    const t = setTimeout(() => setHeroLoaded(true), 100)

    // ⚡ 3. METHOD 2: IDLE PREFETCHING (Aggressive)
    const prefetchTimer = setTimeout(() => {
        prefetchMainPages();
    }, 4000);

    return () => {
        clearTimeout(t);
        clearTimeout(prefetchTimer);
    }
  }, [])

  return (
    <div className="bg-white">

      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img
            src="/images/watch-b.jpeg"
            alt="Hero Background"
            className={`w-full h-full object-cover transition-transform duration-[20s] ease-out ${heroLoaded ? 'scale-110' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-90" />
        </div>

        <div className="absolute inset-0 pt-24 sm:pt-36 md:pt-48 flex flex-col justify-end pb-6 sm:pb-10 md:pb-16 px-5 sm:px-12 md:px-20 lg:px-24 z-10 overflow-y-auto overflow-x-hidden pointer-events-none">
          <div className="max-w-7xl mx-auto w-full pointer-events-auto flex flex-col md:flex-row md:justify-between md:items-end gap-6 sm:gap-12 md:gap-10 mt-auto pb-4 md:pb-0">
            
            {/* Left Side: Title and Description */}
            <div className="flex flex-col gap-4 sm:gap-8 md:w-3/5 lg:w-2/3">
              <h1 
                className={`text-[2.5rem] sm:text-4xl md:text-6xl lg:text-[5.5rem] font-light text-white leading-[1.1] sm:leading-[0.95] tracking-tight transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: '200ms' }}
              >
                The Art <br className="hidden md:block" />
                of <span className="font-serif italic text-white/90">Horology</span> <br className="hidden md:block" />
                Mastered
              </h1>

              <div 
                className={`transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: '400ms' }}
              >
                <p className="text-gray-300 text-sm sm:text-base md:text-xl font-light leading-relaxed max-w-2xl border-l border-white/20 pl-4 sm:pl-6 md:pl-8 py-1 sm:py-2">
                  Explore an exclusive selection of the world's finest luxury timepieces, meticulously curated for the modern connoisseur. We blend centuries of horological heritage with cutting-edge precision to bring you watches that transcend time.
                </p>
              </div>
            </div>

            {/* Right Side: High-End Curated Panel */}
            <div 
              className={`flex flex-col items-start md:items-end w-full md:w-2/5 lg:w-1/3 transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="relative w-full sm:max-w-[340px] md:max-w-[380px] bg-white/5 backdrop-blur-md border border-white/10 p-5 sm:p-8 md:p-10 flex flex-col gap-5 sm:gap-8 shadow-2xl overflow-hidden group">
                {/* Subtle top glow effect on hover */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-white/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="flex items-center gap-3 sm:gap-4 mb-1 sm:mb-2">
                    <span className="w-6 sm:w-8 h-px bg-white/40"></span>
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.4em] uppercase text-white/80">Est. 2024</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif italic text-white tracking-wide">Swiss Precision</h3>
                  <p className="text-[11px] sm:text-xs text-gray-400 font-light leading-relaxed mt-1 border-l-2 border-white/10 pl-3 sm:pl-4">
                    Uncompromising quality. Discover masterpieces forged by heritage and innovation.
                  </p>
                </div>

                <div className="flex flex-col gap-5 sm:gap-8 mt-2 sm:mt-4">
                  <Link
                    to="/products"
                    onMouseEnter={prefetchMainPages} 
                    className="group/btn relative flex items-center gap-3 sm:gap-4 transition-opacity duration-300 hover:opacity-80"
                  >
                    {/* CSS Clock Icon */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center relative shadow-[0_0_15px_rgba(255,255,255,0.4)] shrink-0">
                      {/* Center Dot */}
                      <div className="w-1 h-1 rounded-full bg-black absolute z-20"></div>
                      {/* Minute Hand (Spins on hover) */}
                      <div className="w-[1.5px] h-3 sm:h-3.5 bg-black absolute bottom-1/2 left-1/2 -translate-x-1/2 z-10 origin-bottom group-hover/btn:rotate-[360deg] transition-transform duration-[1.5s] ease-in-out"></div>
                      {/* Hour Hand */}
                      <div className="w-[1.5px] h-2 sm:h-2.5 bg-black absolute bottom-1/2 left-1/2 -translate-x-1/2 rotate-90 z-10 origin-bottom font-bold"></div>
                    </div>
                    
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white">
                      Explore Collection
                    </span>
                  </Link>

                  <Link
                    to="/about"
                    onMouseEnter={prefetchMainPages}
                    className="group/link w-full flex items-center justify-between transition-all duration-300"
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 group-hover/link:text-white transition-colors duration-300">
                      The Heritage
                    </span>
                    <div className="flex-1 mx-4 h-[1px] bg-white/10 group-hover/link:bg-white/40 transition-colors duration-300" />
                    <FiArrowRight className="text-xs text-white/50 group-hover/link:text-white group-hover/link:translate-x-1 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ═══════════════════ 3. CATEGORIES ═══════════════════ */}
      <section ref={cats.ref} className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14 transition-all duration-700 ${cats.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-3 block">Explore</span>
              <h2 className="text-4xl md:text-5xl font-serif italic text-gray-900 tracking-tight">Shop by Collection</h2>
            </div>
            <Link
              to="/products"
              onMouseEnter={prefetchMainPages}
              className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors"
            >
              View All
              <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

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
                <Link to="/products" onMouseEnter={prefetchMainPages} className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-[0.2em] border-b border-white/40 pb-1 hover:border-white transition-colors group/link">
                  Explore
                  <FiArrowRight className="text-sm transition-transform group-hover/link:translate-x-1" />
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
                  <Link to="/products" onMouseEnter={prefetchMainPages} className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-[0.2em] border-b border-white/40 pb-1 hover:border-white transition-colors group/link">
                    Explore
                    <FiArrowRight className="text-sm transition-transform group-hover/link:translate-x-1" />
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
                  <Link to="/products" onMouseEnter={prefetchMainPages} className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-[0.2em] border-b border-white/40 pb-1 hover:border-white transition-colors group/link">
                    Explore
                    <FiArrowRight className="text-sm transition-transform group-hover/link:translate-x-1" />
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
          <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${feat.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-3 block">Curated For You</span>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-5">Featured Timepieces</h2>
            <p className="text-gray-500 font-light leading-relaxed">
              A rotating selection of our most coveted pieces. Each one chosen for its exceptional craft.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                onMouseEnter={prefetchMainPages}
                className={`group block bg-white transition-all duration-700 hover:shadow-xl ${feat.visible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${200 + idx * 150}ms` }}
              >
                <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                    <span className="flex items-center justify-center gap-2 bg-white text-black text-xs font-bold uppercase tracking-[0.15em] py-3 hover:bg-black hover:text-white transition-colors">
                      View Details
                      <FiArrowRight className="text-sm" />
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-semibold">{product.category}</span>
                  <h3 className="text-base font-medium text-gray-900 mt-1 group-hover:text-gray-600 transition-colors truncate">{product.name}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className={`mt-16 text-center transition-all duration-700 ${feat.visible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '800ms' }}>
            <Link
              to="/products"
              onMouseEnter={prefetchMainPages}
              className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-black border-b-2 border-black pb-2 hover:text-gray-500 hover:border-gray-500 transition-colors"
            >
              Browse All Watches
              <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 5. BRAND STORY ═══════════════════ */}
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
              <div
                className={`absolute -bottom-6 -right-6 md:right-0 bg-black text-white px-8 py-6 transition-all duration-700 ${story.visible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: '500ms' }}
              >
                <p className="text-3xl font-light">100%</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mt-1">Quality Assurance</p>
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
                  { num: '2k+', label: 'Collectors' }, 
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
                onMouseEnter={prefetchMainPages}
                className="group inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
              >
                Discover More
                <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
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