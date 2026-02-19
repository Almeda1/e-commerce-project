import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { FiX, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi'
import { MdMarkEmailRead } from 'react-icons/md'

export default function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, signIn, signUp } = useAuth()
  const [tab, setTab] = useState<'signin' | 'signup'>(authModalTab)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Sync tab when modal opens
  useEffect(() => {
    if (authModalOpen) {
      setTab(authModalTab)
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setError('')
      setSignupSuccess(false)
      setShowPassword(false)
    }
  }, [authModalOpen, authModalTab])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = authModalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [authModalOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    if (tab === 'signup') {
      if (!firstName.trim() || !lastName.trim()) {
        setError('Please enter your first and last name')
        setSubmitting(false)
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setSubmitting(false)
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setSubmitting(false)
        return
      }
      const { error } = await signUp(email, password, `${firstName.trim()} ${lastName.trim()}`)
      if (error) {
        setError(error)
      } else {
        setSignupSuccess(true)
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error)
      }
    }

    setSubmitting(false)
  }

  if (!authModalOpen) return null

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={closeAuthModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white shadow-2xl animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-black transition-colors z-10"
          aria-label="Close"
        >
          <FiX className="text-xl" />
        </button>

        {/* Header */}
        <div className="px-8 pt-10 pb-2">
          <h2 className="font-serif text-2xl tracking-tight text-gray-900 mb-1">
            {signupSuccess ? 'Check your email' : tab === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm text-gray-400">
            {signupSuccess
              ? 'We sent a confirmation link to your email address.'
              : tab === 'signin'
              ? 'Sign in to access your account'
              : 'Join us for an elevated experience'}
          </p>
        </div>

        {signupSuccess ? (
          /* ── Success State ── */
          <div className="px-8 pt-6 pb-10">
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-5">
                <MdMarkEmailRead className="text-3xl text-green-600" />
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
                Please check <strong className="text-gray-900">{email}</strong> and click the confirmation link to activate your account.
              </p>
              <button
                onClick={() => {
                  setSignupSuccess(false)
                  setTab('signin')
                  setEmail('')
                  setPassword('')
                  setConfirmPassword('')
                }}
                className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 hover:text-gray-600 transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} className="px-8 pt-6 pb-10">
            {/* Tab switcher */}
            <div className="flex border-b border-gray-100 mb-8">
              {(['signin', 'signup'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTab(t); setError('') }}
                  className={`flex-1 pb-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${
                    tab === t
                      ? 'text-black border-black'
                      : 'text-gray-300 border-transparent hover:text-gray-500'
                  }`}
                >
                  {t === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 text-sm text-red-600 flex items-start gap-2">
                <FiAlertCircle className="text-base mt-0.5" />
                {error}
              </div>
            )}

            {/* Name Fields (signup only) */}
            {tab === 'signup' && (
              <div className="flex gap-4 mb-5">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    autoComplete="given-name"
                    placeholder="John"
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    autoComplete="family-name"
                    placeholder="Doe"
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="your@email.com"
                className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-lg" />
                  ) : (
                    <FiEye className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password (signup only) */}
            {tab === 'signup' && (
              <div className="mb-5">
                <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : tab === 'signin' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>

            {/* Footer text */}
            <p className="mt-6 text-center text-xs text-gray-400">
              {tab === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => { setTab('signup'); setError('') }} className="text-black font-bold hover:underline">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => { setTab('signin'); setError('') }} className="text-black font-bold hover:underline">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
