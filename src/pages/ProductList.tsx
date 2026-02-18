import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { MOCK_PRODUCTS } from '../lib/mockData'

// --- Types ---
interface Product {
  id: string | number
  name: string
  description: string
  price: number
  image_url: string
  category: string
  created_at?: string
  tags?: string[]
}

// --- Components ---

const ProductImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  return (
    <div className="absolute inset-0 w-full h-full bg-stone-100">
      <div
        className={`absolute inset-0 z-10 bg-stone-200 transition-opacity duration-600 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`${className} w-full h-full object-cover transition-opacity duration-600 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}

function FilterGroup({
  title,
  options,
  selected,
  onChange,
}: {
  title: string
  options: string[]
  selected: string[]
  onChange: (val: string) => void
}) {
  return (
    <div className="py-5">
      <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.25em] mb-4">{title}</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <label key={option} className="flex items-center cursor-pointer group/item">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span className="w-3.5 h-3.5 border border-gray-300 peer-checked:border-black peer-checked:bg-black transition-all duration-200 flex items-center justify-center">
              <svg
                className="w-2 h-2 text-white opacity-0 peer-checked:opacity-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="ml-3 text-xs text-gray-600 peer-checked:text-black group-hover/item:text-black transition-colors tracking-wide">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

// --- Main Page Component ---

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortOption, setSortOption] = useState('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, category, image_url')

        if (!error && data && data.length > 0) {
          setProducts(data as unknown as Product[])
        } else {
          setProducts(MOCK_PRODUCTS as unknown as Product[])
        }
      } catch {
        setProducts(MOCK_PRODUCTS as unknown as Product[])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
    setTimeout(() => setHeaderVisible(true), 100)
  }, [])

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const filteredProducts = products
    .filter((p) => {
      if (selectedCategories.length === 0) return true
      return selectedCategories.includes(p.category)
    })
    .sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price
      if (sortOption === 'price-desc') return b.price - a.price
      return 0
    })

  return (
    <div className="bg-white min-h-screen">

      {/* ── Header ── */}
      <div className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/collection-header.jpg"
            alt=""
            className={`w-full h-full object-cover transition-all duration-[2s] ${headerVisible ? 'opacity-40 scale-100' : 'opacity-0 scale-105'}`}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20">
          <div
            className={`transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <span className="text-[10px] font-semibold tracking-[0.3em] text-white/50 uppercase block mb-4">
              The Collection
            </span>
          </div>
          <h1
            className={`text-5xl md:text-7xl font-light text-white tracking-tight leading-none transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '400ms' }}
          >
            Exceptional <br className="hidden md:block" />
            <span className="italic font-extralight">Timepieces</span>
          </h1>
          <p
            className={`mt-6 max-w-lg text-white/60 font-light text-base leading-relaxed transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '600ms' }}
          >
            Curated icons of precision engineering and timeless design.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-700"
          >
            <span className="material-symbols-outlined text-lg">tune</span>
            Filters
            {selectedCategories.length > 0 && (
              <span className="ml-1 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center">
                {selectedCategories.length}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-[0.15em]">Sort</span>
            <select
              className="text-xs font-medium bg-transparent border-none focus:ring-0 cursor-pointer text-gray-700"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price +</option>
              <option value="price-desc">Price −</option>
            </select>
          </div>
        </div>

        {/* Mobile filters panel */}
        {mobileFiltersOpen && (
          <div className="lg:hidden bg-stone-50 border border-stone-100 p-5 mb-6">
            <FilterGroup
              title="Category"
              options={['Luxury', 'Sport', 'Diver', 'Pilot', 'Dress']}
              selected={selectedCategories}
              onChange={toggleCategory}
            />
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="mt-3 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] hover:text-black"
              >
                Clear All
              </button>
            )}
          </div>
        )}

        <div className="flex gap-12 lg:gap-16">

          {/* ── Sidebar ── */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <div className="mb-6">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-1">Refine</h2>
              </div>

              <div className="divide-y divide-gray-100">
                <FilterGroup
                  title="Category"
                  options={['Luxury', 'Sport', 'Diver', 'Pilot', 'Dress']}
                  selected={selectedCategories}
                  onChange={toggleCategory}
                />
              </div>

              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="mt-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] hover:text-black transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* ── Grid ── */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="hidden lg:flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
              <p className="text-sm text-gray-400 font-light">
                Showing <span className="text-gray-900 font-medium">{filteredProducts.length}</span>{' '}
                {filteredProducts.length === 1 ? 'piece' : 'pieces'}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-400 uppercase tracking-[0.15em]">Sort by</span>
                <select
                  className="text-xs font-medium bg-transparent border-none focus:ring-0 cursor-pointer text-gray-700 hover:text-black transition-colors"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8 lg:gap-y-14">
              {loading
                ? [...Array(6)].map((_, i) => (
                    <div key={i}>
                      <div className="aspect-3/4 bg-stone-100 mb-4 animate-pulse" />
                      <div className="h-2.5 bg-stone-100 rounded w-1/4 mb-2 animate-pulse" />
                      <div className="h-4 bg-stone-100 rounded w-3/4 mb-2 animate-pulse" />
                      <div className="h-3 bg-stone-100 rounded w-1/3 animate-pulse" />
                    </div>
                  ))
                : filteredProducts.map((product, idx) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="group block animate-fade-in-up"
                      style={{ animationDelay: `${Math.min(idx * 60, 600)}ms`, animationFillMode: 'both' }}
                    >
                      {/* Image */}
                      <div className="relative aspect-3/4 bg-stone-100 overflow-hidden mb-4">
                        <ProductImage
                          src={product.image_url}
                          alt={product.name}
                          className="transition-transform duration-[1.2s] group-hover:scale-105"
                        />
                        {/* View Details Button - always visible for mobile */}
                        <div className="absolute inset-x-0 bottom-0 p-3 z-20">
                          <span className="flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-black text-[10px] font-bold uppercase tracking-[0.15em] py-3">
                            View Details
                            <span className="material-symbols-outlined text-xs">east</span>
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-semibold mb-1">
                        {product.category}
                      </p>
                      <h3 className="text-sm font-medium text-gray-900 leading-snug mb-1.5 group-hover:text-gray-500 transition-colors truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm font-semibold text-gray-900 tabular-nums">
                        ₦{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </Link>
                  ))}
            </div>

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <div className="py-24 text-center">
                <span className="material-symbols-outlined text-4xl text-gray-200 mb-4 block">search_off</span>
                <p className="text-gray-400 text-sm font-light mb-4">No timepieces match your filters.</p>
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}