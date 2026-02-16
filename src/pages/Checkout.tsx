import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

type CheckoutStep = 'information' | 'shipping' | 'payment' | 'confirmation'

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Shipping', price: 2500, eta: '5–7 business days' },
  { id: 'express', label: 'Express Shipping', price: 5000, eta: '2–3 business days' },
  { id: 'overnight', label: 'Overnight Shipping', price: 10000, eta: 'Next business day' },
]

export default function Checkout() {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<CheckoutStep>('information')
  const [orderNumber, setOrderNumber] = useState('')

  // ── Form State ──
  const meta = user?.user_metadata || {}
  const nameParts = (meta.full_name || '').split(' ')

  const [form, setForm] = useState({
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    email: user?.email || '',
    phone: meta.phone_number || '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'Nigeria',
    saveInfo: true,
  })

  const [shippingMethod, setShippingMethod] = useState('standard')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if cart is empty and not on confirmation
  useEffect(() => {
    if (cart.length === 0 && step !== 'confirmation') {
      navigate('/cart')
    }
  }, [cart, step, navigate])

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const selectedShipping = SHIPPING_OPTIONS.find((s) => s.id === shippingMethod)!
  const shippingCost = selectedShipping.price
  const total = subtotal + shippingCost

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  // ── Validation ──
  const validateInformation = () => {
    const errs: Record<string, string> = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    if (!form.phone.trim()) errs.phone = 'Phone number is required'
    if (!form.address.trim()) errs.address = 'Address is required'
    if (!form.city.trim()) errs.city = 'City is required'
    if (!form.state.trim()) errs.state = 'State is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validatePayment = () => {
    const errs: Record<string, string> = {}
    if (!cardName.trim()) errs.cardName = 'Name on card is required'
    if (cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = 'Enter a valid card number'
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) errs.cardExpiry = 'Use MM/YY format'
    if (cardCvc.length < 3) errs.cardCvc = 'Enter a valid CVC'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleContinue = () => {
    if (step === 'information') {
      if (validateInformation()) setStep('shipping')
    } else if (step === 'shipping') {
      setStep('payment')
    } else if (step === 'payment') {
      handlePlaceOrder()
    }
  }

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return
    setProcessing(true)

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000))

    const order = `ECL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    setOrderNumber(order)
    clearCart()
    setStep('confirmation')
    setProcessing(false)
  }

  // ── Format helpers ──
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

  const steps: { id: CheckoutStep; label: string; num: number }[] = [
    { id: 'information', label: 'Information', num: 1 },
    { id: 'shipping', label: 'Shipping', num: 2 },
    { id: 'payment', label: 'Payment', num: 3 },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  // ═════════════════════════════════════════════
  // CONFIRMATION PAGE
  // ═════════════════════════════════════════════
  if (step === 'confirmation') {
    return (
      <div className="bg-stone-50 min-h-screen pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white border border-gray-100 p-8 sm:p-14">
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl text-green-600">check</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 mb-2">
              Thank You for Your Order
            </h1>
            <p className="text-sm text-gray-400 mb-8">
              Your order has been placed and is being processed.
            </p>

            <div className="bg-stone-50 border border-gray-100 p-5 sm:p-6 mb-8 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-1">Order Number</p>
                  <p className="text-sm font-mono font-medium text-gray-900">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-1">Email</p>
                  <p className="text-sm text-gray-900 truncate">{form.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-1">Shipping</p>
                  <p className="text-sm text-gray-900">{selectedShipping.label}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-1">Estimated Delivery</p>
                  <p className="text-sm text-gray-900">{selectedShipping.eta}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-8">
              A confirmation email will be sent to <strong className="text-gray-600">{form.email}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/products"
                className="bg-black text-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/account"
                className="border border-gray-200 text-gray-900 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors"
              >
                My Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════
  // MAIN CHECKOUT LAYOUT
  // ═════════════════════════════════════════════
  return (
    <div className="bg-stone-50 min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link to="/cart" className="hover:text-gray-600 transition-colors">Cart</Link>
          {steps.map((s, i) => (
            <span key={s.id} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className={step === s.id ? 'text-black font-bold' : i < currentStepIndex ? 'text-gray-600' : ''}>
                {s.label}
              </span>
            </span>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* ══════ LEFT: Form Area ══════ */}
          <div className="flex-1 min-w-0">

            {/* Step Progress */}
            <div className="flex items-center gap-0 mb-8">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <button
                    onClick={() => { if (i < currentStepIndex) setStep(s.id) }}
                    disabled={i > currentStepIndex}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      i < currentStepIndex
                        ? 'bg-black text-white cursor-pointer'
                        : i === currentStepIndex
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {i < currentStepIndex ? (
                      <span className="material-symbols-outlined text-sm">check</span>
                    ) : (
                      s.num
                    )}
                  </button>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-2 ${i < currentStepIndex ? 'bg-black' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>


            {/* ── Step 1: Information ── */}
            {step === 'information' && (
              <div className="bg-white border border-gray-100 animate-fade-in">
                <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100">
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Contact & Shipping Information</h2>
                </div>

                <div className="p-5 sm:p-8 space-y-5">
                  {/* Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InputField label="First Name" value={form.firstName} error={errors.firstName}
                      onChange={(v) => updateField('firstName', v)} required />
                    <InputField label="Last Name" value={form.lastName} error={errors.lastName}
                      onChange={(v) => updateField('lastName', v)} required />
                  </div>
                  <InputField label="Email Address" type="email" value={form.email} error={errors.email}
                    onChange={(v) => updateField('email', v)} required disabled={!!user?.email} />
                  <InputField label="Phone Number" type="tel" value={form.phone} error={errors.phone}
                    onChange={(v) => updateField('phone', v)} placeholder="+234 000 000 0000" required />

                  {/* Shipping Address */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-5">Shipping Address</p>
                    <div className="space-y-5">
                      <InputField label="Address" value={form.address} error={errors.address}
                        onChange={(v) => updateField('address', v)} placeholder="123 Main Street" required />
                      <InputField label="Apartment, Suite, etc. (optional)" value={form.apartment}
                        onChange={(v) => updateField('apartment', v)} />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <InputField label="City" value={form.city} error={errors.city}
                          onChange={(v) => updateField('city', v)} required />
                        <InputField label="State" value={form.state} error={errors.state}
                          onChange={(v) => updateField('state', v)} required />
                        <InputField label="Postal Code (optional)" value={form.zip}
                          onChange={(v) => updateField('zip', v)} />
                      </div>
                      <InputField label="Country" value={form.country} disabled />
                    </div>
                  </div>

                  {/* Save info checkbox */}
                  <label className="flex items-center gap-3 pt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.saveInfo}
                      onChange={(e) => updateField('saveInfo', e.target.checked)}
                      className="w-4 h-4 border-gray-300 rounded text-black focus:ring-black accent-black"
                    />
                    <span className="text-xs text-gray-500">Save this information for next time</span>
                  </label>
                </div>
              </div>
            )}


            {/* ── Step 2: Shipping Method ── */}
            {step === 'shipping' && (
              <div className="bg-white border border-gray-100 animate-fade-in">
                <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100">
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Shipping Method</h2>
                </div>

                <div className="p-5 sm:p-8">
                  {/* Address Summary */}
                  <div className="bg-stone-50 border border-gray-100 p-4 mb-6 flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-1">Ship to</p>
                      <p className="text-sm text-gray-900">
                        {form.address}{form.apartment ? `, ${form.apartment}` : ''}<br />
                        {form.city}, {form.state} {form.zip}<br />
                        {form.country}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep('information')}
                      className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-colors"
                    >
                      Change
                    </button>
                  </div>

                  {/* Shipping Options */}
                  <div className="space-y-3">
                    {SHIPPING_OPTIONS.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                          shippingMethod === option.id
                            ? 'border-black bg-stone-50'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            shippingMethod === option.id ? 'border-black' : 'border-gray-300'
                          }`}>
                            {shippingMethod === option.id && (
                              <div className="w-2 h-2 rounded-full bg-black" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{option.label}</p>
                            <p className="text-xs text-gray-400">{option.eta}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900 tabular-nums">₦{option.price.toLocaleString()}</p>
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={shippingMethod === option.id}
                          onChange={() => setShippingMethod(option.id)}
                          className="sr-only"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}


            {/* ── Step 3: Payment ── */}
            {step === 'payment' && (
              <div className="bg-white border border-gray-100 animate-fade-in">
                <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100">
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Payment</h2>
                </div>

                <div className="p-5 sm:p-8">
                  {/* Summary cards */}
                  <div className="space-y-3 mb-6">
                    <div className="bg-stone-50 border border-gray-100 p-4 flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-1">Ship to</p>
                        <p className="text-sm text-gray-900">{form.address}, {form.city}, {form.state}</p>
                      </div>
                      <button onClick={() => setStep('information')}
                        className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-colors">
                        Change
                      </button>
                    </div>
                    <div className="bg-stone-50 border border-gray-100 p-4 flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-1">Shipping Method</p>
                        <p className="text-sm text-gray-900">{selectedShipping.label} · ₦{shippingCost.toLocaleString()}</p>
                      </div>
                      <button onClick={() => setStep('shipping')}
                        className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-colors">
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Card Form */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="material-symbols-outlined text-base text-gray-300">credit_card</span>
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">Credit / Debit Card</p>
                    </div>

                    <div className="space-y-5">
                      <InputField label="Name on Card" value={cardName} error={errors.cardName}
                        onChange={setCardName} placeholder="JOHN DOE" required />
                      <InputField label="Card Number" value={cardNumber} error={errors.cardNumber}
                        onChange={(v) => setCardNumber(formatCardNumber(v))} placeholder="0000 0000 0000 0000"
                        maxLength={19} required />
                      <div className="grid grid-cols-2 gap-5">
                        <InputField label="Expiry Date" value={cardExpiry} error={errors.cardExpiry}
                          onChange={(v) => setCardExpiry(formatExpiry(v))} placeholder="MM/YY"
                          maxLength={5} required />
                        <InputField label="CVC" value={cardCvc} error={errors.cardCvc}
                          onChange={(v) => setCardCvc(v.replace(/\D/g, '').slice(0, 4))} placeholder="123"
                          maxLength={4} required />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mt-6 p-3 bg-stone-50 border border-gray-100">
                    <span className="material-symbols-outlined text-base text-gray-300 mt-0.5">lock</span>
                    <p className="text-xs text-gray-400">
                      Your payment information is encrypted and secure. We never store your full card details.
                    </p>
                  </div>
                </div>
              </div>
            )}


            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => {
                  if (step === 'information') navigate('/cart')
                  else if (step === 'shipping') setStep('information')
                  else if (step === 'payment') setStep('shipping')
                }}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-gray-900 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">west</span>
                {step === 'information' ? 'Back to Cart' : 'Back'}
              </button>

              <button
                onClick={handleContinue}
                disabled={processing}
                className="bg-black text-white px-6 sm:px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : step === 'payment' ? (
                  <>
                    Place Order · ₦{total.toLocaleString()}
                    <span className="material-symbols-outlined text-sm">lock</span>
                  </>
                ) : (
                  <>
                    Continue
                    <span className="material-symbols-outlined text-sm">east</span>
                  </>
                )}
              </button>
            </div>
          </div>


          {/* ══════ RIGHT: Order Summary ══════ */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white border border-gray-100 sticky top-28">
              <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900 tracking-tight">
                  Order Summary ({cart.reduce((a, i) => a + i.quantity, 0)})
                </h2>
              </div>

              {/* Cart Items */}
              <div className="px-5 sm:px-6 py-4 max-h-72 overflow-y-auto space-y-4 border-b border-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-stone-50 shrink-0 relative overflow-hidden">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-gray-900 font-medium tabular-nums shrink-0">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-5 sm:px-6 py-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900 tabular-nums">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900 tabular-nums">
                    {step === 'information' ? (
                      <span className="text-gray-400 text-xs">Calculated next</span>
                    ) : (
                      `₦${shippingCost.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-gray-100">
                  <span className="text-sm font-bold uppercase tracking-wider text-gray-900">Total</span>
                  <span className="text-xl font-light text-gray-900 tabular-nums">
                    ₦{(step === 'information' ? subtotal : total).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment logos */}
              <div className="px-5 sm:px-6 pb-5">
                <div className="pt-4 border-t border-gray-100 flex justify-center gap-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-30 grayscale" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-30 grayscale" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-30 grayscale" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}


/* ══════════════════════════════════════════
   REUSABLE INPUT COMPONENT
   ══════════════════════════════════════════ */
function InputField({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  required,
  disabled,
  maxLength,
}: {
  label: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  maxLength?: number
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`w-full border px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none transition-colors ${
          disabled
            ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
            : error
            ? 'border-red-300 focus:border-red-400'
            : 'border-gray-200 focus:border-black'
        }`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">error</span>
          {error}
        </p>
      )}
    </div>
  )
}