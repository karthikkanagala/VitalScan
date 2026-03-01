# 🏥 VitalScan - AI Health Risk Detection Platform

A comprehensive health monitoring and risk assessment system powered by AI. VitalScan helps users understand their cardiovascular, metabolic, and lifestyle health risks through an intuitive dark-themed interface.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Running the Project](#running-the-project)
- [How It Works (Workflow)](#how-it-works-workflow)
- [Frontend Pages & Components](#-pages--components-detailed-explanation)
- [Frontend Routing & App Structure](#-frontend-routing--app-structure)
- [API Endpoints](#api-endpoints)
- [Folder Guide](#folder-guide)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Technologies](#technologies)

---

## 🎯 Overview

VitalScan is a full-stack web application that:
1. **Collects comprehensive health data** from users (personal info, medical history, lifestyle habits)
2. **Uses machine learning models** to calculate health risk scores
3. **Provides interactive visualizations** and personalized recommendations
4. **Simulates lifestyle changes** to show impact on health outcomes

### What Does It Do?

VitalScan analyzes **three major health risks**:

- **🫀 Heart Disease Risk (0-100%)**
  - Predicts cardiovascular disease likelihood
  - Considers: age, smoking status, family history, stress levels, sleep quality, physical activity
  - Example: A 55-year-old smoker with high stress might get 72% risk (HIGH)

- **🩸 Diabetes Risk (0-100%)**
  - Predicts Type 2 diabetes likelihood
  - Considers: BMI, weight, family history, sugar intake, water consumption, physical activity
  - Example: An overweight person with high sugar intake might get 64% risk (MODERATE)

- **⚖️ Obesity Risk (0-100%)**
  - Calculates BMI and body composition risk
  - Considers: weight, height, waist circumference, lifestyle factors
  - Example: Someone with BMI 32 automatically gets elevated obesity score

### How Does It Calculate Risk?

The backend uses three approaches:
1. **ML Models** (for heart & diabetes): Pre-trained scikit-learn models loaded from `.pkl` files
2. **Pure Logic** (for obesity): Mathematical formulas based on BMI and lifestyle
3. **Fallback Calculations**: If models missing, uses weighted equations

Every prediction includes an **action plan** - 3 personalized recommendations ranked by impact.

**Perfect for**: Health-conscious individuals, preventive care, wellness monitoring, medical research, doctors seeking patient engagement tools.

---

## ✨ Features

✅ **User Authentication** 
- Secure signup/signin with bcrypt password hashing
- JWT tokens stored in localStorage (60-minute expiry)
- Protected routes that redirect to signin if not authenticated

✅ **AI-Powered Risk Assessment** 
- Heart disease, diabetes, and obesity risk scoring (0-100%)
- Risk labels: Low (<35%), Moderate (35-65%), High (>65%)
- Compounding risk alerts when multiple scores are high
- Fallback calculations if ML models unavailable

✅ **Multi-Step Health Form** 
- 4-step guided questionnaire with smooth transitions
- Step 1: Personal Info (age, sex, height, weight, waist circumference)
- Step 2: Medical History (family disease, smoking status)
- Step 3: Lifestyle (activity, sleep, stress, diet, water, screen time)
- Step 4: Symptoms (chest discomfort, thirst, salt intake)
- Real-time validation and progress indicator

✅ **Interactive Dashboard** 
- Animated circular gauges showing risk percentages
- Number counters that count from 0 to final score in 1.5 seconds
- Interconnected risk alert banner when multiple scores elevated
- Responsive grid layout for all screen sizes

✅ **Lifestyle Simulator** 
- Adjust BMI, activity, sleep, and sugar intake with sliders
- See risk scores update in real-time (< 100ms on cache hit)
- Results cached in Redis for instant performance
- Live feedback with smooth animations

✅ **Dark Cyberpunk UI** 
- Black (#0a0a0a) base with electric green (#00ff88) accents
- Sleek glassmorphism cards with backdrop blur
- Space Mono headings + Inter body font
- 20 floating particle orbs with slow drifting animation
- Smooth page transitions with fade + slide animations
- Hover effects on all interactive elements (scale, glow, border flash)

✅ **Responsive Design** 
- Mobile-first approach
- Works on phone, tablet, and desktop
- Touch-friendly buttons and forms
- Adaptive grid layouts using Tailwind

✅ **Real-time Updates** 
- Smooth animations on all transitions (300-500ms)
- Instant form validation with error messages
- Animated number counters on dashboard gauges
- Real-time slider feedback in simulator
- Page route changes with fade-in animations  

---

## 📁 Project Structure

```
vitalscan/
│
├── 📂 .github/
│   └── Most files for GitHub Actions CI/CD workflows (for automation)
│
├── 📂 backend/                          # 🟦 PYTHON FASTAPI SERVER
│   ├── 📄 main.py                    # ⭐ Entry point - starts the API server
│   ├── 📂 app/
│   │   ├── 📄 main.py               # FastAPI app initialization
│   │   ├── 📄 database.py           # Database & Redis connection setup
│   │   ├── 📂 routes/               # All API endpoints (signup, signin, predict, etc.)
│   │   └── 📂 utils/                # Helper functions for risk calculation logic
│   ├── 📂 models/                   # ⚠️  PLACE YOUR .PKL FILES HERE (ML models)
│   └── 📂 data/                     # ⚠️  PLACE YOUR .CSV FILES HERE (training data)
│
├── 📂 frontend/                        # 🟨 REACT + VITE + TAILWIND
│   ├── 📄 package.json              # Node.js dependencies & project metadata
│   ├── 📄 vite.config.js            # Vite build configuration
│   ├── 📄 tailwind.config.js        # Tailwind CSS customization
│   ├── 📄 index.html                # Main HTML template
│   │
│   └── 📂 src/
│       ├── 📄 App.jsx               # Main app component with routing
│       ├── 📄 index.css             # Global styles & keyframe animations
│       ├── 📄 main.jsx              # React entry point
│       │
│       ├── 📂 components/           # ♻️ REUSABLE COMPONENTS
│       │   ├── 📄 Navbar.jsx        # Navigation bar
│       │   ├── 📄 RiskGauge.jsx     # Circular risk score gauge
│       │   ├── 📄 StepProgress.jsx  # Multi-step form indicator
│       │   └── 📄 ActionPlanCard.jsx # Action recommendation card
│       │
│       ├── 📂 pages/                # 📄 FULL PAGES (routes)
│       │   ├── 📄 LandingPage.jsx   # Home page with hero & features
│       │   ├── 📄 SigninPage.jsx    # Login page
│       │   ├── 📄 SignupPage.jsx    # Registration page
│       │   ├── 📄 InputFormPage.jsx # 4-step health form
│       │   └── 📄 DashboardPage.jsx # Main dashboard with results
│       │
│       └── 📂 assets/               # Images, icons, logos (if added)
│
├── 📄 .gitignore                      # Tell Git to ignore node_modules, __pycache__, etc
└── 📄 README.md                       # This file! Project documentation

```

### 📌 What Goes Where?

| Folder | What to put there | Example |
|--------|-------------------|---------|
| `backend/models/` | Machine learning model files | `heart_disease_model.pkl`, `diabetes_model.pkl` |
| `backend/data/` | Training data and datasets | `health_data.csv`, `patient_records.csv` |
| `frontend/src/assets/` | Images, icons, logos | `logo.png`, `icon.svg` |

---

## 🔧 Prerequisites

Before you start, you need to have these installed on your computer:

### 1. **Python** (for backend)
- Download from [python.org](https://www.python.org/downloads/)
- Version: **3.8 or higher**
- After installation, verify by opening terminal:
  ```bash
  python --version
  ```

### 2. **Node.js & npm** (for frontend)
- Download from [nodejs.org](https://nodejs.org/)
- Version: **Node 16+ with npm 8+**
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 3. **Git** (for version control - optional but recommended)
- Download from [git-scm.com](https://git-scm.com/)
- Verify:
  ```bash
  git --version
  ```

### 4. **Code Editor**
- Recommended: [Visual Studio Code](https://code.visualstudio.com/)
- Free and beginner-friendly

---

## 🚀 Installation Guide

### Step 1️⃣: Clone or Download the Project

**Option A - Using Git (recommended):**
```bash
git clone <repository-url>
cd vitalscan
```

**Option B - Manual Download:**
- Download ZIP from GitHub
- Extract to your desired location
- Open terminal in the `vitalscan` folder

### Step 2️⃣: Backend Setup (Python)

Navigate to the backend folder:
```bash
cd backend
```

**Create Virtual Environment** (isolates project dependencies):
```bash
# On Windows:
python -m venv venv

# On macOS/Linux:
python3 -m venv venv
```

**Activate Virtual Environment:**
```bash
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

You should see `(venv)` at the beginning of your terminal line.

**Install Python Dependencies:**
```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary aioredis python-dotenv pydantic scikit-learn pandas numpy
```

**Create `.env` file** in the `backend/` folder with:
```env
DATABASE_URL=postgresql://user:password@localhost/vitalscan
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key_here_change_in_production
```

> 💡 **Note:** For local development, you can use SQLite instead. Update `database.py` accordingly.

### Step 3️⃣: Frontend Setup (Node.js)

Open a **new terminal** (keep backend terminal open in another window) and navigate to frontend:
```bash
cd frontend
```

**Install JavaScript Dependencies:**
```bash
npm install
```

This downloads all required packages listed in `package.json` (~500MB, takes 1-2 minutes).

---

## ▶️ Running the Project

### 🟦 Run Backend (Terminal 1)

Keep the backend terminal open with venv activated:
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
Uvicorn running on http://127.0.0.1:8000
Press CTRL+C to quit
```

✅ Backend API is now running at `http://localhost:8000`

**Test the API:** Open your browser and go to `http://localhost:8000/docs` to see the Swagger documentation.

---

### 🟨 Run Frontend (Terminal 2)

Open a **new terminal**, navigate to frontend:
```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v4.x.x  ready in x ms
➜ Local: http://localhost:5173/
➜ Network: use --host to expose
```

✅ Frontend is now running at `http://localhost:5173`

**Click the local URL or copy it to your browser.**

---

## 🔄 How It Works (Workflow)

### Complete User Journey (With Updated Routing)

```
1. User Opens Application
   └─ localhost:5173 (or direct URL access)
      ↓
      [App.jsx Router Loads]
      ↓
      [No Token in localStorage → Route "/" → LandingPage]
      ↓

2. Landing Page (Default Entry Point)
   ├─ Reads about VitalScan features
   ├─ Learns about 3 health conditions
   ├─ Sees how platform works
   ├─ Views live simulation preview
   └─ Reviews medical disclaimer
      ↓
      [User sees 2 options: "Get Started" or "Sign In"]
      ↓
      ├─ If NEW user → Clicks "Get Started"
      │  └─ Redirected to /signup
      │
      └─ If EXISTING user → Clicks "Sign In"  
         └─ Redirected to /signin
         
      ↓ [Following NEW USER path] ↓

3. Sign Up Page
   ├─ Enters: Full Name, Email, Password
   ├─ Password strength indicator validates password
   └─ Clicks "Create Account"
      ↓
      → POST /api/signup
      ↓
      → Backend: Creates user in PostgreSQL
      ↓
      → Backend: Hashes password with bcrypt
      ↓
      → Backend: Returns JWT token (60 min expiry)
      ↓
      → Frontend: Saves token to localStorage
      ↓
      → Frontend: useNavigate("/form")
      ↓

4. Health Input Form (4-Step Assessment)
   ├─ Step 1/4: Personal Information
   │  └─ Age, Sex, Height (cm), Weight (kg), Waist Circumference
   │
   ├─ Step 2/4: Medical History
   │  └─ Family history (heart/diabetes), Smoking status
   │
   ├─ Step 3/4: Lifestyle Factors
   │  └─ Activity level, Sleep hours, Stress, Diet, Water intake
   │
   └─ Step 4/4: Symptoms
      └─ Chest discomfort, Thirst/Fatigue, Salt intake
      ↓
      [StepProgress shows visual indicator of completion]
      ↓
      [User clicks "Get Risk Assessment"]
      ↓
      → POST /api/predict (with all health data)
      ↓
      → Backend: Feature engineering (raw values → ML inputs)
      ↓
      → Backend: Loads pre-trained ML models
      ↓
      → Backend: Runs 3 predictions (heart, diabetes, obesity)
      ↓
      → Backend: Calculates fallback equations as backup
      ↓
      → Backend: Generates personalized action plans
      ↓
      → Backend: Saves results to PostgreSQL
      ↓
      → Frontend: Receives scores (e.g., heart: 45%, diabetes: 35%, obesity: 28%)
      ↓
      → Frontend: useNavigate("/dashboard")
      ↓

5. Dashboard Page (Results & Simulator)
   ├─ Three RiskGauge Components (Animated Circles)
   │  ├─ Heart Disease Risk: 45% (Red zone - Moderate to High)
   │  ├─ Diabetes Risk: 35% (Yellow zone - Moderate)
   │  └─ Obesity Risk: 28% (Green zone - Low to Moderate)
   │
   ├─ Alert Banner (if 2+ scores are moderate/high)
   │  └─ "Interconnected Risk Alert" - Recommend medical consultation
   │
   ├─ Live Simulation Section
   │  ├─ Slider 1: BMI adjustment (15-40)
   │  ├─ Slider 2: Physical Activity (0-300 min/week)
   │  ├─ Slider 3: Sleep Hours (0-12 per night)
   │  ├─ Slider 4: Sugar Intake (Low/Moderate/High)
   │  └─ [Results cached for instant updates]
   │
   │  Each slider change triggers:
   │  → POST /api/simulate (with new values)
   │  → Backend: Calculates updated scores
   │  → Backend: Checks Redis cache (returns cached if exact parameters exist)
   │  → Scores animate smoothly to new values in real-time
   │
   ├─ Action Plan Cards (3 ranked recommendations)
   │  ├─ 1st Priority (Red): Most urgent action
   │  ├─ 2nd Priority (Yellow): Secondary action
   │  └─ 3rd Priority (Green): Supportive action
   │
   ├─ Medical Disclaimer Box
   │  └─ Explains limitations, recommends consulting healthcare provider
   │
   └─ Footer Options
      ├─ "Try Another Assessment" → Back to /form
      ├─ "View History" → GET /api/history (previous sessions)
      └─ "Logout" → Clear token, redirect to /
      ↓

6. Optional: Login (Existing User Path)
   [From LandingPage, select "Sign In"]
   ↓
   Sign In Page:
   ├─ Enters: Email, Password
   └─ Clicks "Sign In"
      ↓
      → POST /api/signin
      ↓
      → Backend: Finds user by email
      ↓
      → Backend: Bcrypt verification (password hash match)
      ↓
      → Backend: Returns JWT token
      ↓
      → Frontend: Saves token to localStorage
      ↓
      → Frontend: useNavigate("/dashboard") or "/form"
      ↓

7. Token Authentication
   ├─ Token stored in localStorage for persistence
   ├─ Token expires in 60 minutes
   ├─ If token missing/expired when accessing /form or /dashboard
   │  └─ ProtectedRoute redirects to / (landing page)
   │
   └─ If accessing invalidated paths
      └─ Catch-all route also redirects to /
```

**Key Points in Updated Flow:**
- ✅ **Entry point is now LandingPage** (`/`) - users see this first
- ✅ **Public pages** accessible without login: `/`, `/signup`, `/signin`
- ✅ **Protected pages** require valid JWT token: `/form`, `/dashboard`
- ✅ **Automatic redirects**: Invalid routes → `/`, unauthed requests → `/`
- ✅ **Token persistence**: Stays in localStorage until logout or expiration (60 min)

### Data Flow Diagram:
```
Frontend (React)  ←→  Backend (FastAPI)  ←→  Database (PostgreSQL)
   UI/Forms           Risk Calculation        User Data
   Animations         API Endpoints           Health Records
```

---

## 🧠 ML Pipeline & Risk Scoring Explained

### How Risk Scores Are Calculated

The backend uses a sophisticated 6-step prediction pipeline:

#### **Step 1: Feature Engineering**
Raw user inputs are converted to numeric values that ML models understand:
```
Age: 45 → 45 (numeric)
Sex: "Male" → 1, "Female" → 0
Smoking: "Never" → 0, "Former" → 1, "Current" → 2
Activity: "Sedentary" → 3, "Light" → 2, "Moderate" → 1, "Active" → 0
Sleep: "<5" → 3, "5-6" → 2, "7-8" → 0, ">8" → 1
BMI: weight_kg / (height_cm/100)² → Automatically calculated
```

#### **Step 2: ML Model Predictions**
- **Heart Disease Model** loads `heart_model.pkl` from `backend/models/`
  - Input: 15 features (age, sex, BMI, waist, smoking, activity, etc.)
  - Output: Probability → Converts to 0-100% risk
- **Diabetes Model** loads `diabetes_model.pkl`
  - Input: 15 features (includes BMI, family history, sugar intake, etc.)
  - Output: Probability → Converts to 0-100% risk
- **Obesity Risk** uses pure logic (NO ML model)
  - BMI-based scoring: <18.5 (5%), 18.5-24.9 (10%), 25-29.9 (45%), etc.
  - Waist-to-Height Ratio bonus points for central obesity
  - Lifestyle adjustments: sedentary (-8%), poor sleep (-6%), high sugar (-5%)
  - Final score: 0-100%

#### **Step 3: Compounding Risk Adjustment**
When multiple risk factors are elevated, scores increase:
- If diabetes >55% AND obesity >55% → heart score increases by 10 points
- If heart >60% AND diabetes >50% → compounding alert triggered
- Example: User has 55% diabetes and 60% obesity → heart becomes 60% → 70%

#### **Step 4: Risk Labels**
Scores converted to readable labels:
- ✅ **Low Risk**: 0-34% - Continue healthy habits
- ⚠️ **Moderate Risk**: 35-64% - Implement lifestyle changes
- 🔴 **High Risk**: 65-100% - Urgent intervention recommended

#### **Step 5: Action Plan Generation**
3 personalized actions ranked by impact potential:
1. **Highest Impact**: Usually smoking cessation (if applicable)
2. **Second**: Target the highest-scoring risk factor
3. **Third**: Lifestyle improvement (exercise, diet, sleep)

Examples:
- "Quit smoking — single highest impact change for your heart risk"
- "Increase daily steps to 7000 — reduces diabetes risk by ~18%"
- "Reduce fried foods to twice weekly — lowers obesity and heart scores"

#### **Step 6: Caching for Performance**
Results cached in Redis for 300 seconds (5 minutes):
- Live slider changes in simulator use cache
- Same inputs return instant results (< 100ms)
- Different inputs trigger new prediction

### What If Models Are Missing?

If `.pkl` files don't exist, fallback algorithms activate:

**Heart Disease Fallback:**
```
score = (smoking_penalty * 25) + (age_factor * 20) + 
        (family_history * 10) + (stress_factor * 5) + 
        (symptom_factor * 5)
```

**Diabetes Fallback:**
```
score = (bmi_factor * 35) + (family_history * 20) + 
        (age_factor * 15) + (sugar_intake * 10) + 
        (symptom_factor * 5)
```

**Obesity (Always Logic-Based):**
```
score = bmi_base_score + whtr_adjustment + activity_penalty + 
        sleep_penalty + diet_penalty + water_bonus
```

### Database Schema

**Users Table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  hashed_password VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Risk Sessions Table:**
```sql
CREATE TABLE risk_sessions (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY,
  age FLOAT, sex VARCHAR(50), height_cm FLOAT, weight_kg FLOAT, waist_cm FLOAT,
  family_history_heart BOOLEAN, family_history_diabetes BOOLEAN,
  smoking_status VARCHAR(50), physical_activity VARCHAR(50),
  sleep_hours VARCHAR(50), stress_level VARCHAR(50),
  sugar_intake VARCHAR(50), fried_food VARCHAR(50),
  water_intake VARCHAR(50), screen_time VARCHAR(50),
  chest_discomfort VARCHAR(50), thirst_fatigue VARCHAR(50), salt_intake VARCHAR(50),
  heart_risk_score FLOAT, diabetes_risk_score FLOAT, obesity_risk_score FLOAT,
  obesity_category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

These are the server endpoints your frontend calls:

| Method | Endpoint | What It Does | Data Sent |
|--------|----------|--------------|-----------|
| POST | `/api/signup` | Create new user account | `{fullName, email, password}` |
| POST | `/api/signin` | Log in existing user | `{email, password}` |
| POST | `/api/predict` | Calculate risk scores | `{age, sex, height, weight, ...}` |
| POST | `/api/simulate` | Simulate lifestyle change | `{bmi, activity, sleep, sugar}` |
| GET | `/api/user/profile` | Get user info | (requires token header) |

### Example API Call (in frontend code):
```javascript
const response = await fetch('http://localhost:8000/api/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    age: 30,
    sex: 'male',
    height: 175,
    weight: 75,
    // ... more fields
  })
});
```

---

## 📂 Folder Guide for Beginners

### Backend Folder Structure Explained:

```
backend/
├── app/
│   ├── main.py          ← Creates FastAPI app, defines routes
│   ├── database.py      ← Handles PostgreSQL & Redis connections
│   ├── routes/          ← Folder with API endpoint files
│   │   ├── auth.py      ← signup, signin endpoints
│   │   ├── health.py    ← predict, simulate endpoints
│   │   └── user.py      ← user profile endpoints
│   └── utils/
│       ├── risk_calc.py ← Heart, diabetes, obesity scoring logic
│       └── validation.py ← Input validation functions
├── models/              ← Your .pkl (pickle) model files go here
└── data/                ← Your .csv data files go here
```

### Frontend Folder Structure Explained:

```
frontend/src/
├── App.jsx              ← Main component with routing setup
├── index.css            ← Global styles & keyframe animations
│
├── components/          ← Small reusable pieces
│   ├── Navbar.jsx       ← Top navigation bar
│   ├── RiskGauge.jsx    ← Circular progress gauge
│   ├── StepProgress.jsx ← Form step indicator
│   └── ActionPlanCard.jsx ← Recommendation cards
│
├── pages/               ← Full pages (one per route)
│   ├── LandingPage.jsx  ← / (home)
│   ├── SigninPage.jsx   ← /signin
│   ├── SignupPage.jsx   ← /signup
│   ├── InputFormPage.jsx ← /form (4-step form)
│   └── DashboardPage.jsx ← /dashboard (results)
│
└── assets/              ← Images, icons (currently empty)
```

**Key Concept:** Think of `pages/` as complete screens, and `components/` as building blocks used in multiple places.

---

## � Pages & Components Detailed Explanation

### Frontend Pages (What Users See)

#### **1. LandingPage.jsx** (`/` - Home)
- **Purpose**: Welcome page and entry point for all users (default route when accessing localhost:5173)
- **Layout Structure**: Fixed navbar + 7 main sections
  
  **1.1 Fixed Navbar**
  - Sticky top with scroll detection (changes background when scrolled)
  - VitalScan logo (green text #00ff88)
  - Navigation links: "Features", "How It Works", "About", "Dashboard" (scrolls to sections)
  - CTA buttons: "Sign In" → `/signin`, "Get Started" → `/signup`
  - Mobile responsive hamburger menu
  - Animation: Smooth scroll, hover effects, background fade-in on scroll
  
  **1.2 Hero Section**
  - Animated floating orbs (3 particle elements with blur + scale animation)
  - Main heading: "Know Your Risk. Change Your Future." (staggered fade-in)
  - Secondary text: "Predict and manage 3 major health conditions with AI-powered insights"
  - CTA Button: "Get Started" → uses `useNavigate("/signup")`
  - Animated counters (stat boxes):
    - "3" conditions (Heart Disease, Diabetes, Obesity)
    - "17+" million at-risk individuals
    - "60%+" preventable with lifestyle changes
  - Counters animate from 0 → final value on scroll into view
  - Background: Dark gradient (#0a0a0a), electric green accents (#00ff88)
  
  **1.3 How It Works Section**
  - 4 step cards in horizontal layout
  - Each card has:
    - Numbered badge (1, 2, 3, 4)
    - Step icon (emoji: 📝, 🔬, 📊, ✅)
    - Title: "Fill Health Data", "Run AI Model", "See Your Risk", "Get Action Plan"
    - Description text
    - Number indicator in corner
  - Cards have hover effects: scale up slightly (1.02x), increase shadow
  - Animation: Slide-up fade-in for each card (triggered by IntersectionObserver)
  
  **1.4 Three Conditions Section**
  - 3 feature cards (one per health condition):
    1. **Heart Disease Risk** (Red #ff6666)
       - Icon: ❤️
       - Description: Analyzes cardiac factors, smoking, blood pressure indicators
       - Status: Detects early warning signs
    2. **Diabetes Risk** (Amber #ffcc44)
       - Icon: 🩸
       - Description: Evaluates glucose metabolism, family history, BMI
       - Status: Prevents late-stage complications
    3. **Obesity Risk** (Green #00ff88)
       - Icon: ⚖️
       - Description: Calculates BMI, waist circumference, lifestyle factors
       - Status: Supports healthy weight management
  - Each card has colored top border (gradient bar)
  - Hover effects: Border glow, card lift (transform: translateY)
  - Animation: Cards fade and slide in as they come into view
  
  **1.5 Differentiator Quote Banner**
  - Large quote section with icon
  - Main text: "Early detection and lifestyle changes can reduce health risks by up to 40% within 6 months"
  - Attribution: "— Health & Wellness Institute Study, 2023"
  - Green quotation marks (very large, faded)
  - Background: Subtle gradient
  - Animation: Text fade-in on scroll, quotation marks scale effect
  
  **1.6 Live Simulation Preview**
  - Static mockup showing the simulator feature
  - Title: "See How Your Actions Affect Your Health"
  - Mock dashboard showing:
    - 3 risk gauge circles (animated arcs showing percentages)
    - 2 sliders:
      - BMI adjustment (15-40)
      - Physical Activity (0-300 min/week)
    - Result cards showing updated risk scores
  - No interactivity (it's a preview), links to actual simulator in dashboard
  - Animation: Smooth number transitions, gauge animations
  
  **1.7 Disclaimer Section**
  - Amber-bordered warning box
  - Warning icon (⚠️)
  - Text: "Medical Disclaimer - VitalScan predictions are not medical advice..."
  - Button: "Learn More" about limitations
  - Border color: #ffcc44 (amber)
  - Text color: #fff (white)
  
  **1.8 Footer**
  - Logo and tagline: "VitalScan - Know Your Risk. Change Your Future."
  - Links: Privacy Policy, Terms & Conditions, Contact
  - Green separator line (#00ff88)
  - Copyright: "© 2024 VitalScan. All rights reserved."
  - Responsive layout (stacked on mobile)
  
- **Key Animations** (all CSS @keyframes):
  - `floatOrb`: Orb elements float up/down smoothly (continuous)
  - `fadeSlideUp`: Text fades in and slides up (300ms)
  - `blink`: Green accents have subtle flicker effect
  - `glow`: Shadow glow pulse effect (subtle)
  - `slideInUp`: Cards slide in from bottom to top
  - `prose-glow`: Quote text has glow effect
  - `btn-hover-glow`: Buttons glow on hover
  - `card-lift`: Cards lift slightly on hover with shadow
  
- **Color Scheme**:
  - Background: #0a0a0a (dark black)
  - Primary accent: #00ff88 (electric green)
  - Secondary accent: #00ffcc (cyan)
  - Heart Disease: #ff6666 (red)
  - Diabetes: #ffcc44 (amber)
  - Text: #ffffff (white), #888888 (gray for secondary)
  - Borders: #333333, #00ff88 (on hover)
  
- **Routing Integration**:
  - "Get Started" button uses `useNavigate("/signup")`
  - "Sign In" link uses `useNavigate("/signin")`
  - Navbar links use `smoothScroll()` for same-page sections
  - All animations use `IntersectionObserver` for performance (only animate in viewport)
  
- **Responsive Design**:
  - Desktop: Full width, 3-column layouts for cards
  - Tablet: Adjusted padding/margins, 2-column for some sections
  - Mobile: Single column, hamburger menu, larger touch targets
  - Animations disabled on slow devices (respects `prefers-reduced-motion`)
  
- **Performance Optimizations**:
  - Uses React hooks: `useState`, `useEffect`, `useRef`, `useNavigate`
  - IntersectionObserver prevents rendering off-screen animations
  - CSS transitions instead of JavaScript for most animations
  - No external images (all text + CSS)
  - Lightweight: ~600 lines of code including all styles

#### **2. SignupPage.jsx** (`/signup` - Register)
- **Purpose**: Create new user account
- **Left Side** (hidden on mobile): Animated health stats graphic
  - 4 health icons with descriptions sliding in
  - ❤️ Heart Health, 🩸 Blood Metrics, ⚖️ Body Metrics, 🏃 Activity Tracking
- **Right Side**: Signup form
  - Fields: Full Name, Email, Password, Confirm Password
  - Password strength indicator bar (0-100%):
    - Red (0-25%): Weak - needs more characters
    - Yellow (26-50%): Fair - add uppercase/numbers
    - Blue (51-75%): Good - add special characters
    - Green (76-100%): Strong - secure password
  - "Already have an account? Sign In" link
  - Submit button with glow animation
  - Backend validation: Email uniqueness, password matching
- **Animations**: Scale-in card, slide-in health graphics, color-changing strength bar

#### **3. SigninPage.jsx** (`/signin` - Login)
- **Purpose**: Access existing account
- **Layout**: Centered glassmorphic card with backdrop blur
- **Content**:
  - Email and password fields with green bottom-border on focus
  - "Forgot Password?" link (placeholder for future)
  - "Don't have account? Sign Up" link
  - Demo credentials shown: `demo@vitalscan.com` / `demo123`
- **Animation**: Scale-in card, smooth focus transitions
- **After Login**: JWT token stored → redirects to `/form`

#### **4. InputFormPage.jsx** (`/form` - Health Assessment)
- **Purpose**: Collect detailed health data in 4 steps
- **Step 1: Personal Info**
  - Age, Sex (Male/Female), Height (cm), Weight (kg), Waist Circumference (cm)
  - Used to calculate BMI and health baseline
- **Step 2: Medical History**
  - Family history of heart disease (Yes/No)
  - Family history of diabetes (Yes/No)
  - Smoking status (Never/Former/Current)
  - Determines genetic predisposition
- **Step 3: Lifestyle**
  - Physical Activity: slider 0-300 min/week
  - Sleep Hours: slider 0-12 hours/night
  - Stress Level (Low/Moderate/High)
  - Sugar Intake (Low/Moderate/High)
  - Fried Food (Rarely/Sometimes/Frequently)
  - Water Intake (<1L/1-2L/>2L)
  - Screen Time (<2hrs/2-4hrs/>4hrs)
  - Impacts all three risk scores
- **Step 4: Symptoms**
  - Chest Discomfort (Never/Occasionally/Frequently)
  - Excessive Thirst/Fatigue (Never/Sometimes/Often)
  - Salt Intake (Low/Moderate/High)
  - Specific health indicators
- **Components**:
  - **StepProgress**: Shows which step (1/4), progress bar fills green
  - **Navigation**: Back/Next buttons, final "Get Risk Assessment" button
  - Smooth slide-in animations for each step
  - Error messages for incomplete steps
- **Submission**: POST `/api/predict` → gets scores → redirects to `/dashboard`

#### **5. DashboardPage.jsx** (`/dashboard` - Results)
- **Purpose**: Display risk results and allow simulation
- **Top Section**: Three RiskGauge components
  - **RiskGauge**: Circular SVG gauge with:
    - Animated progress circle (gradient colored)
    - Number counter: counts from 0 → final value in 1.5 seconds
    - Color-coded: Green (low), Yellow (moderate), Red (high)
    - Label below with risk category
  - Shows: Heart Disease Risk, Diabetes Risk, Obesity Risk
- **Alert Banner**: 
  - Appears if 2+ scores are moderate/high
  - Warning icon + message: "Interconnected Risk Alert"
  - Recommends medical consultation
- **Lifestyle Simulation Section**:
  - 4 adjustable sliders:
    - BMI: 15-40 (updates in real-time)
    - Physical Activity: 0-300 min/week
    - Sleep Hours: 0-12 hours/night
    - Sugar Intake: Low/Moderate/High dropdown
  - "Compare Simulated Scenarios" button
  - Each slider change triggers POST `/api/simulate`
  - Risk scores smoothly animate to new values
  - Results cached for instant performance
- **Action Plan Section**:
  - 3 ranked cards with priority numbers (1st, 2nd, 3rd)
  - Each card has: Rank badge, Icon, Title, Description
  - Color-coded: Red border (1st), Yellow (2nd), Green (3rd)
  - "Learn More" button on each card
- **Medical Disclaimer**: Blue info box explaining limitations
- **Footer Links**: Privacy Policy, Terms, Logout button

---

## 🔀 Frontend Routing & App Structure

### App.jsx - Complete Routing Configuration

The main app component `App.jsx` manages all route definitions and the `ProtectedRoute` wrapper for authentication:

```javascript
// Current Route Structure (from App.jsx):
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/signin" element={<SigninPage />} />
  <Route path="/signup" element={<SignupPage />} />
  <Route path="/form" element={
    <ProtectedRoute>
      <InputFormPage />
    </ProtectedRoute>
  } />
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } />
  {/* Catch-all route for undefined paths */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### ProtectedRoute Logic

The `ProtectedRoute` component wraps pages that require user authentication:

```javascript
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // If user has valid JWT token in localStorage, show the page
  if (token) {
    return children;
  }
  
  // If no token found, redirect to landing page (/)
  // User must signup/signin first
  return <Navigate to="/" replace />;
};
```

**Key Behavior**: If user tries to access `/form` or `/dashboard` without being logged in:
1. Browser checks `localStorage.getItem('token')`
2. No token found → `ProtectedRoute` redirects to `/`
3. User lands on `LandingPage`
4. User can click "Get Started" → goes to signup
5. After signup, token saved → can now access protected routes

### User Journey Flow

```
┌─────────────────────────────────────────────────────┐
│  User Opens localhost:5173 (or any URL)             │
└────────────────┬────────────────────────────────────┘
                 │
        ┌─────────▼────────┐
        │ App.jsx Router   │
        │ Checks route     │
        └────┬──────┬──────────────────┐
             │      │                  │
             │      │              [Unknown Route]
             │      │              (path: any)
             │      │                  │
             │      │          ┌───────▼────┐
             │      │          │ Navigate   │
             │      │          │ to "/" ◄───┘
             │      │
        [Public Routes]
             │
    ┌────────┴──────────┐
    │                   │
   "/"              "/signin" or
   │                "/signup"
   │                   │
   └──────┬────────────┘
          │
      Landing    Sign In/Up
      Page        Page
        │            │
        │       [User enters email/password]
        │            │
        │     ┌──────▼─────────┐
        │     │ POST /api/signin│
        │     │ or /api/signup  │
        │     └──────┬──────────┘
        │            │
        │     [Success - Token Received]
        │            │
        │     [Token saved to localStorage]
        │            │
        └────────────┬────────────┬─────────────────────┐
                     │            │                     │
                 [Protected Routes]                     │
                     │            │                     │
                  "/form"      "/dashboard"       [Other routes]
                     │            │                     │
            ┌────────▼────────────▼──┐         [return <>{...}</>]
            │ ProtectedRoute Check   │
            │ localStorage has token?│
            └────────┬───────────────┘
                     │
          ┌──────────┴──────────┐
          │ YES - Show Page     │ NO - Redirect to "/"
          ▼                     ▼
      Input Form          Landing Page
        Page             (User sees signup
         │                offer again)
    [4-step form]
         │
    [User fills & clicks
     "Get Risk Assessment"]
         │
    ┌────▼────────────────┐
    │POST /api/predict    │
    │(ML model runs)      │
    └────┬────────────────┘
         │
    [Success - Scores Received]
         │
    ┌────▼──────────────────┐
    │ Redirect to Dashboard │
    └────┬──────────────────┘
         │
      Dashboard
        Page
         │
    [Shows Gauges]
    [Allows Simulation]
    [Shows Action Plan]
         │
    [User can adjust
     sliders to simulate
     lifestyle changes]
         │
    ┌────▼──────────────┐
    │POST /api/simulate │
    │(cached results)   │
    └────┬──────────────┘
         │
    [Scores update in real-time]
         │
    [User can logout or
     go back to form]
```

### Route-to-Component Mapping

| Route | Component | Authentication | Purpose |
|-------|-----------|-----------------|---------|
| `/` | LandingPage | ❌ Public | Welcome, learn features |
| `/signup` | SignupPage | ❌ Public | Create new account |
| `/signin` | SigninPage | ❌ Public | Login to existing account |
| `/form` | InputFormPage | ✅ Protected | Collect health data (4 steps) |
| `/dashboard` | DashboardPage | ✅ Protected | Display risk scores & simulator |
| `/*` (undefined) | Navigate to "/" | N/A | Catch-all for invalid URLs |

### Navigation Methods

The app provides multiple ways to navigate between pages:

**1. useNavigate() Hook (Programmatic)**
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navigate on button click
navigate("/signup");     // Go to signup page
navigate("/dashboard");  // Go to dashboard
```
*Used in*: LandingPage ("Get Started" button), SignupPage (successful signup), etc.

**2. <Link> Component (React Router)**
```javascript
import { Link } from 'react-router-dom';

<Link to="/signin">Sign In</Link>
<Link to="/form">Go to Form</Link>
```
*Used in*: Navbar links, page-to-page navigation

**3. Form Submission**
- SignupPage form → POST `/api/signup` → Token received → navigate to `/form`
- SigninPage form → POST `/api/signin` → Token received → navigate to `/dashboard` (or `/form`)
- InputFormPage form → POST `/api/predict` → Scores received → navigate to `/dashboard`

### Authentication Token Flow

**Token Storage**:
```javascript
// After successful signup/signin:
const response = await fetch('http://localhost:8000/api/signup', {...});
const data = await response.json();

// Token saved in browser's localStorage
localStorage.setItem('token', data.access_token);

// Next time user opens the app:
const token = localStorage.getItem('token');
// If token exists, ProtectedRoute allows access to /form and /dashboard
// If token missing/expired, redirect to /
```

**Token Retrieval**:
```javascript
// When making API requests that need authentication:
const token = localStorage.getItem('token');

fetch('http://localhost:8000/api/predict', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({...})
});
```

**Token Expiration**:
- Backend JWT tokens expire after 60 minutes
- When expired, protected routes redirect to `/`
- User must login again to continue
- (Automatic token refresh not yet implemented)

---

### Frontend Components (Reusable Building Blocks)

#### **Navbar.jsx**
- **Transparent on landing page**, solid on other pages
- **Logo**: VitalScan with gradient green text
- **Navigation Links**: 
  - Landing: "Features", "About" (smooth scroll)
  - Other pages: "Home" link back
  - Dashboard: "Logout" button
- **Mobile Menu**: Hamburger icon, collapses menu items
- **Animation**: Smooth scrolling, link hover effects (text turns green)

#### **RiskGauge.jsx**
- **Props**: `score` (0-100), `label` (text), `color` (optional)
- **Display**:
  - SVG circular gauge with animated progress
  - Outer glow effect (blur, pulsing)
  - Center text showing percentage + "%" symbol
  - Label and risk category below (Low/Moderate/High)
- **Animation**:
  - SVG stroke animates as score increases
  - Number counter: increments every ~25ms over 1.5 seconds
  - Glow opacity pulses smoothly
  - Colors change: Green (<35%), Yellow (35-65%), Red (>65%)

#### **StepProgress.jsx**
- **Props**: `currentStep` (0-3), `totalSteps` (4), `steps` (array of names)
- **Display**:
  - 4 numbered circles for each step
  - Completed steps: Green checkmark ✓
  - Current step: Green outline
  - Future steps: Gray
  - Connecting lines between circles (green if completed)
  - Label text below each circle
  - Progress bar at top that fills green (width = (step+1)/4 * 100%)
- **Animation**: Progress bar fills smoothly with transition

#### **ActionPlanCard.jsx**
- **Props**: `rank` (1-3), `title`, `description`, `icon` (emoji)
- **Display**:
  - Rank badge (left side): Number 1/2/3 in red/yellow/green circle
  - Content (middle): Icon emoji + title + description text
  - Button (right): "Learn More" with arrow icon
  - Border color changes by rank: Red, Yellow, Green
- **Animation**: Hover effect → slight scale up (1.05x) + shadow increase
  - Border color can flash/glow on hover

---

Create a `.env` file in both `backend/` and `frontend/` folders:

### Backend `.env`:
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/vitalscan
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your_super_secret_key_change_this_in_production
SECRET_KEY=another_secret_key

# API
API_HOST=0.0.0.0
API_PORT=8000

# Environment
DEBUG=True
```

### Frontend `.env` (optional):
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🔍 Detailed Component Explanations

### Frontend Components Deep Dive

#### **LandingPage.jsx**
**Purpose**: Welcome page users see first - introduces VitalScan and converts visitors to users

**What's Happening**:
- Hero Section loads with animated floating orbs (3 blurred gradient circles drifting 8-12s)
- Stat counters animate on page load (counting 0 → 3, 0 → 17, 0 → 60)
- Navbar listens to scroll position and changes background at scrollY > 50
- 7 sections: Hero, How It Works, Features, Quote Banner, Simulation Preview, Disclaimer, Footer
- IntersectionObserver triggers CSS animations when sections scroll into view

**Key Components**:
- Smooth scroll navigation between sections
- Mock simulator showing what dashboard will look like
- Compounding risk explanation section
- Full responsive design (mobile-friendly)

---

#### **InputFormPage.jsx (Health Assessment Form)**
**Purpose**: Collect 17 health data points in guided 4-step flow

**Input Fields Breakdown**:
```
Step 1: Personal Info (Age, Sex, Height, Weight, Waist Circumference)
Step 2: Medical History (Family diseases, Smoking status & duration)
Step 3: Lifestyle (Activity, Sleep, Stress, Water, Sugar, Screen time)
Step 4: Symptoms (Chest discomfort, Thirst, Salt intake, Prior diagnosis)
```

**Validation Rules**:
- Age: 18-100 years
- Height: 100-250 cm
- Weight: 30-250 kg
- Activity: 0-7 days/week
- Sleep: 0-12 hours/night
- Each step must be complete before moving to next

**Key Features**:
- Progress indicator shows 25% → 50% → 75% → 100%
- Back button allows editing previous steps
- Confirmation dialog before final submit
- Real-time validation with error messages

---

#### **DashboardPage.jsx (Risk Visualization & Simulator)**
**Purpose**: Display calculated risk scores and allow interactive "what-if" scenario testing

**What User Sees**:
```
Top:    Risk Alert Banner (auto-dismisses if elevated)
Middle: 3 Animated Risk Gauges (Heart, Diabetes, Obesity)
Bottom: Lifestyle Simulator (4 sliders)
        + Action Plan Cards (3 ranked recommendations)
```

**How Caching Works**:
1. User adjusts slider (e.g., BMI 28 → 30)
2. Frontend hashes ALL current input values with SHA256
3. Sends POST /api/simulate with input + hash
4. Backend checks Redis cache
5. Cache HIT (within 5 min): returns instantly (<50ms)
6. Cache MISS: calculates, stores, returns (200-300ms)
7. Frontend gauges animate smoothly to new scores

**Result**: Slider adjustments feel instant and responsive

---

#### **Reusable Components**

**RiskGauge.jsx** (Animated circular progress):
```
Props: score (0-100), type ("heart"/"diabetes"/"obesity")
Renders: SVG circle with animated stroke-dashoffset
- Number counter: increments from 0 to score over 1.5s
- Color: Green (<35%), Yellow (35-65%), Red (>65%)
- Shows percentage + risk label (Low/Moderate/High)
```

**StepProgress.jsx** (Form step indicator):
```
Props: current_step (0-3), total_steps (4), step_labels
Renders:
- 4 numbered circles (step 1-4)
- Completed: green checkmark
- Current: green outline
- Future: gray/inactive
- Progress bar fills left-to-right
```

**ActionPlanCard.jsx** (Recommendation card):
```
Props: rank (1-3), title, description, impact
Display:
- Rank badge: 1=Red, 2=Orange, 3=Green
- Title + personalized description
- Impact percentage  (risk reduction if applied)
- Hover: slight scale up + shadow increase
```

---

## 🧮 Backend ML Pipeline Details

### POST /api/predict - Complete Risk Calculation

**Input** (20 health fields):
```json
{
  "age": 45, "sex": "Male", "height": 175, "weight": 85, "waist": 92,
  "family_heart_disease": "Yes", "family_diabetes": "No",
  "smoking_status": "Current", "smoking_years": 10, "smoking_cpd": 20,
  "physical_activity": 2, "sleep_hours": 6, "stress_level": "High",
  "daily_water": 2, "daily_sugar": "High", "screen_time": 10,
  "chest_discomfort": "Sometimes", "chest_type": "Pressure",
  "excessive_thirst": "No", "salt_intake": "High"
}
```

**Processing Pipeline**:

**1. Validation** (Pydantic)
- Ensures all 20 fields match expected types and ranges
- Returns 422 error if any field invalid
- Prevents bad data from reaching ML models

**2. Load ML Models**
- Try loading heart_disease_model.pkl and diabetes_model.pkl
- If missing: use fallback mathematical equations
- Models cached in memory after first load (prevents reload overhead)

**3. Heart Disease Score Calculation**
- Convert categorical inputs to numeric:
  - Sex: Male=1, Female=0
  - Smoking: Never=0, Former=1, Current=2
  - Stress: None=0, Mild=1, Moderate=2, High=3
  - Family history: Yes=1, No=0
- Feed 11 features to model
- Output: probability 0.0-1.0 → multiply by 100 for percentage
- If chest discomfort present: add bonus 20-30%
- Result: heart_risk (0-100%)

**4. Diabetes Score Calculation**
- Calculate BMI = weight / (height/100)²
- Create vector: [BMI, weight, age, family_diabetes, sugar, activity, thirst]
- Feed to model → probability 0.0-1.0 × 100
- Result: diabetes_risk (0-100%)

**5. Obesity Score Calculation** (Pure mathematics)
```
Base Score by BMI:
  BMI < 18.5      → 5%    (underweight)
  18.5-24.9       → 10%   (normal)
  25.0-29.9       → 40%   (overweight) ← Common starting point
  30.0-34.9       → 70%   (obese class I)
  35.0+           → 95%   (obese class II/III)

Central Obesity Adjustment:
  WHtR = waist / height
  If WHtR > 0.5 (high central obesity): +15%

Lifestyle Adjustments:
  Activity < 2 days/week: +10%
  Sleep < 6 hours: +8%
  Screen time > 8 hours: +5%
  Sugar = High: +8%

Final: base + adjustments (capped at 100%)

Example: BMI=28 (40%) + WHtR=0.52 (+15%) + Activity=2 (0%) 
         + Sleep=6 (0%) + Screen=10 (+5%) + Sugar=High (+8%)
         = 40+15+0+0+5+8 = 68% obesity risk
```

**6. Compounding Risk Logic**
```
If heart > 60% AND diabetes > 50%:
  → Increase heart risk by 12%
  → Note: "Metabolic + cardiovascular risks compound"

If obesity > 70%:
  → Increase heart by 8% (obesity worsens heart disease)
  → Increase diabetes by 8% (obesity worsens diabetes)
  → Note: "Obesity amplifies other conditions"
```

**7. Generate Action Plan**
- Rank recommendations by impact (highest to lowest):
  1. Smoking cessation: 25-30% reduction
  2. Increase exercise: 15-20% reduction
  3. Improve sleep: 10-15% reduction
  4. Manage stress: 10-12% reduction
  5. Reduce sugar/salt: 12-18% reduction
- Select top 3, personalize with user's specific data

**8. Save to Database**
- If user authenticated (valid JWT token):
  - INSERT into risk_sessions table
  - Store user_id, all 20 input fields, 3 calculated scores
  - Timestamp when prediction occurred
- User can review history of all past assessments

**9. Return JSON Response**:
```json
{
  "heart_disease": 74,
  "diabetes": 62,
  "obesity": 86,
  "risk_labels": {"heart": "High", "diabetes": "Moderate", "obesity": "High"},
  "compounding_note": "...",
  "action_plan": [{rank: 1, title: "Quit Smoking", impact: "25-30%"}, ...]
}
```

---

### POST /api/simulate - Real-Time Cached Predictions

**Purpose**: Fast calculations for dashboard "what-if" scenarios

**How Caching Works**:
```
User adjusts BMI slider 28 → 30:

1. Frontend prepares input object with ALL slider values
2. Creates SHA256 hash of input: "abc123def456..."
3. Sends: POST /api/simulate { inputs, hash_key: "abc123..." }
4. Backend checks Redis: redis.get("vitalscan_sim_abc123...")
5. Cache HIT → return cached result (<50ms)
6. Cache MISS → run prediction, redis.setex(key, 300, result), return (200-300ms)
7. Frontend receives scores, gauges animate smoothly
8. User adjusts again to SAME values → instant response from cache
9. User adjusts to DIFFERENT values → recalculate once, cache for 5 min
```

**Why This Matters**:
- Slider without cache: 300ms delay every time (feels sluggish)
- Slider with cache: <50ms for known input (feels instant)
- TTL=300s means slider remains responsive for sustained adjustments

---

## 📊 Risk Scoring Formulas

### Heart Disease (ML Model)

**When Model Available**:
```
Input: 11 features [age, sex, family, smoking_status, smoking_yrs, smoking_cpd, stress, sleep, chest_discomfort, ...]
Model: Logistic Regression or Random Forest (trained on medical data)
Output: probability 0.0-1.0 → ×100 for percentage
```

**When Model Missing (Fallback)**:
```
base = age + (smoking_status × 20) + (family_history × 15) + (stress_level × 10) - (activity × 5)
risk = min((base / 120) × 100, 100%)

Example: 45 + 40 + 15 + 30 - 10 = 120 → capped at 100%
```

### Diabetes (ML Model)

**When Model Available**:
```
Input: 7 features [BMI, weight, age, family_diabetes, sugar, activity, thirst]
Output: probability 0.0-1.0 × 100
```

**When Model Missing (Fallback)**:
```
bmi_score = (BMI - 18.5) × 2.5
family_score = 25 if family_diabetes else 0
activity_score = max(3 - activity_days, 0) × 8
sugar_score = 20 if high else (10 if medium else 0)
risk = min(bmi_score + family_score + activity_score + sugar_score, 100%)
```

### Obesity (Always Pure Math)

```
Base Score:
  BMI < 18.5: 5%, 18.5-25: 10%, 25-30: 40%, 30-35: 70%, 35+: 95%

Adjustments:
  WHtR > 0.5: +15%
  Activity < 2: +10%
  Sleep < 6: +8%
  Screen > 8: +5%
  Sugar = High: +8%

Final: min(base + adjustments, 100%), max(result, 0%)
```

---

## 💾 Database Schema

**Users**:
```sql
id | full_name | email | hashed_password | created_at
 1 | John Doe  | j@... | $2b$10$ab... | 2025-01-15
```

**Risk Sessions**:
```sql
id | user_id | age | sex | heart_disease_risk | diabetes_risk | obesity_risk | created_at
 1 |    1    | 45  | M   |        74          |      62       |      86      | 2025-03-01
 2 |    1    | 45  | M   |        68          |      58       |      82      | 2025-02-15
```

**What Gets Stored**:
- Every prediction auto-saved if user authenticated
- User can view history of all past assessments
- Shows trends: risk increasing/decreasing over time
- Useful for long-term health tracking

---

## 🎨 Color Coding Legend

**Risk Levels**:
```
LOW (0-34%)       → GREEN (#00ff88)
MODERATE (35-64%) → AMBER (#ffcc44)
HIGH (65-100%)    → RED (#ff4444)
```

**UI Elements**:
```
Primary Buttons               → Green (#00ff88)
Secondary Buttons            → Outlined, green border
Cards                        → Dark (#0f0f0f) with colored top bar
Text                         → White (#ffffff) + gray (#cccccc)
Backgrounds                  → Deep black (#0a0a0a)
Alert Banner (elevated risk) → Red if >65%, Amber if moderate
```

---

## 🔐 Security & Architecture� Security & Architecture

### Authentication Flow

```
User enters credentials
        ↓
Frontend sends POST /api/auth/signin
        ↓
Backend:
  1. Find user by email in PostgreSQL
  2. Verify password using bcrypt.verify()
  3. If valid: Create JWT token (HS256 algorithm)
  4. Return token to frontend
        ↓
Frontend stores token in localStorage
        ↓
On subsequent requests:
  - Add header: Authorization: Bearer {token}
  - Backend verifies token signature and expiry
  - If valid: Allow request, if invalid: return 401 Unauthorized
  - Protected routes redirect to /signin if no token
```

### Password Security

- **Hashing**: Passwords never stored in plaintext
- **Algorithm**: bcrypt with salt rounds (very slow by design)
- **Demo Password**: `demo123` for testing only
- **Best Practice**: Change SECRET_KEY before production deploy

### Data Protection

- **Database**: PostgreSQL with user isolation
  - Each user can only see their own risk sessions
  - Foreign key constraints prevent data leakage
- **API**: Protected routes with JWT verification
- **Frontend**: localStorage only stores token, not sensitive data
- **Redis**: Caching doesn't store personally identifiable information
- **HTTPS**: Use in production to encrypt all traffic

### API Rate Limiting (Future)

Currently unlimited, should add:
```python
# Not yet implemented but recommended:
# - Max 100 /api/predict requests per hour per user
# - Max 1000 /api/simulate requests per hour per user  
# - Max 5 signup attempts per hour per IP
```

### Data Retention

- User accounts: Permanent (until manually deleted)
- Risk sessions: Kept indefinitely for user history
- Redis cache: Auto-expires after 300 seconds
- JWT tokens: Auto-expire after 60 minutes

---

## 🏗️ System Architecture

### Frontend Architecture

```
React App (http://localhost:5173)
    ↓
[App.jsx - Main Router]
    ├── Route "/" → LandingPage
    ├── Route "/signup" → SignupPage
    ├── Route "/signin" → SigninPage
    ├── Protected Route "/form" → InputFormPage
    └── Protected Route "/dashboard" → DashboardPage
    ↓
[Navbar - Global Navigation]
    ↓
[Components - Reusable UI]
    ├── RiskGauge (circular SVG gauge)
    ├── StepProgress (form indicator)
    ├── ActionPlanCard (recommendation card)
    └── (pages include these + their own elements)
    ↓
[index.css - Global Styles]
    ├── Keyframe animations (flicker, glow-pulse, float-particle)
    ├── Tailwind custom components
    └── CSS utility classes
    ↓
API Calls (via fetch)
    └── http://localhost:8000/api/*
```

### Backend Architecture

```
FastAPI Server (http://localhost:8000)
    ↓
[main.py - App Initialization]
    ├── CORS Middleware (allow localhost:5173)
    ├── Startup Events (create tables, test connections)
    └── Error Handlers (HTTP exceptions, general exceptions)
    ↓
[Routes - API Endpoints]
    ├── auth.py (/api/auth/*)
    │   ├── POST /signup
    │   ├── POST /signin
    │   └── GET /me
    └── predict.py (/api/*)
        ├── POST /predict
        ├── POST /simulate
        └── GET /history
    ↓
[utils/predict.py - ML Pipeline]
    ├── load_models() - Load .pkl files
    ├── prepare_heart_features() - Feature engineering
    ├── prepare_diabetes_features() - Feature engineering
    ├── calculate_obesity_risk() - Pure logic scoring
    ├── calculate_compounding() - Multi-factor adjustment
    ├── generate_action_plan() - Personalized recommendations
    └── run_prediction() - Master orchestration function
    ↓
[utils/auth_utils.py - Authentication]
    ├── hash_password() - bcrypt hashing
    ├── verify_password() - bcrypt verification
    ├── create_access_token() - JWT token generation
    ├── verify_token() - JWT token validation
    └── get_current_user() - Dependency injection
    ↓
[models_db.py - Database Models]
    ├── User (accounts)
    └── RiskSession (prediction history)
    ↓
[database.py - Connections]
    ├── PostgreSQL: SQLAlchemy engine
    ├── Redis: Connection with fallback
    └── Dependencies: get_db(), get_redis()
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
│  Open http://localhost:5173/form                             │
└──────────────────────────────────────────────────────────────┘
              ↓
       Fill 4-step form
              ↓
┌──────────────────────────────────────────────────────────────┐
│               FRONTEND (React + Vite)                        │
│  onClick: POST /api/predict with form data                   │
└──────────────────────────────────────────────────────────────┘
              ↓
    HTTP Request (JSON body)
              ↓
┌──────────────────────────────────────────────────────────────┐
│              BACKEND (FastAPI Server)                        │
│  Route: POST /api/predict                                    │
│    1. Validate input with Pydantic schema                    │
│    2. Call run_prediction(data)                              │
│    3. Load ML models if not cached                           │
│    4. Prepare features                                       │
│    5. Run predictions                                        │
│    6. Apply compounding logic                                │
│    7. Generate action plan                                   │
│    8. If user authenticated: Save to PostgreSQL              │
│    9. Return RiskOutput JSON                                 │
└──────────────────────────────────────────────────────────────┘
              ↓
    HTTP Response (JSON body)
              ↓
┌──────────────────────────────────────────────────────────────┐
│               FRONTEND (React)                               │
│  Receive scores: heart=45%, diabetes=35%, obesity=28%        │
│  Navigate to /dashboard                                      │
│  Display RiskGauges with animated counters                   │
└──────────────────────────────────────────────────────────────┘
              ↓
       User adjusts sliders
              ↓
┌──────────────────────────────────────────────────────────────┐
│               FRONTEND (React)                               │
│  onChange: POST /api/simulate with new parameters            │
└──────────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────────┐
│              BACKEND (FastAPI Server)                        │
│  Route: POST /api/simulate                                   │
│    1. Generate cache key from input hash                     │
│    2. Check Redis cache (TTL 300s)                           │
│    3. If HIT: Return cached result instantly (< 100ms)       │
│    4. If MISS: Run prediction, cache, return                 │
└──────────────────────────────────────────────────────────────┘
              ↓
    HTTP Response (JSON, sub-100ms)
              ↓
┌──────────────────────────────────────────────────────────────┐
│               FRONTEND (React)                               │
│  RiskGauges smoothly animate to new values                   │
│  User sees instant feedback from slider change               │
└──────────────────────────────────────────────────────────────┘
```

---

## �🐛 Troubleshooting

### Problem: "Port 8000 already in use"
**Solution:**
```bash
# Find what's using port 8000
# Windows:
netstat -ano | findstr :8000

# macOS/Linux:
lsof -i :8000

# Kill the process or use different port:
python -m uvicorn app.main:app --port 8001
```

### Problem: "Module not found" errors in backend
**Solution:**
```bash
# Make sure venv is activated
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Reinstall packages
pip install -r requirements.txt
```

### Problem: "npm ERR! not found" in frontend
**Solution:**
```bash
# Delete node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### Problem: Backend can't connect to database
**Solution:**
- Make sure PostgreSQL is running
- Check `DATABASE_URL` in `.env` is correct
- For local development, consider using SQLite instead

### Problem: Frontend shows "API connection error"
**Solution:**
- Verify backend is running (`http://localhost:8000/docs`)
- Check frontend `API_URL` in code matches backend address
- Check browser console (F12) for error messages

### Clear Browser Cache
```
Chrome: Ctrl+Shift+Delete → Clear browsing data
Firefox: Ctrl+Shift+Delete → Clear Recent History
Safari: Command+Shift+Delete
```

---

## 🛠️ Technologies & Dependencies

### Backend Stack:
| Technology | Purpose |
|------------|---------|
| **FastAPI** | Web framework for API |
| **SQLAlchemy** | Database ORM (Object-Relational Mapping) |
| **PostgreSQL** | Main database |
| **Redis** | Caching & sessions |
| **Scikit-learn** | Machine learning models |
| **Pandas** | Data processing |
| **Pydantic** | Data validation |
| **Python-dotenv** | Environment variables |

### Frontend Stack:
| Technology | Purpose |
|------------|---------|
| **React** | UI library |
| **Vite** | Build tool (super fast) |
| **React Router** | Page navigation |
| **Tailwind CSS** | Styling utilities |
| **JavaScript (ES6+)** | Programming language |

---

## 📚 Learning Resources

### Beginner Guides:
- **FastAPI**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com/)
- **React**: [react.dev](https://react.dev/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com/)
- **Python**: [python.org/learning](https://www.python.org/about/gettingstarted/)

### Video Tutorials:
- FastAPI Full Course on YouTube
- React Tutorial by Fireship (10 min)
- Complete Web Development Course (Udemy/FreeCodeCamp)

---

## 💡 Tips for Beginners

1. **One terminal per service**: Keep backend and frontend in separate terminal windows
2. **Check console errors**: Press `F12` in browser to see what's wrong
3. **Read error messages carefully**: They usually tell you exactly what's broken
4. **Test with Postman**: Download Postman to manually test API endpoints
5. **Save files**: Vite auto-reloads frontend changes, restart backend if needed
6. **Use demo credentials**: On signin page, use `demo@vitalscan.com` / `demo123`

---

## ▶️ Running the Application

### Step-by-Step: Start Backend

**Prerequisites:**
- PostgreSQL running on localhost:5432
- Redis running on localhost:6379
- Python 3.8+ installed
- Virtual environment activated with dependencies installed

**Method 1: Using Command Prompt (Windows)**

```cmd
# Open Command Prompt (cmd)

# Navigate to backend folder
cd C:\Users\ramka\Desktop\APEXRush\vitalscan\backend

# Activate virtual environment (if using venv)
venv\Scripts\activate

# Run the FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

**Method 2: Using PowerShell (Windows)**

```powershell
# Open PowerShell

# Navigate to backend folder
cd C:\Users\ramka\Desktop\APEXRush\vitalscan\backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run the FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```

**Method 3: Quick Start (after first setup)**

```cmd
cd C:\Users\ramka\Desktop\APEXRush\vitalscan\backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```

**Verify Backend is Running:**
- Open browser: `http://localhost:8000`
- Should see: `{"message":"Welcome to VitalScan API"}`
- API docs: `http://localhost:8000/docs` (interactive Swagger UI)

---

### Step-by-Step: Start Frontend

**Prerequisites:**
- Node.js v16+ installed
- npm installed
- Dependencies installed (run `npm install` first time)

**Method 1: Using Command Prompt (Windows)**

```cmd
# Open a NEW Command Prompt window (keep backend running in another)

# Navigate to frontend folder
cd C:\Users\ramka\Desktop\APEXRush\vitalscan\frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

**Method 2: Using PowerShell (Windows)**

```powershell
# Open a NEW PowerShell window (keep backend running in another)

# Navigate to frontend folder
cd C:\Users\ramka\Desktop\APEXRush\vitalscan\frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Method 3: Quick Start (after first setup)**

```cmd
cd C:\Users\ramka\Desktop\APEXRush\vitalscan\frontend
npm run dev
```

**Verify Frontend is Running:**
- Open browser: `http://localhost:5173`
- Should see VitalScan landing page with hero section
- Check browser console (F12) for any errors

---

### Complete Startup Procedure (Full Solution)

**Terminal 1 - Backend:**
```cmd
cd C:\Users\ramka\Desktop\APEXRush\vitalscan\backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```
✅ Wait for message: `Application startup complete`

**Terminal 2 - Frontend (NEW WINDOW):**
```cmd
cd C:\Users\ramka\Desktop\APEXRush\vitalscan\frontend
npm run dev
```
✅ Wait for message: `Local: http://localhost:5173/`

**Terminal 3 - Optional (Database Verification):**
```cmd
cd C:\Users\ramka\Desktop\APEXRush\vitalscan\backend
python verify_setup.py
```
✅ Should show: `✅ All systems operational`

---

### Testing the Full Application Flow

Once both are running:

1. **Open browser**: `http://localhost:5173`
2. **Click "Get Started"** button on landing page
3. **Test Signup**:
   - Click "Sign Up" link
   - Enter: name, email, password
   - Click "Create Account"
4. **Fill Health Form**:
   - Answer 4 steps of health questions
   - Click "Submit"
5. **View Dashboard**:
   - See 3 risk gauges (Heart, Diabetes, Obesity)
   - Try adjusting sliders
   - View action plan recommendations
6. **Test Demo Account**:
   - Click "Sign Out"
   - Click "Sign In"
   - Email: `demo@vitalscan.com`
   - Password: `demo123`
   - See pre-filled data

---

### Stopping the Application

**Backend (Terminal 1):**
```
Press Ctrl + C
```

**Frontend (Terminal 2):**
```
Press Ctrl + C
```

---

### Useful Commands Reference

| Task | Command |
|------|---------|
| **Start Backend** | `python -m uvicorn app.main:app --reload --port 8000` |
| **Start Frontend** | `npm run dev` |
| **Install Frontend Deps** | `npm install` |
| **Install Backend Deps** | `pip install -r requirements.txt` |
| **Verify Setup** | `python verify_setup.py` |
| **View API Docs** | Open `http://localhost:8000/docs` |
| **Build Frontend** | `npm run build` |
| **Preview Build** | `npm run preview` |
| **Check Node Version** | `node --version` |
| **Check Python Version** | `python --version` |
| **Check npm Version** | `npm --version` |

---

### Common Issues During Startup

| Error | Solution |
|-------|----------|
| **Port 8000 already in use** | Change to different port: `--port 8001` |
| **Port 5173 already in use** | Vite auto-uses 5174 if 5173 taken |
| **PostgreSQL connection refused** | Make sure PostgreSQL service is running |
| **Redis connection refused** | Make sure Redis service is running (or it falls back gracefully) |
| **Module not found: app** | Make sure you're in `backend` folder, not `backend/app` |
| **npm: command not found** | Node.js not installed; download from nodejs.org |
| **pip: command not found** | Python not installed or not in PATH |

---

## 🚀 Next Steps

1. ✅ Follow installation guide above
2. ✅ Run backend on `http://localhost:8000`
3. ✅ Run frontend on `http://localhost:5173`
4. ✅ Visit landing page and test signup
5. ✅ Fill out health form
6. ✅ View dashboard with risk scores
7. ✅ Try lifestyle simulator
8. ✅ Read the code and understand it!

---

## 📞 Support & Contributing

- **Issues?** Check the Troubleshooting section above
- **Want to contribute?** Follow Git workflow and submit pull requests
- **Questions?** Check the code comments and documentation
- **Report bugs** by creating GitHub issues

---

## 📄 License

This project is part of the APEXRush initiative. See LICENSE file for details.

---

## 👨‍💻 Made with ❤️ for Health

**VitalScan** - Know Your Risk. Change Your Future. 🏥🟢

**Last Updated:** March 2026
**Current Version:** 1.0.0
