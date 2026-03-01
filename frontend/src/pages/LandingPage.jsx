import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [heroVisible, setHeroVisible] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [activeFeature, setActiveFeature] = useState(0)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      const h = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(y > 60)
      setScrollProgress(h > 0 ? (y / h) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mouse glow with RAF smoothing
  useEffect(() => {
    const handleMouse = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY }
    }
    const animate = () => {
      setMousePos(prev => ({
        x: prev.x + (mousePosRef.current.x - prev.x) * 0.12,
        y: prev.y + (mousePosRef.current.y - prev.y) * 0.12
      }))
      rafRef.current = requestAnimationFrame(animate)
    }
    window.addEventListener('mousemove', handleMouse)
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', handleMouse)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Intersection observer for scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.12 })
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Hero visibility
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 300)
    return () => clearTimeout(t)
  }, [])

  // Typewriter effect
  useEffect(() => {
    const fullText = 'Early risk detection for Heart Disease, Diabetes & Obesity — zero lab tests.'
    let i = 0
    const startDelay = setTimeout(() => {
      const timer = setInterval(() => {
        if (i <= fullText.length) {
          setTypedText(fullText.slice(0, i))
          i++
        } else {
          clearInterval(timer)
        }
      }, 40)
    }, 800)
    return () => clearTimeout(startDelay)
  }, [])

  // Active feature cycling
  useEffect(() => {
    const t = setInterval(() => setActiveFeature(p => (p + 1) % 3), 3000)
    return () => clearInterval(t)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${3 + Math.random() * 94}%`,
    duration: `${10 + Math.random() * 15}s`,
    delay: `${Math.random() * 15}s`,
    color: i % 2 === 0 ? '#00ff88' : '#00d4ff'
  }))

  const heroStyle = {
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease'
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Scroll progress bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, zIndex: 99999, height: '3px',
        background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
        width: scrollProgress + '%', transition: 'width 0.15s linear'
      }} />

      {/* Mouse glow */}
      <div style={{
        position: 'fixed', width: '600px', height: '600px', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 2,
        background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 65%)',
        left: mousePos.x - 300, top: mousePos.y - 300,
        transition: 'left 0.08s linear, top 0.08s linear'
      }} />

      {/* Navbar */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span style={{ color: '#00ff88', fontSize: '16px' }}>◆</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '18px', letterSpacing: '3px', fontWeight: '700' }}>
            <span style={{ color: '#ffffff' }}>VITAL</span>
            <span className="grad-text">SCAN</span>
          </span>
        </div>

        {/* Center links */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '36px', alignItems: 'center'
        }}>
          {[['How It Works', 'how-it-works'], ['Features', 'features'], ['About', 'about']].map(([label, id]) => (
            <NavLink key={id} label={label} onClick={() => scrollTo(id)} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <NavButton label="Sign In" onClick={() => navigate('/auth')} variant="outline" />
          <NavButton label="Get Started" onClick={() => navigate('/auth')} variant="solid" />
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {/* Background layers */}
        <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a', zIndex: 0 }} />
        <div style={{
          position: 'absolute', width: '800px', height: '800px', top: '-200px', left: '-200px',
          background: 'radial-gradient(circle, rgba(0,255,136,0.18) 0%, transparent 65%)',
          animation: 'float1 12s ease-in-out infinite', pointerEvents: 'none', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', width: '1000px', height: '1000px', bottom: '-300px', right: '-250px',
          background: 'radial-gradient(circle, rgba(0,255,136,0.10) 0%, transparent 65%)',
          animation: 'float2 16s ease-in-out infinite', pointerEvents: 'none', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', width: '600px', height: '600px', top: '30%', right: '5%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 65%)',
          animation: 'float3 10s ease-in-out infinite', pointerEvents: 'none', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(0,255,136,0.06) 1px, transparent 1px)',
          backgroundSize: '44px 44px'
        }} />
        <div style={{
          position: 'absolute', width: '100%', height: '3px', zIndex: 0,
          background: 'rgba(0,255,136,0.04)', animation: 'scanline 5s linear infinite'
        }} />

        {/* Particles */}
        {particles.map((p, i) => (
          <div key={i} style={{
            position: 'absolute', width: '2px', height: '2px', borderRadius: '50%',
            background: p.color, left: p.left, bottom: '0%', zIndex: 0,
            animation: `particleRise ${p.duration} ${p.delay} ease-in infinite`
          }} />
        ))}

        {/* Hero content */}
        <div style={{
          position: 'relative', zIndex: 10, textAlign: 'center',
          maxWidth: '860px', padding: '0 24px', paddingTop: '72px'
        }}>
          {/* Badge */}
          <div style={{ ...heroStyle, transitionDelay: '0s' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              border: '1px solid rgba(0,255,136,0.35)', borderRadius: '100px',
              padding: '8px 20px', marginBottom: '32px',
              animation: 'borderGlow 4s ease infinite'
            }}>
              <div style={{ width: '8px', height: '8px', background: '#00ff88', borderRadius: '50%', animation: 'blink 1.2s infinite' }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#00ff88', letterSpacing: '3px' }}>
                EARLY RISK DETECTION PLATFORM
              </span>
            </div>
          </div>

          {/* Heading */}
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', lineHeight: 1.1, fontWeight: '700' }}>
              <div style={{ animation: 'slideUp 0.8s 0.2s both', color: '#fff' }}>Know Your Risk.</div>
              <div style={{ animation: 'slideUp 0.8s 0.4s both', color: '#fff' }}>Change Your</div>
              <div style={{ animation: 'slideUp 0.8s 0.6s both', color: '#00ff88', textShadow: '0 0 80px rgba(0,255,136,0.4)' }}>Future.</div>
            </div>
          </div>

          {/* Typewriter */}
          <div style={{ animation: 'slideUp 0.8s 0.9s both', fontSize: '17px', color: '#777', maxWidth: '620px', margin: '28px auto 0', minHeight: '52px' }}>
            {typedText}
            <span style={{ animation: 'blink 0.9s infinite', color: '#00ff88' }}>|</span>
          </div>

          {/* India context */}
          <div style={{ animation: 'slideUp 0.8s 1.1s both', fontSize: '12px', color: '#444', letterSpacing: '0.8px', marginTop: '16px' }}>
            77M+ diabetics · 54M+ heart patients · 180M+ at obesity risk · Most unaware until crisis
          </div>

          {/* CTA Buttons */}
          <div style={{ animation: 'slideUp 0.8s 1.3s both', display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '44px', flexWrap: 'wrap' }}>
            <HeroBtn
              label="Scan My Risk Now →"
              variant="primary"
              onClick={() => navigate('/auth')}
            />
            <HeroBtn
              label="See How It Works ↓"
              variant="outline"
              onClick={() => scrollTo('how-it-works')}
            />
          </div>

          {/* Stats row */}
          <div style={{
            animation: 'slideUp 0.8s 1.5s both',
            marginTop: '72px', paddingTop: '40px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)'
          }}>
            {[
              { num: '3', label: 'Conditions Detected', color: '#00ff88' },
              { num: '17', label: 'Lifestyle Inputs Only', color: '#00d4ff' },
              { num: '<60s', label: 'To Your Risk Profile', color: '#00ff88' }
            ].map((s, i) => (
              <div key={i} style={{
                padding: '0 20px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none'
              }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '48px', fontWeight: '700', color: s.color }}>{s.num}</div>
                <div style={{ fontSize: '12px', color: '#555', letterSpacing: '1px', marginTop: '8px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          animation: 'pulse 2s ease infinite', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '8px', cursor: 'pointer', zIndex: 10
        }} onClick={() => scrollTo('how-it-works')}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#333', letterSpacing: '3px' }}>SCROLL</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M8 4v16M2 14l6 6 6-6" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '140px 48px', background: '#050508' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.2)', color: '#00ff88',
              fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '4px',
              padding: '6px 16px', borderRadius: '100px', marginBottom: '20px'
            }}>THE PROCESS</div>
            <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '52px', color: '#fff', marginBottom: '16px' }}>
              How VitalScan Works
            </h2>
            <div style={{
              width: '80px', height: '3px', margin: '0 auto',
              background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
              backgroundSize: '200%', animation: 'gradientShift 3s infinite'
            }} />
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px', marginTop: '64px'
          }}>
            {[
              {
                title: 'Enter Your Details', desc: '17 lifestyle questions. No blood tests. No clinic.',
                color: '#00ff88', colorBg: 'rgba(0,255,136,0.12)', colorBorder: 'rgba(0,255,136,0.4)',
                glowBg: 'transparent, #00ff88, transparent',
                svg: <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                  <line x1="9" y1="16" x2="13" y2="16" />
                </svg>
              },
              {
                title: 'AI Analyzes Risk', desc: 'Three independent ML models run simultaneously on your inputs.',
                color: '#00d4ff', colorBg: 'rgba(0,212,255,0.12)', colorBorder: 'rgba(0,212,255,0.4)',
                glowBg: 'transparent, #00d4ff, transparent',
                svg: <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
                  <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
                  <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
                  <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
                </svg>
              },
              {
                title: 'See Compounding Effects', desc: 'VitalScan maps how your three conditions amplify each other.',
                color: '#00ff88', colorBg: 'rgba(0,255,136,0.12)', colorBorder: 'rgba(0,255,136,0.4)',
                glowBg: 'transparent, #00ff88, transparent',
                svg: <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              },
              {
                title: 'Get Your Action Plan', desc: '3 priority-ranked, personalized lifestyle changes — specific to you.',
                color: '#00d4ff', colorBg: 'rgba(0,212,255,0.12)', colorBorder: 'rgba(0,212,255,0.4)',
                glowBg: 'transparent, #00d4ff, transparent',
                svg: <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="rgba(0,212,255,0.15)" />
                </svg>
              }
            ].map((step, idx) => (
              <div
                key={idx}
                className={`card reveal delay-${idx + 1}`}
                style={{
                  background: '#0d0d10', borderRadius: '20px', padding: '32px 24px',
                  position: 'relative', overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
                onMouseEnter={e => {
                  const glow = e.currentTarget.querySelector('.glow-bar')
                  if (glow) glow.style.opacity = '1'
                }}
                onMouseLeave={e => {
                  const glow = e.currentTarget.querySelector('.glow-bar')
                  if (glow) glow.style.opacity = '0'
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: step.colorBg, border: `1px solid ${step.colorBorder}`,
                  color: step.color, fontFamily: "'Space Mono', monospace",
                  fontWeight: '700', fontSize: '18px'
                }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div style={{ marginTop: '20px', filter: `drop-shadow(0 0 8px ${step.color}80)` }}>
                  {step.svg}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '15px', color: '#fff', fontWeight: '700', marginTop: '16px' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', marginTop: '10px' }}>
                  {step.desc}
                </div>
                <div className="glow-bar" style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
                  background: `linear-gradient(90deg, ${step.glowBg})`,
                  opacity: 0, transition: 'opacity 0.3s'
                }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE CONDITIONS */}
      <section id="features" style={{ padding: '140px 48px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.2)', color: '#00ff88',
              fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '4px',
              padding: '6px 16px', borderRadius: '100px', marginBottom: '20px'
            }}>WHAT WE DETECT</div>
            <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '52px', color: '#fff', marginBottom: '16px' }}>
              One Scan. Three Conditions.
            </h2>
            <p style={{ fontSize: '16px', color: '#555', maxWidth: '580px', margin: '20px auto 0', lineHeight: '1.7' }}>
              Current tools check one condition. VitalScan checks all three — and reveals how they silently compound within your personal health profile.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', marginTop: '64px' }}>
            {/* Heart */}
            <ConditionCard
              delay="delay-1"
              topBar="linear-gradient(90deg, #991b1b, #ef4444, #fca5a5)"
              iconBg="rgba(239,68,68,0.1)" iconBorder="rgba(239,68,68,0.25)"
              hoverBorder="rgba(239,68,68,0.4)" hoverShadow="rgba(239,68,68,0.12)"
              icon={
                <svg viewBox="0 0 24 24" width="28" height="28">
                  <path d="M12 21C12 21 3 13.5 3 8a4 4 0 018-1.2A4 4 0 0121 8c0 5.5-9 13-9 13z"
                    fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
              title="Heart Disease Risk"
              desc="Analyzes smoking habits, physical activity, stress, family history, salt intake, and sleep patterns to flag cardiovascular vulnerability before symptoms appear."
              riskLabel="HIGH" riskColor="#ef4444" riskWidth="72%"
              riskGrad="linear-gradient(90deg, #991b1b, #ef4444)"
              riskText="Population Risk Level"
              stat="Affects 1 in 4 Indians"
            />
            {/* Diabetes */}
            <ConditionCard
              delay="delay-2"
              topBar="linear-gradient(90deg, #92400e, #f59e0b, #fde68a)"
              iconBg="rgba(245,158,11,0.1)" iconBorder="rgba(245,158,11,0.25)"
              hoverBorder="rgba(245,158,11,0.4)" hoverShadow="rgba(245,158,11,0.12)"
              icon={
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="1.5">
                  <path d="M12 2C12 2 5 10 5 14a7 7 0 0014 0C19 10 12 2 12 2z" strokeLinecap="round" />
                  <path d="M9 14.5a3 3 0 006 0" strokeLinecap="round" />
                </svg>
              }
              title="Diabetes Risk"
              desc="Detects early Type 2 diabetes vulnerability using BMI trends, family history, dietary patterns, hydration, and symptom indicators — before clinical signs appear."
              riskLabel="MODERATE" riskColor="#f59e0b" riskWidth="65%"
              riskGrad="linear-gradient(90deg, #92400e, #f59e0b)"
              riskText="Population Risk Level"
              stat="77 Million Indians Affected"
            />
            {/* Obesity */}
            <ConditionCard
              delay="delay-3"
              topBar="linear-gradient(90deg, #00d4ff, #00ff88)"
              iconBg="rgba(0,212,255,0.1)" iconBorder="rgba(0,212,255,0.25)"
              hoverBorder="rgba(0,212,255,0.4)" hoverShadow="rgba(0,212,255,0.12)"
              icon={
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#00d4ff" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
                </svg>
              }
              title="Obesity Risk"
              desc="WHO-validated BMI and waist-to-height ratio thresholds score obesity risk across 6 clinical categories — and directly elevates both heart and diabetes risk flags."
              riskLabel="ELEVATED" riskColor="#00d4ff" riskWidth="80%"
              riskGrad="linear-gradient(90deg, #006680, #00d4ff)"
              riskText="Population Risk Level"
              stat="Directly Compounds Both Above"
            />
          </div>
        </div>
      </section>

      {/* COMPOUNDING RISK */}
      <section id="about" style={{ padding: '120px 48px', background: '#050508' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '80px', alignItems: 'center' }}>
          {/* Left */}
          <div style={{ flex: 1 }} className="reveal-left">
            <div style={{
              display: 'inline-block', background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.2)', color: '#00ff88',
              fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '4px',
              padding: '6px 16px', borderRadius: '100px', marginBottom: '20px'
            }}>THE VITALSCAN DIFFERENCE</div>
            <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '38px', color: '#fff', lineHeight: '1.3' }}>
              Why Combined Detection Changes Everything
            </h2>
            <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.9', marginTop: '20px' }}>
              Most platforms check one condition in isolation. VitalScan simultaneously analyzes all three — and maps exactly how they compound within your specific health profile.
            </p>
            <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.9', marginTop: '16px' }}>
              If your diabetes risk is moderate AND your BMI is elevated, VitalScan automatically raises your heart disease risk flag — because that compounding relationship is clinically documented by WHO guidelines.
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px', marginTop: '28px',
              background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)',
              borderRadius: '100px', padding: '10px 20px'
            }}>
              <span>🏥</span>
              <span style={{ color: '#00ff88', fontSize: '12px' }}>Built on WHO cardiovascular and diabetes risk factor guidelines</span>
            </div>
          </div>

          {/* Right — SVG Network */}
          <div style={{ flex: 1 }} className="reveal-right">
            <svg viewBox="0 0 400 320" style={{ width: '100%', height: '320px' }}>
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00ff88" />
                  <stop offset="100%" stopColor="#00d4ff" />
                </linearGradient>
              </defs>
              <line x1="200" y1="60" x2="80" y2="240" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.5" />
              <line x1="200" y1="60" x2="320" y2="240" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.5" />
              <line x1="80" y1="240" x2="320" y2="240" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.5" />
              <circle r="4" fill="#00ff88">
                <animateMotion dur="2s" repeatCount="indefinite" path="M200,60 L80,240" />
              </circle>
              <circle r="4" fill="#00d4ff">
                <animateMotion dur="2s" repeatCount="indefinite" begin="0.7s" path="M80,240 L320,240" />
              </circle>
              <circle r="4" fill="#00ff88">
                <animateMotion dur="2s" repeatCount="indefinite" begin="1.4s" path="M320,240 L200,60" />
              </circle>
              <circle cx="200" cy="60" r="50" fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth="1.5" />
              <text x="200" y="52" textAnchor="middle" fill="#ef4444" fontSize="11" fontFamily="Space Mono">HEART</text>
              <text x="200" y="68" textAnchor="middle" fill="#ef4444" fontSize="11" fontFamily="Space Mono">DISEASE</text>
              <circle cx="80" cy="240" r="50" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="80" y="232" textAnchor="middle" fill="#f59e0b" fontSize="11" fontFamily="Space Mono">TYPE 2</text>
              <text x="80" y="248" textAnchor="middle" fill="#f59e0b" fontSize="11" fontFamily="Space Mono">DIABETES</text>
              <circle cx="320" cy="240" r="50" fill="rgba(0,212,255,0.08)" stroke="#00d4ff" strokeWidth="1.5" />
              <text x="320" y="232" textAnchor="middle" fill="#00d4ff" fontSize="11" fontFamily="Space Mono">OBESITY</text>
              <text x="320" y="248" textAnchor="middle" fill="#00d4ff" fontSize="11" fontFamily="Space Mono">RISK</text>
              <rect x="158" y="138" width="84" height="28" rx="14" fill="rgba(0,255,136,0.1)" stroke="rgba(0,255,136,0.3)" />
              <text x="200" y="157" textAnchor="middle" fill="#00ff88" fontSize="10" fontFamily="Space Mono">VITALSCAN</text>
            </svg>
          </div>
        </div>
      </section>

      {/* INDIA IMPACT STATS */}
      <section style={{ padding: '100px 48px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="reveal" style={{ fontFamily: "'Space Mono', monospace", fontSize: '42px', color: '#fff', textAlign: 'center' }}>
            The Scale in India
          </h2>
          <p className="reveal" style={{ color: '#444', textAlign: 'center', marginBottom: '56px', marginTop: '12px' }}>
            Numbers that demand prevention over cure.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
            {[
              { num: '77M+', color: '#f59e0b', label: 'Diabetic Adults', sub: 'Rising 3% annually', delay: 'delay-1' },
              { num: '54M+', color: '#ef4444', label: 'Heart Disease', sub: 'Largest global burden', delay: 'delay-2' },
              { num: '180M+', color: '#00d4ff', label: 'Obesity Risk', sub: '40% unaware', delay: 'delay-3' },
              { num: '18-45', color: '#00ff88', label: 'Primary Risk Age', sub: 'Least likely to test', delay: 'delay-4' }
            ].map((stat, i) => (
              <div key={i} className={`card reveal ${stat.delay}`} style={{
                background: '#0d0d10', borderRadius: '16px', padding: '32px 20px',
                textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)'
              }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '44px', fontWeight: '700', color: stat.color }}>{stat.num}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", color: '#fff', fontSize: '14px', fontWeight: '600', marginTop: '8px' }}>{stat.label}</div>
                <div style={{ color: '#444', fontSize: '12px', marginTop: '4px' }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '120px 48px', background: '#050508', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }} className="reveal">
          <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '44px', color: '#fff', lineHeight: '1.2' }}>
            Your Risk Profile Takes 60 Seconds.
          </h2>
          <p style={{ fontSize: '17px', color: '#666', margin: '20px auto', maxWidth: '500px' }}>
            No lab tests. No doctor visit. No medical knowledge required.
          </p>
          <button
            onClick={() => navigate('/auth')}
            style={{
              background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
              backgroundSize: '200% 200%', animation: 'gradientShift 3s ease infinite',
              color: '#000', fontWeight: '800', fontFamily: "'Space Mono', monospace",
              fontSize: '18px', padding: '22px 60px', borderRadius: '14px',
              border: 'none', cursor: 'pointer', marginTop: '40px',
              transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 60px rgba(0,255,136,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            Start My Risk Scan →
          </button>
        </div>
      </section>

      {/* DISCLAIMER + FOOTER */}
      <div style={{ padding: '0 48px 60px', background: '#050508' }}>
        <div className="reveal" style={{
          maxWidth: '760px', margin: '0 auto 0',
          background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '14px', padding: '24px 32px', display: 'flex', gap: '16px', alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '22px' }}>⚠️</span>
          <p style={{ color: '#777', fontSize: '13px', lineHeight: '1.7' }}>
            VitalScan is an awareness and educational tool only. It does not provide medical diagnoses, replace professional medical advice, or constitute a clinical assessment. Always consult a qualified healthcare professional for medical decisions.
          </p>
        </div>
      </div>

      <footer style={{
        background: '#050508', padding: '48px',
        borderTop: '1px solid rgba(255,255,255,0.03)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '16px', letterSpacing: '2px' }}>
              <span style={{ color: '#fff' }}>VITAL</span>
              <span className="grad-text">SCAN</span>
            </div>
            <div style={{ color: '#333', fontSize: '12px', marginTop: '6px' }}>Built for awareness. Not diagnosis.</div>
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#333' }}>© 2026 VitalScan</div>
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.04)'
        }}>
          <span style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            color: '#333',
            letterSpacing: '2px'
          }}>
            DEVELOPED BY{' '}
            <span style={{
              background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '700'
            }}>
              RAM KARTHIK KANAGALA
            </span>
            {' '}·{' '}
            <span style={{ color: '#555' }}>Team Lead</span>
            {' '}·{' '}
            <span style={{
              background: 'linear-gradient(90deg, #00d4ff, #00ff88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '700'
            }}>
              APEXRUSH
            </span>
          </span>
        </div>
        <div style={{ maxWidth: '1200px', margin: '32px auto 0', height: '1px', background: 'linear-gradient(90deg, transparent, #00ff88, #00d4ff, transparent)' }} />
      </footer>
    </div>
  )
}

function NavLink({ label, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? '#00d4ff' : '#777', fontSize: '13px',
        letterSpacing: '1.5px', cursor: 'pointer',
        transition: 'color 0.2s', fontFamily: "'Space Mono', monospace"
      }}
    >{label}</span>
  )
}

function NavButton({ label, onClick, variant }) {
  const [hovered, setHovered] = useState(false)
  const baseStyle = {
    fontFamily: "'Space Mono', monospace", fontSize: '12px', cursor: 'pointer',
    padding: '9px 22px', borderRadius: '8px', transition: 'all 0.3s'
  }
  if (variant === 'solid') return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ ...baseStyle, background: hovered ? '#fff' : '#00ff88', color: '#000', fontWeight: '800', border: 'none', boxShadow: hovered ? '0 0 30px rgba(0,255,136,0.5)' : 'none' }}>
      {label}
    </button>
  )
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ ...baseStyle, background: 'transparent', color: hovered ? '#00d4ff' : '#00ff88', border: `1px solid ${hovered ? 'rgba(0,212,255,0.6)' : 'rgba(0,255,136,0.4)'}` }}>
      {label}
    </button>
  )
}

function HeroBtn({ label, variant, onClick }) {
  const [hovered, setHovered] = useState(false)
  if (variant === 'primary') return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
        backgroundSize: '200% 200%', animation: 'gradientShift 3s ease infinite',
        color: '#000', fontWeight: '800', fontFamily: "'Space Mono', monospace",
        padding: '17px 40px', borderRadius: '12px', fontSize: '15px', border: 'none',
        cursor: 'pointer', transform: hovered ? 'scale(1.06)' : 'scale(1)',
        boxShadow: hovered ? '0 0 50px rgba(0,255,136,0.45)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
      {label}
    </button>
  )
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(0,255,136,0.07)' : 'transparent',
        border: `1px solid ${hovered ? 'rgba(0,212,255,0.6)' : 'rgba(0,255,136,0.4)'}`,
        color: hovered ? '#00d4ff' : '#00ff88',
        padding: '17px 40px', borderRadius: '12px',
        fontFamily: "'Space Mono', monospace", fontSize: '15px',
        cursor: 'pointer', transition: 'all 0.3s ease'
      }}>
      {label}
    </button>
  )
}

function ConditionCard({ delay, topBar, iconBg, iconBorder, hoverBorder, hoverShadow, icon, title, desc, riskLabel, riskColor, riskWidth, riskGrad, riskText, stat }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`card reveal ${delay}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', borderRadius: '20px', overflow: 'hidden',
        border: `1px solid ${hovered ? hoverBorder : 'rgba(255,255,255,0.05)'}`,
        background: '#0d0d10', padding: 0,
        boxShadow: hovered ? `0 24px 80px ${hoverShadow}` : 'none',
        transition: 'all 0.4s ease'
      }}
    >
      <div style={{ height: '4px', background: topBar }} />
      <div style={{ padding: '32px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '14px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: iconBg, border: `1px solid ${iconBorder}`
        }}>
          {icon}
        </div>
        <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: '20px', color: '#fff', marginTop: '20px' }}>{title}</h3>
        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', marginTop: '12px' }}>{desc}</p>
        <div style={{ marginTop: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#444', fontSize: '12px' }}>{riskText}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: riskColor }}>{riskLabel}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', height: '6px', borderRadius: '3px' }}>
            <div style={{ width: riskWidth, background: riskGrad, borderRadius: '3px', height: '100%', transition: 'width 1.2s ease' }} />
          </div>
        </div>
        <div style={{ marginTop: '20px', fontFamily: "'Space Mono', monospace", fontSize: '13px', color: riskColor }}>{stat}</div>
      </div>
    </div>
  )
}
