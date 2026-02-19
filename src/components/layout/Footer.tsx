import { Link } from 'react-router-dom'
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0a0a] text-white">

      {/* ── Main Footer Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-y-12 gap-x-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-3">
            <Link to="/" className="inline-block mb-6">
              <img src="/images/eclat-logo.png" alt="Eclat Logo" className="h-7 w-auto brightness-0 invert" />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-65">
              Curating timeless pieces for those who appreciate the art of refined living.
            </p>
            <div className="flex gap-3">
              {[
                { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                { name: 'X', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { name: 'Pinterest', icon: 'M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z' },
                { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-white/50 hover:bg-white/5 transition-all duration-300 group"
                >
                  <svg className="w-3.5 h-3.5 fill-white/40 group-hover:fill-white transition-colors duration-300" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 md:col-start-6 lg:col-start-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 mb-6">Shop</h3>
            <ul className="space-y-3">
              {[
                { label: 'All Products', to: '/products' },
                { label: 'Electronics', to: '/products?category=electronics' },
                { label: 'Fashion', to: '/products?category=fashion' },
                { label: 'Watches', to: '/products?category=watches' },
                { label: 'Accessories', to: '/products?category=accessories' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-white/35 hover:text-white transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 mb-6">Support</h3>
            <ul className="space-y-3">
              {['Help Center', 'Shipping & Returns', 'Order Status', 'Size Guide', 'Contact Us'].map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-white/35 hover:text-white transition-colors duration-300">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 mb-6">Company</h3>
            <ul className="space-y-3">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Careers', to: '#' },
                { label: 'Press', to: '#' },
                { label: 'Sustainability', to: '#' },
                { label: 'Terms of Service', to: '#' },
              ].map((link) => (
                <li key={link.label}>
                  {link.to.startsWith('/') ? (
                    <Link to={link.to} className="text-sm text-white/35 hover:text-white transition-colors duration-300">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.to} className="text-sm text-white/35 hover:text-white transition-colors duration-300">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact (mobile: full width) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 mb-6">Get in Touch</h3>
            <ul className="space-y-4 text-sm text-white/35">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-base text-white/25 mt-0.5" />
                <span>12 Victoria Island,<br />Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-base text-white/25" />
                <a href="mailto:hello@eclat.com" className="hover:text-white transition-colors duration-300">hello@eclat.com</a>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-base text-white/25" />
                <a href="tel:+2341234567890" className="hover:text-white transition-colors duration-300">+234 123 456 7890</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/25 tracking-wide">
            &copy; {currentYear} Éclat. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-white/25">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
            <span>·</span>
            <a href="#" className="hover:text-white/50 transition-colors">Cookies</a>
          </div>
          <div className="flex gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-30 invert grayscale hover:opacity-60 transition-all duration-300" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-30 invert grayscale hover:opacity-60 transition-all duration-300" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-30 invert grayscale hover:opacity-60 transition-all duration-300" />
          </div>
        </div>
      </div>
    </footer>
  )
}
