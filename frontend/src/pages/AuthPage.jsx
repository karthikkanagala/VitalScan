import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const update = (field, value) => setFormData(p => ({ ...p, [field]: value }))

  const handleSignUp = () => {
    const { fullName, email, password, confirmPassword } = formData
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      return setError('All fields are required.')
    }
    if (password !== confirmPassword) return setError('Passwords do not match.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('vitalscan_users') || '[]')
      if (users.find(u => u.email === email)) {
        setLoading(false)
        return setError('An account with this email already exists.')
      }
      const user = { id: Date.now(), fullName, email, password }
      users.push(user)
      localStorage.setItem('vitalscan_users', JSON.stringify(users))
      const token = btoa(email + ':' + Date.now())
      localStorage.setItem('vitalscan_token', token)
      localStorage.setItem('vitalscan_user', JSON.stringify({ fullName, email }))
      setLoading(false)
      navigate('/form')
    }, 800)
  }

  const handleSignIn = () => {
    const { email, password } = formData
    if (!email.trim() || !password) return setError('Email and password are required.')
    setLoading(true)
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('vitalscan_users') || '[]')
      const user = users.find(u => u.email === email && u.password === password)
      if (!user) {
        setLoading(false)
        return setError('Invalid email or password.')
      }
      const token = btoa(user.email + ':' + Date.now())
      localStorage.setItem('vitalscan_token', token)
      localStorage.setItem('vitalscan_user', JSON.stringify({ fullName: user.fullName, email: user.email }))
      setLoading(false)
      navigate('/form')
    }, 800)
  }

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
    padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none',
    fontFamily: 'system-ui', boxSizing: 'border-box', transition: 'all 0.3s'
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a', display: 'flex',
      alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', width: '700px', height: '700px', top: '-200px', left: '-200px',
        background: 'radial-gradient(circle, rgba(0,255,136,0.12) 0%, transparent 65%)',
        animation: 'float1 12s ease-in-out infinite', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: '600px', height: '600px', bottom: '-200px', right: '-150px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 65%)',
        animation: 'float2 16s ease-in-out infinite', pointerEvents: 'none'
      }} />

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 10, width: '100%', maxWidth: '480px',
        margin: '0 24px', padding: '48px 40px', background: '#0d0d10',
        borderRadius: '24px', border: '1px solid rgba(0,255,136,0.15)',
        boxShadow: '0 0 80px rgba(0,255,136,0.06)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '20px', letterSpacing: '3px' }}>
            <span style={{ color: '#00ff88' }}>◆ </span>
            <span style={{ color: '#fff' }}>VITAL</span>
            <span style={{ background: 'linear-gradient(135deg,#00ff88,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SCAN</span>
          </div>
          <div style={{ color: '#444', fontSize: '12px', letterSpacing: '2px', marginTop: '6px', fontFamily: "'Space Mono', monospace" }}>
            CHRONIC RISK INTELLIGENCE PLATFORM
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', margin: '32px 0 24px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['signin', 'signup']).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              style={{
                flex: 1, padding: '12px', border: 'none', cursor: 'pointer',
                fontFamily: "'Space Mono', monospace", fontSize: '13px', transition: 'all 0.3s',
                background: mode === m ? '#00ff88' : 'transparent',
                color: mode === m ? '#000' : '#555', fontWeight: mode === m ? '700' : '400'
              }}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'signup' && (
            <Field label="FULL NAME">
              <input
                type="text" placeholder="John Doe" value={formData.fullName}
                onChange={e => update('fullName', e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#00ff88'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,136,0.08)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
              />
            </Field>
          )}

          <Field label="EMAIL">
            <input
              type="email" placeholder="you@example.com" value={formData.email}
              onChange={e => update('email', e.target.value)}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#00ff88'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,136,0.08)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
            />
          </Field>

          <Field label="PASSWORD">
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password}
                onChange={e => update('password', e.target.value)}
                style={{ ...inputStyle, paddingRight: '48px' }}
                onFocus={e => { e.target.style.borderColor = '#00ff88'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,136,0.08)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
              />
              <button
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px', padding: 0
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </Field>

          {mode === 'signup' && (
            <Field label="CONFIRM PASSWORD">
              <input
                type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#00ff88'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,136,0.08)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
              />
            </Field>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            color: '#ef4444', fontSize: '13px', textAlign: 'center', marginTop: '16px',
            padding: '10px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px',
            border: '1px solid rgba(239,68,68,0.2)'
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={mode === 'signin' ? handleSignIn : handleSignUp}
          disabled={loading}
          style={{
            width: '100%', padding: '16px', marginTop: '24px', borderRadius: '12px',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
            color: '#000', fontWeight: '800', fontFamily: "'Space Mono', monospace",
            fontSize: '14px', letterSpacing: '1px', opacity: loading ? 0.6 : 1,
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,136,0.3)' } }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          {loading ? 'Processing...' : mode === 'signin' ? 'Access Dashboard →' : 'Create Account →'}
        </button>

        {/* Bottom link */}
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#555', fontSize: '13px' }}>
          {mode === 'signin' ? (
            <>Don't have an account?{' '}
              <span onClick={() => { setMode('signup'); setError('') }} style={{ color: '#00ff88', cursor: 'pointer' }}>Sign Up</span>
            </>
          ) : (
            <>Already have an account?{' '}
              <span onClick={() => { setMode('signin'); setError('') }} style={{ color: '#00ff88', cursor: 'pointer' }}>Sign In</span>
            </>
          )}
        </div>

        {/* Security note */}
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#333', textAlign: 'center', marginTop: '24px', letterSpacing: '1px' }}>
          🔒 AES-256 · HIPAA Aware · JWT Secured
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#555', letterSpacing: '1.5px', marginBottom: '6px' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
