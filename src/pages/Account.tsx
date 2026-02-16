import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

type ProfileView = 'basic' | 'edit'
type SecurityView = 'password' | 'delete'

export default function Account() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // ── Dropdown / sub-view state ──
  const [profileOpen, setProfileOpen] = useState(true)
  const [securityOpen, setSecurityOpen] = useState(false)
  const [profileView, setProfileView] = useState<ProfileView>('basic')
  const [securityView, setSecurityView] = useState<SecurityView>('password')

  // Pull metadata
  const meta = user?.user_metadata || {}
  const fullName = meta.full_name || ''
  const nameParts = fullName.split(' ')

  // ── Edit Profile State ──
  const [firstName, setFirstName] = useState(nameParts[0] || '')
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '')
  const [gender, setGender] = useState(meta.gender || '')
  const [dob, setDob] = useState(meta.date_of_birth || '')
  const [phone, setPhone] = useState(meta.phone_number || '')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState('')

  // ── Security State ──
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess(false)
    setProfileSaving(true)

    if (!firstName.trim() || !lastName.trim()) {
      setProfileError('First and last name are required')
      setProfileSaving(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: `${firstName.trim()} ${lastName.trim()}`,
        gender: gender || null,
        date_of_birth: dob || null,
        phone_number: phone || null,
      },
    })

    if (error) {
      setProfileError(error.message)
    } else {
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    }
    setProfileSaving(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)
    setPasswordSaving(true)

    if (!currentPassword) {
      setPasswordError('Please enter your current password')
      setPasswordSaving(false)
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      setPasswordSaving(false)
      return
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match')
      setPasswordSaving(false)
      return
    }

    // Verify current password by re-authenticating
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user?.email || '',
      password: currentPassword,
    })

    if (authError) {
      setPasswordError('Current password is incorrect')
      setPasswordSaving(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setTimeout(() => setPasswordSuccess(false), 3000)
    }
    setPasswordSaving(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return
    setDeleting(true)
    await signOut()
    navigate('/')
  }

  return (
    <div className="bg-stone-50 min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight mb-1">My ÉCLAT Account</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Manage your profile, preferences and security</p>
        </div>

        <div className="space-y-4">

          {/* ═══════════════════════════════════════════
              DROPDOWN 1 — PROFILE DETAILS
             ═══════════════════════════════════════════ */}
          <div className="bg-white border border-gray-100">
            {/* Dropdown Header */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-full flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6 text-left group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl text-gray-400 group-hover:text-gray-600 transition-colors">person</span>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Profile Details</h2>
              </div>
              <span className={`material-symbols-outlined text-xl text-gray-300 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {/* Dropdown Body */}
            {profileOpen && (
              <div className="border-t border-gray-100">
                {/* Sub-navigation tabs */}
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setProfileView('basic')}
                    className={`flex-1 sm:flex-none px-5 sm:px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all border-b-2 ${
                      profileView === 'basic'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Basic Details
                  </button>
                  <button
                    onClick={() => setProfileView('edit')}
                    className={`flex-1 sm:flex-none px-5 sm:px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all border-b-2 ${
                      profileView === 'edit'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Edit Details
                  </button>
                </div>

                {/* ── Basic Details View ── */}
                {profileView === 'basic' && (
                  <div className="p-5 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black flex items-center justify-center shrink-0">
                        <span className="text-white text-lg sm:text-xl font-bold uppercase">
                          {fullName ? fullName.charAt(0) : user?.email?.charAt(0) || 'U'}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        {fullName && (
                          <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">{fullName}</h3>
                        )}
                        <p className={`text-sm text-gray-500 truncate ${fullName ? '' : 'text-lg font-medium text-gray-900'}`}>
                          {user?.email}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Member since {createdAt}</p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-bold border border-green-200 text-green-700 bg-green-50">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Verified
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-50">
                      <div className="border border-gray-50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-base text-gray-300">mail</span>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Email</p>
                        </div>
                        <p className="text-sm text-gray-900 truncate">{user?.email}</p>
                      </div>

                      <div className="border border-gray-50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-base text-gray-300">verified_user</span>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Email Status</p>
                        </div>
                        <p className="text-sm text-gray-900">{user?.email_confirmed_at ? 'Confirmed' : 'Pending'}</p>
                      </div>

                      <div className="border border-gray-50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-base text-gray-300">calendar_today</span>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Member Since</p>
                        </div>
                        <p className="text-sm text-gray-900">{createdAt}</p>
                      </div>

                      <div className="border border-gray-50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-base text-gray-300">badge</span>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">User ID</p>
                        </div>
                        <p className="text-sm text-gray-900 font-mono truncate">{user?.id}</p>
                      </div>

                      {meta.gender && (
                        <div className="border border-gray-50 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-base text-gray-300">wc</span>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Gender</p>
                          </div>
                          <p className="text-sm text-gray-900 capitalize">{meta.gender}</p>
                        </div>
                      )}

                      {meta.date_of_birth && (
                        <div className="border border-gray-50 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-base text-gray-300">cake</span>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Date of Birth</p>
                          </div>
                          <p className="text-sm text-gray-900">
                            {new Date(meta.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      )}

                      {meta.phone_number && (
                        <div className="border border-gray-50 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-base text-gray-300">call</span>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Phone</p>
                          </div>
                          <p className="text-sm text-gray-900">{meta.phone_number}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Edit Details View ── */}
                {profileView === 'edit' && (
                  <form onSubmit={handleSaveProfile} className="p-5 sm:p-8">
                    {profileSuccess && (
                      <div className="mb-6 p-3 bg-green-50 border border-green-100 text-sm text-green-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        Profile updated successfully
                      </div>
                    )}
                    {profileError && (
                      <div className="mb-6 p-3 bg-red-50 border border-red-100 text-sm text-red-600 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">error</span>
                        {profileError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                          Gender
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors bg-white appearance-none"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 000 000 0000"
                        className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="w-full sm:w-auto bg-black text-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {profileSaving ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>


          {/* ═══════════════════════════════════════════
              DROPDOWN 2 — SECURITY SETTINGS
             ═══════════════════════════════════════════ */}
          <div className="bg-white border border-gray-100">
            {/* Dropdown Header */}
            <button
              onClick={() => setSecurityOpen(!securityOpen)}
              className="w-full flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6 text-left group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl text-gray-400 group-hover:text-gray-600 transition-colors">shield_lock</span>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Security Settings</h2>
              </div>
              <span className={`material-symbols-outlined text-xl text-gray-300 transition-transform duration-300 ${securityOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {/* Dropdown Body */}
            {securityOpen && (
              <div className="border-t border-gray-100">
                {/* Sub-navigation tabs */}
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setSecurityView('password')}
                    className={`flex-1 sm:flex-none px-5 sm:px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all border-b-2 ${
                      securityView === 'password'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => setSecurityView('delete')}
                    className={`flex-1 sm:flex-none px-5 sm:px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all border-b-2 ${
                      securityView === 'delete'
                        ? 'border-red-500 text-red-500'
                        : 'border-transparent text-gray-400 hover:text-red-400'
                    }`}
                  >
                    Delete Account
                  </button>
                </div>

                {/* ── Change Password View ── */}
                {securityView === 'password' && (
                  <div className="p-5 sm:p-8">
                    <p className="text-xs text-gray-400 mb-6">Update your password to keep your account secure.</p>

                    {passwordSuccess && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-100 text-sm text-green-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        Password updated successfully
                      </div>
                    )}
                    {passwordError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-100 text-sm text-red-600 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">error</span>
                        {passwordError}
                      </div>
                    )}

                    <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            tabIndex={-1}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-5">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            tabIndex={-1}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={passwordSaving}
                        className="w-full sm:w-auto bg-black text-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {passwordSaving ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* ── Delete Account View ── */}
                {securityView === 'delete' && (
                  <div className="p-5 sm:p-8">
                    <h3 className="text-sm font-bold text-red-600 mb-1">Delete Account</h3>
                    <p className="text-xs text-gray-400 mb-6">
                      Permanently remove your account and all associated data. This action cannot be undone.
                    </p>

                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-6 py-2.5 border border-red-200 text-[11px] font-bold uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 hover:border-red-300 transition-all"
                      >
                        <span className="material-symbols-outlined text-base">delete_forever</span>
                        Delete My Account
                      </button>
                    ) : (
                      <div className="p-4 border border-red-100 bg-red-50/50 max-w-md">
                        <p className="text-sm text-red-600 mb-4">
                          Type <strong>DELETE</strong> to confirm account deletion.
                        </p>
                        <input
                          type="text"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="Type DELETE"
                          className="w-full border border-red-200 px-4 py-3 text-sm text-gray-900 placeholder:text-red-300 focus:outline-none focus:border-red-400 transition-colors mb-4"
                        />
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmText !== 'DELETE' || deleting}
                            className="bg-red-600 text-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {deleting ? (
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              'Confirm Delete'
                            )}
                          </button>
                          <button
                            onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}
                            className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Sign Out Button */}
        <div className="mt-8">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 transition-colors border border-gray-200 bg-white"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Sign Out
          </button>
        </div>

      </div>
    </div>
  )
}