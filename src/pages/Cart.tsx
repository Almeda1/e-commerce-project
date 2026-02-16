import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, removeFromCart, addToCart, decreaseQuantity, cartCount } = useCart()
  const navigate = useNavigate()

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4">
        <span className="material-symbols-outlined text-6xl text-gray-200 mb-6">shopping_bag</span>
        <h1 className="text-3xl font-light text-gray-900 mb-4">Your bag is empty</h1>
        <p className="text-gray-400 mb-8 font-light">It looks like you haven't added any timepieces yet.</p>
        <Link 
          to="/products"
          className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 tracking-tight">Shopping Bag ({cartCount})</h1>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* ── Left: Cart Items ── */}
          <div className="flex-1 space-y-8">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {cart.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative flex flex-col md:grid md:grid-cols-12 gap-6 items-center py-6 border-b border-gray-50 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Product Info */}
                <div className="col-span-6 flex gap-6 w-full items-center">
                  <Link to={`/products/${item.id}`} className="block w-24 aspect-3/4 bg-gray-50 shrink-0 overflow-hidden">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </Link>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1">
                      {(item as any).category || 'Timepiece'}
                    </span>
                    <Link to={`/products/${item.id}`} className="text-base font-medium text-gray-900 hover:text-gray-600 transition-colors mb-2">
                      {item.name}
                    </Link>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 hover:text-red-500 transition-colors text-left flex items-center gap-1 w-fit"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex justify-center w-full md:w-auto">
                   <div className="flex items-center border border-gray-200">
                      <button 
                        onClick={() => decreaseQuantity?.(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="w-10 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                      <button 
                         onClick={() => addToCart(item)}
                         className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                   </div>
                </div>

                {/* Price (Hidden on mobile) */}
                <div className="col-span-2 text-right hidden md:block text-sm text-gray-600 tabular-nums">
                  ₦{item.price.toLocaleString()}
                </div>

                {/* Total */}
                <div className="col-span-2 text-right w-full md:w-auto flex justify-between md:block items-center">
                  <span className="md:hidden text-xs font-bold uppercase tracking-wider text-gray-500">Total</span>
                  <span className="text-sm font-medium text-gray-900 tabular-nums">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <Link to="/products" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] hover:text-gray-600 transition-colors">
                <span className="material-symbols-outlined text-sm">west</span>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── Right: Summary ── */}
          <div className="w-full lg:w-96 shrink-0">
             <div className="bg-stone-50 p-8 sticky top-32">
                <h2 className="text-lg font-light text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900 tabular-nums">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gray-400 text-xs text-right">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                   <span className="text-sm font-bold uppercase tracking-wider text-gray-900">Total</span>
                   <span className="text-2xl font-light text-gray-900 tabular-nums">₦{subtotal.toLocaleString()}</span>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  Checkout
                  <span className="material-symbols-outlined text-sm">lock</span>
                </button>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider text-center mb-3">We Accept</p>
                  <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}