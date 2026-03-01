import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [user, setUser] = useState(null)
  const [showInputs, setShowInputs] = useState(false)
  const [gaugeActive, setGaugeActive] = useState(false)

  useEffect(() => {
    const r = localStorage.getItem('vitalscan_results')
    const u = localStorage.getItem('vitalscan_user')
    if (!r) { navigate('/form'); return }
    setResults(JSON.parse(r))
    if (u) setUser(JSON.parse(u))
    const t = setTimeout(() => setGaugeActive(true), 400)
    return () => clearTimeout(t)
  }, [navigate])

  const signOut = () => {
    localStorage.removeItem('vitalscan_token')
    localStorage.removeItem('vitalscan_user')
    navigate('/')
  }

  if (!results) return null

  const scoreColor = (score) => score > 65 ? '#ef4444' : score > 35 ? '#f59e0b' : '#00ff88'
  const CIRC = 2 * Math.PI * 60

  const INPUT_LABELS = {
    age: 'Age', sex: 'Sex', height_cm: 'Height (cm)', weight_kg: 'Weight (kg)',
    waist_cm: 'Waist (cm)', family_history_heart: 'Family Heart History',
    family_history_diabetes: 'Family Diabetes History', smoking_status: 'Smoking Status',
    physical_activity: 'Physical Activity', sleep_hours: 'Sleep Hours',
    stress_level: 'Stress Level', sugar_intake: 'Sugar Intake',
    fried_food: 'Fried Food Freq.', water_intake: 'Water Intake',
    screen_time: 'Screen Time', chest_discomfort: 'Chest Discomfort',
    thirst_fatigue: 'Thirst / Fatigue', salt_intake: 'Salt Intake'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 9999, height: '64px',
        background: 'rgba(4,6,5,0.96)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,255,136,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#00ff88' }}>◆</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '16px', letterSpacing: '3px' }}>
            <span style={{ color: '#fff' }}>VITAL</span>
            <span style={{ background: 'linear-gradient(135deg,#00ff88,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SCAN</span>
          </span>
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', color: '#555' }}>
          Risk Assessment Dashboard
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user && (
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#00ff88' }}>
              {user.fullName}
            </span>
          )}
          <button
            onClick={() => navigate('/form')}
            style={{
              padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
              background: 'transparent', border: '1px solid rgba(0,255,136,0.4)',
              color: '#00ff88', fontFamily: "'Space Mono', monospace", fontSize: '12px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,136,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            New Scan
          </button>
          <button
            onClick={signOut}
            style={{
              padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
              color: '#444', fontFamily: "'Space Mono', monospace", fontSize: '12px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#777'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#444'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Compounding alert */}
      {results.compoundingAlert && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', borderTop: '3px solid #ef4444',
          borderBottom: '1px solid rgba(239,68,68,0.2)',
          padding: '16px 48px', display: 'flex', alignItems: 'center', gap: '16px',
          animation: 'glow 2s ease infinite'
        }}>
          <span style={{ fontSize: '20px', color: '#ef4444' }}>⚠️</span>
          <span style={{ color: '#fca5a5', fontSize: '14px', flex: 1 }}>{results.compoundingMessage}</span>
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: '11px',
            background: 'rgba(239,68,68,0.15)', color: '#ef4444',
            borderRadius: '4px', padding: '4px 10px', whiteSpace: 'nowrap'
          }}>
            COMPOUNDING RISK DETECTED
          </span>
        </div>
      )}

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px' }}>
        {/* Section 1: Risk score cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', marginBottom: '48px' }}>
          {[
            { key: 'heartRisk', label: 'HEART DISEASE RISK', riskLabel: results.heartLabel, score: results.heartRisk, color: scoreColor(results.heartRisk), accent: '#ef4444', delay: '0s' },
            { key: 'diabetesRisk', label: 'DIABETES RISK', riskLabel: results.diabetesLabel, score: results.diabetesRisk, color: scoreColor(results.diabetesRisk), accent: '#f59e0b', delay: '0.15s' },
            { key: 'obesityRisk', label: 'OBESITY RISK', riskLabel: results.obesityLabel, score: results.obesityRisk, color: scoreColor(results.obesityRisk), accent: '#00d4ff', delay: '0.3s' }
          ].map(card => {
            const offset = gaugeActive ? CIRC - (card.score / 100) * CIRC : CIRC
            return (
              <div key={card.key} style={{
                background: '#0d0d10', borderRadius: '24px', padding: '36px',
                border: `2px solid ${card.color}40`,
                boxShadow: card.score > 65 ? `0 0 40px ${card.color}20` : 'none',
                animation: `scaleIn 0.6s ${card.delay} both`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: card.accent, letterSpacing: '2px' }}>
                    {card.label}
                  </span>
                  <span style={{
                    fontFamily: "'Space Mono', monospace", fontSize: '12px',
                    background: `${card.color}25`, color: card.color,
                    borderRadius: '4px', padding: '4px 10px'
                  }}>
                    {card.riskLabel}
                  </span>
                </div>

                {/* Gauge */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    <circle
                      cx="80" cy="80" r="60" fill="none"
                      stroke={card.color} strokeWidth="12"
                      strokeDasharray={CIRC}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      transform="rotate(-90 80 80)"
                      style={{ transition: 'stroke-dashoffset 1.5s ease' }}
                    />
                    <text x="80" y="75" textAnchor="middle" fill="#fff" fontSize="28" fontFamily="Space Mono" fontWeight="700">
                      {card.score}%
                    </text>
                    <text x="80" y="96" textAnchor="middle" fill="#444" fontSize="11" fontFamily="Space Mono">
                      RISK SCORE
                    </text>
                  </svg>
                </div>

                {/* BMI badge on obesity card */}
                {card.key === 'obesityRisk' && results.bmi && (
                  <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(0,212,255,0.06)', borderRadius: '8px', border: '1px solid rgba(0,212,255,0.15)' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#00d4ff' }}>
                      BMI: {results.bmi}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Section 2: Action Plan */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '28px', color: '#fff', marginBottom: '8px' }}>
            Your Priority Action Plan
          </h2>
          <p style={{ color: '#555', fontSize: '14px', marginBottom: '28px' }}>
            Ranked by impact. Specific to your risk profile.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {results.actionPlan.map((action, i) => {
              const rankColor = i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#00d4ff'
              return (
                <ActionCard key={i} rank={i} action={action} color={rankColor} />
              )
            })}
          </div>
        </div>

        {/* Section 3: Input Summary */}
        <div style={{ marginBottom: '48px' }}>
          <button
            onClick={() => setShowInputs(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0
            }}
          >
            <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: '18px', color: '#fff' }}>
              Your Input Summary
            </h3>
            <span style={{ color: '#555', fontSize: '18px', transition: 'transform 0.3s', transform: showInputs ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>▾</span>
          </button>
          {showInputs && results.inputs && (
            <div style={{
              background: '#0d0d10', borderRadius: '16px', padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px'
            }}>
              {Object.entries(results.inputs).map(([key, val]) => (
                <div key={key}>
                  <div style={{ color: '#444', fontSize: '11px', fontFamily: "'Space Mono', monospace", letterSpacing: '1px', marginBottom: '4px' }}>
                    {INPUT_LABELS[key] || key}
                  </div>
                  <div style={{ color: '#fff', fontSize: '14px' }}>{val || '—'}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Disclaimer + Actions */}
        <div style={{
          background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '14px', padding: '24px 32px', display: 'flex', gap: '16px',
          alignItems: 'flex-start', marginBottom: '32px'
        }}>
          <span style={{ fontSize: '22px' }}>⚠️</span>
          <p style={{ color: '#777', fontSize: '13px', lineHeight: '1.7' }}>
            VitalScan is an awareness and educational tool only. These risk scores are computed from lifestyle inputs and do not constitute a medical diagnosis. Always consult a qualified healthcare professional for medical decisions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/form')}
            style={{
              padding: '14px 32px', borderRadius: '10px', cursor: 'pointer',
              background: 'transparent', border: '1px solid rgba(0,255,136,0.4)',
              color: '#00ff88', fontFamily: "'Space Mono', monospace", fontSize: '13px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,136,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            Take New Assessment
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '14px 32px', borderRadius: '10px', cursor: 'pointer',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
              color: '#555', fontFamily: "'Space Mono', monospace", fontSize: '13px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#888' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#555' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionCard({ rank, action, color }) {
  const [hovered, setHovered] = useState(false)
  const labels = ['01', '02', '03']
  const rankLabels = ['PRIORITY 1', 'PRIORITY 2', 'PRIORITY 3']
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '20px',
        background: '#0d0d10', borderRadius: '16px', padding: '24px',
        border: `1px solid ${hovered ? color + '40' : 'rgba(255,255,255,0.05)'}`,
        transform: hovered ? 'translateX(6px)' : 'translateX(0)',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: color + '20', border: `1px solid ${color}`,
        fontFamily: "'Space Mono', monospace", fontWeight: '700', fontSize: '14px', color
      }}>
        {labels[rank]}
      </div>
      <div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#444', letterSpacing: '2px' }}>
          {rankLabels[rank]}
        </div>
        <div style={{ color: '#fff', fontSize: '15px', lineHeight: '1.6', marginTop: '4px' }}>{action}</div>
      </div>
    </div>
  )
}
