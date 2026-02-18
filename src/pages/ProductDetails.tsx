import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { MOCK_PRODUCTS } from '../lib/mockData'
import { useCart } from '../context/CartContext'

interface Product {
  id: number | string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  created_at?: string
  tags?: string[]
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      setImageLoaded(false)
      setContentVisible(false)
      try {
        if (!id) return

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (!error && data) {
          setProduct(data)
          // Fetch related products from same category
          const { data: related } = await supabase
            .from('products')
            .select('id, name, price, image_url, category')
            .eq('category', data.category)
            .neq('id', id)
            .limit(4)
          if (related) setRelatedProducts(related as unknown as Product[])
        } else {
          const mockItem = MOCK_PRODUCTS.find((p) => p.id === Number(id))
          if (mockItem) setProduct(mockItem as unknown as Product)
        }
      } catch (err) {
        console.error('Failed to load product', err)
      } finally {
        setLoading(false)
        setTimeout(() => setContentVisible(true), 150)
      }
    }
    loadProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      
      // ⚡ EVENT PREFETCH: START
      // The user just added an item. There is a high chance they will check out soon.
      // Start downloading the heavy Checkout page now so it's ready.
      import('./Checkout') 
      // ⚡ EVENT PREFETCH: END

      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  const handleBuyNow = () => {
    if (product) {
      addToCart(product)
      
      // ⚡ EVENT PREFETCH: START
      // Even though we are going to Cart first, we know where they are headed next.
      import('./Checkout') 
      // ⚡ EVENT PREFETCH: END

      navigate('/cart')
    }
  }

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em]">Loading</p>
        </div>
      </div>
    )
  }

  /* ── Not Found ── */
  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-4">
        <span className="material-symbols-outlined text-5xl text-gray-200 mb-6">search_off</span>
        <h2 className="text-2xl font-light text-gray-900 mb-2">Product not found</h2>
        <p className="text-sm text-gray-400 mb-8">This timepiece may have been removed or doesn't exist.</p>
        <button
          onClick={() => navigate('/products')}
          className="text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
        >
          Back to Collection
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">

      {/* ── Breadcrumb ── */}
      <div className="bg-stone-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 pt-20">
          <nav className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <Link to="/products" className="hover:text-black transition-colors">Collection</Link>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-gray-900 font-semibold truncate max-w-48">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Product Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

          {/* ── Left: Image ── */}
          <div
            className={`transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <div className="relative aspect-square lg:aspect-3/4 bg-stone-50 overflow-hidden group sticky top-24">
              {/* Loading placeholder */}
              <div
                className={`absolute inset-0 z-10 bg-stone-100 transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              />
              <img
                src={product.image_url}
                alt={product.name}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {/* Category tag */}
              <div className="absolute top-5 left-5 z-20">
                <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 px-3 py-1.5">
                  {product.category}
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div
            className={`flex flex-col justify-center transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Name & Price */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.25em] block mb-3">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight leading-tight mb-6">
                {product.name}
              </h1>
              <p className="text-2xl font-medium text-gray-900 tabular-nums">
                ₦{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-4">Description</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-4">Specifications</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-600 border border-gray-200 px-3 py-1.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  addedToCart
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {addedToCart ? 'check' : 'shopping_bag'}
                </span>
                {addedToCart ? 'Added to Cart' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 border border-black text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-colors"
              >
                Buy Now
                <span className="material-symbols-outlined text-base">east</span>
              </button>
            </div>

            {/* Trust features */}
            <div className="space-y-4 pt-2">
              {[
                { icon: 'local_shipping', text: 'Free delivery worldwide' },
                { icon: 'verified_user', text: '2-year international warranty' },
                { icon: 'lock', text: 'Secure, encrypted checkout' },
                { icon: 'package_2', text: 'Premium insured packaging' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-base text-gray-300">{f.icon}</span>
                  <span className="text-xs text-gray-500 font-light">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-gray-100 py-16 lg:py-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 block mb-2">You May Also Like</span>
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight">Related Pieces</h2>
              </div>
              <Link
                to="/products"
                className="group hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors"
              >
                View All
                <span className="material-symbols-outlined text-xs transition-transform group-hover:translate-x-0.5">east</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} to={`/products/${rp.id}`} className="group block">
                  <div className="relative aspect-3/4 bg-stone-100 overflow-hidden mb-3">
                    <img
                      src={rp.image_url}
                      alt={rp.name}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 z-20">
                      <span className="flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-black text-[10px] font-bold uppercase tracking-[0.15em] py-2.5">
                        View
                        <span className="material-symbols-outlined text-xs">east</span>
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-semibold mb-0.5">{rp.category}</p>
                  <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-500 transition-colors">{rp.name}</h3>
                  <p className="text-sm font-semibold text-gray-900 mt-1 tabular-nums">
                    ₦{rp.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}