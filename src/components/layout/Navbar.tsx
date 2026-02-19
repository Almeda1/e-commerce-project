import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { FiMenu, FiX, FiUser, FiShoppingBag, FiLogOut } from 'react-icons/fi'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cartCount } = useCart()
  const { user, openAuthModal, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // ⚡ HELPER: Add prefetch functions to links
  const navLinks = [
    { name: 'Home', path: '/' },
    { 
      name: 'Shop', 
      path: '/products', 
      prefetch: () => import('../../pages/ProductList') // Background download Shop
    },
    { 
      name: 'About', 
      path: '/about',
      prefetch: () => import('../../pages/About')       // Background download About
    },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-white/90 backdrop-blur-lg border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-1.5 -ml-1.5 rounded-md hover:bg-black/5 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <FiX className="text-2xl text-black" />
                ) : (
                  <FiMenu className="text-2xl text-black" />
                )}
              </button>
              <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <img src="/images/eclat-logo.png" alt="Eclat Logo" className="h-8 w-auto object-contain" />
              </Link>
            </div>

            {/* Center: Desktop Nav Links */}
            <div className="hidden md:flex gap-10 items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  // ⚡ PREFETCH ON HOVER
                  onMouseEnter={link.prefetch}
                  className={`relative text-xs uppercase tracking-[0.15em] font-bold transition-colors duration-300 py-2 group ${
                    isActive(link.path) ? 'text-black' : 'text-gray-400 hover:text-black'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ease-out ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex gap-4 sm:gap-5 items-center">
              <button
                onClick={() => user ? navigate('/account') : openAuthModal('signin')}
                // ⚡ PREFETCH ACCOUNT: Only if user is logged in
                onMouseEnter={() => user && import('../../pages/Account')}
                className="text-black hover:text-gray-500 transition-colors relative"
                aria-label={user ? 'My account' : 'Sign in'}
              >
                <FiUser className="text-[26px]" />
                {user && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white" />
                )}
              </button>
              
              <Link 
                to="/cart" 
                // ⚡ PREFETCH CART
                onMouseEnter={() => import('../../pages/Cart')}
                className="relative text-black hover:text-gray-500 transition-colors"
              >
                <FiShoppingBag className="text-[26px]" />
                <span className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white ring-2 ring-white transition-transform ${cartCount > 0 ? 'scale-100' : 'scale-0'}`}>
                  {cartCount}
                </span>
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile Dropdown Overlay ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile Dropdown Panel ── */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 bg-white shadow-2xl border-b border-gray-100 transition-all duration-300 ease-out md:hidden ${
          mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-6 py-8 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              // ⚡ PREFETCH ON TOUCH START (Better for mobile)
              onTouchStart={link.prefetch}
              className={`flex items-center justify-between py-4 border-b border-gray-50 text-sm font-bold uppercase tracking-[0.2em] transition-colors ${
                isActive(link.path) ? 'text-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
              )}
            </Link>
          ))}
          {user && (
            <button
              onClick={() => { signOut(); setMobileOpen(false) }}
              className="flex items-center gap-3 py-4 text-sm font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 transition-colors w-full"
            >
              <FiLogOut className="text-lg" />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </>
  )
}