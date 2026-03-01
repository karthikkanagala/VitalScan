import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEP_META = [
  { label: 'Personal', title: 'Personal Metrics', sub: 'Basic biometric information — no medical tests required.' },
  { label: 'History', title: 'Health History', sub: 'Family and lifestyle background factors.' },
  { label: 'Lifestyle', title: 'Lifestyle Habits', sub: 'Your daily routines and dietary patterns.' },
  { label: 'Symptoms', title: 'Symptoms Check', sub: 'Self-reported clinical indicators.' }
]

const DEFAULTS = {
  age: '', sex: 'Male',
  height_cm: '', weight_kg: '', waist_cm: '',
  family_history_heart: 'No', family_history_diabetes: 'No',
  smoking_status: 'Never',
  physical_activity: 'Light',
  sleep_hours: '7-8',
  stress_level: 'Moderate',
  sugar_intake: 'Moderate',
  fried_food: 'Sometimes',
  water_intake: '1-2L',
  screen_time: '2-4hrs',
  chest_discomfort: 'Never',
  thirst_fatigue: 'Never',
  salt_intake: 'Moderate'
}

export default function FormPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(DEFAULTS)
  const [loading, setLoading] = useState(false)

  const set = (field, value) => setFormData(p => ({ ...p, [field]: value }))

  const handleSubmit = () => {
    setLoading(true)
    const { age, height_cm, weight_kg, waist_cm, family_history_heart, family_history_diabetes,
      smoking_status, physical_activity, sleep_hours, stress_level, sugar_intake,
      fried_food, water_intake, screen_time, chest_discomfort, thirst_fatigue, salt_intake, sex } = formData

    const bmi = parseFloat(weight_kg) / Math.pow(parseFloat(height_cm) / 100, 2)
    const whr = parseFloat(waist_cm) / parseFloat(height_cm)
    const ageN = parseInt(age)

    let heartScore = 20
    heartScore += (ageN > 45 ? 15 : ageN > 35 ? 8 : 0)
    heartScore += (sex === 'Male' ? 5 : 0)
    heartScore += (family_history_heart === 'Yes' ? 15 : 0)
    heartScore += (smoking_status === 'Current' ? 20 : smoking_status === 'Former' ? 8 : 0)
    heartScore += (physical_activity === 'Sedentary' ? 12 : physical_activity === 'Light' ? 5 : 0)
    heartScore += (sleep_hours === '<5' ? 8 : sleep_hours === '5-6' ? 4 : 0)
    heartScore += (stress_level === 'High' ? 10 : stress_level === 'Moderate' ? 4 : 0)
    heartScore += (fried_food === 'Frequently' ? 6 : 0)
    heartScore += (chest_discomfort === 'Frequently' ? 12 : chest_discomfort === 'Occasionally' ? 5 : 0)
    heartScore += (salt_intake === 'High' ? 6 : 0)
    heartScore = Math.min(97, Math.max(5, heartScore))

    let diabetesScore = 15
    diabetesScore += (ageN > 40 ? 12 : ageN > 30 ? 6 : 0)
    diabetesScore += (family_history_diabetes === 'Yes' ? 18 : 0)
    diabetesScore += (bmi > 30 ? 16 : bmi > 25 ? 8 : 0)
    diabetesScore += (sugar_intake === 'High' ? 14 : sugar_intake === 'Moderate' ? 6 : 0)
    diabetesScore += (physical_activity === 'Sedentary' ? 10 : physical_activity === 'Light' ? 4 : 0)
    diabetesScore += (sleep_hours === '<5' ? 8 : sleep_hours === '5-6' ? 4 : 0)
    diabetesScore += (stress_level === 'High' ? 8 : stress_level === 'Moderate' ? 3 : 0)
    diabetesScore += (thirst_fatigue === 'Often' ? 10 : thirst_fatigue === 'Sometimes' ? 4 : 0)
    diabetesScore += (water_intake === '<1L' ? 5 : 0)
    diabetesScore = Math.min(97, Math.max(5, diabetesScore))

    let obesityScore = 5
    obesityScore += (bmi > 35 ? 40 : bmi > 30 ? 30 : bmi > 27 ? 18 : bmi > 25 ? 10 : 0)
    obesityScore += (whr > 0.6 ? 20 : whr > 0.5 ? 10 : 0)
    obesityScore += (physical_activity === 'Sedentary' ? 12 : physical_activity === 'Light' ? 5 : 0)
    obesityScore += (fried_food === 'Frequently' ? 10 : fried_food === 'Sometimes' ? 4 : 0)
    obesityScore += (sleep_hours === '<5' ? 8 : 0)
    obesityScore += (screen_time === '>4hrs' ? 6 : 0)
    obesityScore = Math.min(97, Math.max(5, obesityScore))

    let compoundingAlert = false
    let compoundingMessage = ''
    if (diabetesScore > 50 && bmi > 25) {
      heartScore = Math.min(97, heartScore + 10)
      compoundingAlert = true
      compoundingMessage = 'Your elevated diabetes risk combined with high BMI has increased your heart disease risk flag — these conditions are clinically linked.'
    }
    if (heartScore > 60 && diabetesScore > 50) {
      compoundingAlert = true
      compoundingMessage = 'High heart risk and moderate diabetes risk detected simultaneously. Compounding effect identified — priority intervention recommended.'
    }

    const getLabel = s => s > 65 ? 'HIGH RISK' : s > 35 ? 'MODERATE' : 'LOW RISK'

    const actions = []
    if (smoking_status === 'Current') actions.push('Quit smoking — the single highest-impact change for your cardiovascular health')
    if (physical_activity === 'Sedentary' || physical_activity === 'Light') actions.push('Increase to 8,000 daily steps — reduces both your diabetes and heart risk significantly')
    if (sugar_intake === 'High' || sugar_intake === 'Moderate') actions.push('Reduce refined sugar to under 25g daily — directly lowers your diabetes risk score')
    if (bmi > 25) actions.push('Target 5-7% body weight reduction — lowers all three risk scores simultaneously')
    if (stress_level === 'High') actions.push('Practice daily stress management (10min meditation) — reduces cortisol-linked diabetes risk')
    if (sleep_hours === '<5' || sleep_hours === '5-6') actions.push('Target 7-8 hours sleep — poor sleep is directly linked to weight gain and glucose spikes')
    if (salt_intake === 'High') actions.push('Reduce daily salt intake below 5g — directly reduces cardiovascular strain')
    const topActions = actions.slice(0, 3)
    if (topActions.length < 3) topActions.push('Schedule annual preventive health checkup with your primary care physician')

    const results = {
      heartRisk: Math.round(heartScore),
      diabetesRisk: Math.round(diabetesScore),
      obesityRisk: Math.round(obesityScore),
      heartLabel: getLabel(heartScore),
      diabetesLabel: getLabel(diabetesScore),
      obesityLabel: getLabel(obesityScore),
      compoundingAlert,
      compoundingMessage,
      actionPlan: topActions,
      bmi: Math.round(bmi * 10) / 10,
      inputs: formData
    }

    localStorage.setItem('vitalscan_results', JSON.stringify(results))
    setTimeout(() => { setLoading(false); navigate('/dashboard') }, 2500)
  }

  const stepOk = () => {
    if (step === 1) return formData.age && formData.height_cm && formData.weight_kg && formData.waist_cm
    return true
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Navbar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10000, height: '64px',
        background: 'rgba(4,6,5,0.96)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,255,136,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px'
      }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <span style={{ color: '#00ff88' }}>◆</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '16px', letterSpacing: '3px' }}>
            <span style={{ color: '#fff' }}>VITAL</span>
            <span style={{ background: 'linear-gradient(135deg,#00ff88,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SCAN</span>
          </span>
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#444' }}>
          Risk Assessment Form
        </div>
        <div style={{ width: '80px' }} />
      </div>

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, background: '#0a0a0a', zIndex: 99999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg viewBox="0 0 80 80" width="80" height="80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(0,255,136,0.1)" strokeWidth="4" />
            <circle cx="40" cy="40" r="34" fill="none" stroke="#00ff88" strokeWidth="4"
              strokeDasharray="60 150" strokeLinecap="round"
              style={{ animation: 'rotateGradient 1s linear infinite', transformOrigin: 'center' }} />
          </svg>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '18px', color: '#fff', marginTop: '24px' }}>
            Analyzing Your Risk Profile...
          </div>
          <div style={{ fontSize: '14px', color: '#555', marginTop: '8px' }}>Running 3 prediction models...</div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88',
                animation: `blink 1.2s ${i * 0.4}s infinite`
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '100px 24px 60px' }}>
        {/* Progress */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            {STEP_META.map((s, i) => (
              <span key={i} style={{
                fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '1px',
                color: step === i + 1 ? '#00ff88' : step > i + 1 ? '#00d4ff' : '#333'
              }}>
                {s.label}
              </span>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', height: '2px', borderRadius: '2px' }}>
            <div style={{
              background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
              width: `${(step / 4) * 100}%`, height: '100%',
              borderRadius: '2px', transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        {/* Step header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#00ff88', letterSpacing: '3px', marginBottom: '8px' }}>
            STEP {step} OF 4
          </div>
          <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '32px', color: '#fff' }}>
            {STEP_META[step - 1].title}
          </h2>
          <p style={{ color: '#555', fontSize: '14px', marginTop: '8px' }}>{STEP_META[step - 1].sub}</p>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <NumField label="AGE" placeholder="e.g. 35" value={formData.age} onChange={v => set('age', v)} />
            <div>
              <FieldLabel>SEX</FieldLabel>
              <ToggleGroup options={['Male', 'Female', 'Other']} value={formData.sex} onChange={v => set('sex', v)} />
            </div>
            <NumField label="HEIGHT (CM)" placeholder="e.g. 170" value={formData.height_cm} onChange={v => set('height_cm', v)} />
            <NumField label="WEIGHT (KG)" placeholder="e.g. 70" value={formData.weight_kg} onChange={v => set('weight_kg', v)} />
            <NumField label="WAIST CIRCUMFERENCE (CM)" placeholder="e.g. 85" value={formData.waist_cm} onChange={v => set('waist_cm', v)} />
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <FieldLabel>FAMILY HISTORY OF HEART DISEASE</FieldLabel>
              <ToggleGroup options={['Yes', 'No']} value={formData.family_history_heart} onChange={v => set('family_history_heart', v)} />
            </div>
            <div>
              <FieldLabel>FAMILY HISTORY OF DIABETES</FieldLabel>
              <ToggleGroup options={['Yes', 'No']} value={formData.family_history_diabetes} onChange={v => set('family_history_diabetes', v)} />
            </div>
            <div>
              <FieldLabel>SMOKING STATUS</FieldLabel>
              <ToggleGroup options={['Never', 'Former', 'Current']} value={formData.smoking_status} onChange={v => set('smoking_status', v)} />
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <FieldLabel>PHYSICAL ACTIVITY LEVEL</FieldLabel>
              <ToggleGroup options={['Sedentary', 'Light', 'Moderate', 'Active']} value={formData.physical_activity} onChange={v => set('physical_activity', v)} />
            </div>
            <div>
              <FieldLabel>AVERAGE SLEEP HOURS</FieldLabel>
              <ToggleGroup options={['<5', '5-6', '7-8', '>8']} value={formData.sleep_hours} onChange={v => set('sleep_hours', v)} />
            </div>
            <div>
              <FieldLabel>STRESS LEVEL</FieldLabel>
              <ToggleGroup options={['Low', 'Moderate', 'High']} value={formData.stress_level} onChange={v => set('stress_level', v)} />
            </div>
            <div>
              <FieldLabel>DAILY SUGAR INTAKE</FieldLabel>
              <ToggleGroup options={['Low', 'Moderate', 'High']} value={formData.sugar_intake} onChange={v => set('sugar_intake', v)} />
            </div>
            <div>
              <FieldLabel>FRIED / JUNK FOOD FREQUENCY</FieldLabel>
              <ToggleGroup options={['Rarely', 'Sometimes', 'Frequently']} value={formData.fried_food} onChange={v => set('fried_food', v)} />
            </div>
            <div>
              <FieldLabel>DAILY WATER INTAKE</FieldLabel>
              <ToggleGroup options={['<1L', '1-2L', '2-3L', '>3L']} value={formData.water_intake} onChange={v => set('water_intake', v)} />
            </div>
            <div>
              <FieldLabel>DAILY SCREEN TIME</FieldLabel>
              <ToggleGroup options={['<2hrs', '2-4hrs', '>4hrs']} value={formData.screen_time} onChange={v => set('screen_time', v)} />
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <FieldLabel>CHEST DISCOMFORT / PALPITATIONS</FieldLabel>
              <ToggleGroup options={['Never', 'Occasionally', 'Frequently']} value={formData.chest_discomfort} onChange={v => set('chest_discomfort', v)} />
            </div>
            <div>
              <FieldLabel>EXCESS THIRST OR FATIGUE</FieldLabel>
              <ToggleGroup options={['Never', 'Sometimes', 'Often']} value={formData.thirst_fatigue} onChange={v => set('thirst_fatigue', v)} />
            </div>
            <div>
              <FieldLabel>SALT INTAKE LEVEL</FieldLabel>
              <ToggleGroup options={['Low', 'Moderate', 'High']} value={formData.salt_intake} onChange={v => set('salt_intake', v)} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '16px' }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(p => p - 1)}
              style={{
                padding: '14px 32px', borderRadius: '10px', cursor: 'pointer',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                color: '#555', fontFamily: "'Space Mono', monospace", fontSize: '13px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#888' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#555' }}
            >
              ← Back
            </button>
          ) : <div />}

          <button
            onClick={step < 4 ? () => setStep(p => p + 1) : handleSubmit}
            disabled={!stepOk()}
            style={{
              padding: '14px 40px', borderRadius: '10px', cursor: stepOk() ? 'pointer' : 'not-allowed',
              background: stepOk() ? 'linear-gradient(135deg, #00ff88, #00d4ff)' : 'rgba(255,255,255,0.05)',
              color: stepOk() ? '#000' : '#333', fontWeight: '800',
              fontFamily: "'Space Mono', monospace", fontSize: '14px',
              border: 'none', transition: 'all 0.3s', opacity: stepOk() ? 1 : 0.5
            }}
            onMouseEnter={e => { if (stepOk()) { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,136,0.3)' } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            {step < 4 ? 'Next Step →' : 'Analyze My Risk →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function FieldLabel({ children }) {
  return (
    <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#555', letterSpacing: '1.5px', marginBottom: '10px' }}>
      {children}
    </label>
  )
}

function NumField({ label, placeholder, value, onChange }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type="number" inputMode="numeric" placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
          padding: '16px 20px', color: '#fff', fontSize: '16px', outline: 'none',
          fontFamily: 'system-ui', boxSizing: 'border-box', transition: 'all 0.3s'
        }}
        onFocus={e => { e.target.style.borderColor = '#00ff88'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,136,0.08)' }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
      />
    </div>
  )
}

function ToggleGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(options.length, 4)}, 1fr)`, gap: '10px' }}>
      {options.map(opt => (
        <div
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '12px 8px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
            fontFamily: "'Space Mono', monospace", fontSize: '12px', transition: 'all 0.2s',
            background: value === opt ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${value === opt ? '#00ff88' : 'rgba(255,255,255,0.06)'}`,
            color: value === opt ? '#00ff88' : '#555'
          }}
        >
          {opt}
        </div>
      ))}
    </div>
  )
}
