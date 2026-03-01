# VitalScan Backend Setup Guide

## Overview

The VitalScan backend is a FastAPI server that:
- Manages user authentication (signup/signin)
- Loads ML models for health risk prediction
- Calculates obesity risk using pure logic
- Saves health assessments to PostgreSQL
- Caches simulation results in Redis
- Provides REST APIs for the React frontend

## System Architecture

```
CLIENT (React)
    ↓
HTTP Requests
    ↓
FastAPI Server (port 8000)
    ├── /api/auth/* → Authentication (JWT tokens)
    ├── /api/predict → ML prediction pipeline
    ├── /api/simulate → Cached simulations
    └── /api/history → User session history
    ↓
PostgreSQL (5432) ← User data, risk sessions
Redis (6379) ← Prediction cache
ML Models (.pkl) ← Loaded from backend/models/
```

## Prerequisites

### 1. PostgreSQL Installation

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Install with default settings (remember the password!)
- Default port: 5432
- Default user: `postgres`

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Verify Installation:**
```bash
psql --version
```

### 2. Redis Installation

**Windows:**
- Option 1: Use Windows Subsystem for Linux (WSL) with Redis
- Option 2: Use pre-built Windows binaries from https://github.com/microsoftarchive/redis/releases

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install redis-server
sudo systemctl start redis-server
```

**Verify Installation:**
```bash
redis-cli ping
# Should return: PONG
```

### 3. Python 3.8+

```bash
python --version
# Should be 3.8 or higher
```

## Database Setup

### Create Database

**Option 1: Using psql (command line)**
```bash
psql -U postgres
```

Once in psql:
```sql
CREATE DATABASE vitalscan;
\q
```

**Option 2: Using PgAdmin (GUI)**
- Open PgAdmin
- Right-click "Databases" → Create → Database
- Name: `vitalscan`
- Click Save

**Verify:**
```bash
psql -U postgres -d vitalscan -c "SELECT 1;"
```

## Installation Steps

### 1. Navigate to Backend Folder

```bash
cd vitalscan/backend
```

### 2. Create Python Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` at the start of your terminal line.

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- FastAPI (web framework)
- SQLAlchemy (database ORM)
- psycopg2 (PostgreSQL driver)
- Redis (caching)
- joblib (ML model loading)
- passlib + python-jose (authentication)
- And more...

### 4. Setup Environment Variables

Create `.env` file in `backend/` folder:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/vitalscan
REDIS_URL=redis://localhost:6379
SECRET_KEY=vitalscan_secret_key_change_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

**Important**: Change `password` to your PostgreSQL password!

### 5. Place ML Models

Place these files in `backend/models/`:
- `heart_model.pkl` - Heart disease risk model
- `diabetes_model.pkl` - Diabetes risk model

If models are missing, the backend will use fallback calculations.

```bash
cp /path/to/models/*.pkl backend/models/
```

## Running the Backend

### Start PostgreSQL

```bash
# Windows (if installed as service, it auto-starts)
# macOS:
brew services start postgresql@15

# Linux:
sudo systemctl start postgresql
```

### Start Redis

```bash
# Windows (WSL or native):
redis-server

# macOS:
brew services start redis

# Linux:
sudo systemctl start redis-server
```

### Start FastAPI Server

**With virtual environment activated:**
```bash
# From backend/ folder
python -m uvicorn app.main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Verify Backend is Running

Open browser and go to:
- **Main API docs**: http://localhost:8000/docs (Swagger UI)
- **Alternative docs**: http://localhost:8000/redoc (ReDoc)
- **Health check**: http://localhost:8000/health
- **Root status**: http://localhost:8000/

You should see:
```json
{
  "status": "VitalScan API running",
  "version": "1.0.0",
  "docs": "/docs"
}
```

## API Endpoints (Complete Reference)

### Authentication

```
POST /api/auth/signup
- Create new user account
- Body: { "full_name": "John Doe", "email": "john@example.com", "password": "secure123" }
- Returns: { "access_token": "...", "token_type": "bearer" }

POST /api/auth/signin
- Login to existing account
- Body: { "email": "john@example.com", "password": "secure123" }
- Returns: { "access_token": "...", "token_type": "bearer" }

GET /api/auth/me
- Get current user info (requires token)
- Header: Authorization: Bearer {token}
- Returns: { "id": "uuid", "full_name": "...", "email": "...", "created_at": "..." }
```

### Health Assessment

```
POST /api/predict
- Calculate health risk scores
- Body: VitalScanInput (all health factors)
- Returns: RiskOutput (scores, labels, alerts, actions)
- Optional auth: Works with or without token

POST /api/simulate
- Simulate lifestyle changes
- Body: SimulationInput (same as VitalScanInput)
- Returns: RiskOutput with updated scores
- Cached for 300 seconds for performance

GET /api/history?limit=10
- Get user's assessment history
- Headers: Authorization: Bearer {token}
- Returns: List[RiskSessionOut]
```

### System

```
GET /health
- Health check - verify API, DB, Redis status
- Returns: { "status": "ok|degraded", "database": "...", "redis": "..." }
```

## Testing with curl

### Test Signup

```bash
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Test Signin

```bash
curl -X POST "http://localhost:8000/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Test Prediction

```bash
curl -X POST "http://localhost:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 45,
    "sex": "Male",
    "height_cm": 175,
    "weight_kg": 85,
    "waist_cm": 95,
    "family_history_heart": true,
    "family_history_diabetes": false,
    "smoking_status": "Former",
    "physical_activity": "Moderate",
    "sleep_hours": "7-8",
    "stress_level": "Moderate",
    "sugar_intake": "Moderate",
    "fried_food": "Sometimes",
    "water_intake": "1-2L",
    "screen_time": "2-4hrs",
    "chest_discomfort": "Never",
    "thirst_fatigue": "Never",
    "salt_intake": "Moderate"
  }'
```

## Troubleshooting

### Problem: `ERROR: unable to connect to server`

**Solution**: PostgreSQL not running
```bash
# Windows:
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start

# macOS:
brew services start postgresql@15

# Linux:
sudo systemctl start postgresql
```

### Problem: `FATAL: password authentication failed for user "postgres"`

**Solution**: Wrong password in `.env` file
1. Reset PostgreSQL password:
```bash
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'newpassword';
\q
```
2. Update `.env` with correct password

### Problem: `ConnectionRefusedError: [Errno 111] Connection refused` (Redis)

**Solution**: Redis not running
```bash
# Start Redis:
redis-server

# Or verify it's running:
redis-cli ping
# Should return: PONG
```

**Note**: If Redis is down, the app continues working without caching.

### Problem: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**: Dependencies not installed
```bash
pip install -r requirements.txt
```

### Problem: Models not loading

**Check**:
1. Are `heart_model.pkl` and `diabetes_model.pkl` in `backend/models/`?
2. Check logs: `WARNING: Heart model not found`
3. Backend will use fallback calculations if missing

### Problem: CORS error in React frontend

**Check**: `.env` file DATABASE_URL
- Verify `http://localhost:5173` is in CORS allowed origins

## Database Management

### Access PostgreSQL

```bash
psql -U postgres -d vitalscan
```

**Useful commands:**
```sql
-- List all tables
\dt

-- View users table
SELECT * FROM users;

-- View risk sessions
SELECT * FROM risk_sessions;

-- Clear test data
DELETE FROM risk_sessions;
DELETE FROM users;

-- Exit
\q
```

### Backup Database

```bash
pg_dump -U postgres -d vitalscan > vitalscan_backup.sql
```

### Restore Database

```bash
psql -U postgres -d vitalscan < vitalscan_backup.sql
```

## Development Tips

1. **Auto-reload on code changes**: `--reload` flag is enabled by default
2. **View logs**: Check terminal where uvicorn is running
3. **Check API docs**: Go to http://localhost:8000/docs and test endpoints there
4. **Use Postman**: Import API endpoints for easier testing
5. **Enable debug**: Set `.env` DEBUG=True for more verbose logging

## Production Deployment

Before deploying to production:

1. **Change SECRET_KEY** in `.env` to a secure random string
2. **Use production PostgreSQL** instance (not localhost)
3. **Use production Redis** instance
4. **Remove `--reload` flag** in uvicorn command
5. **Use gunicorn** instead of uvicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
```
6. **Enable HTTPS** with reverse proxy (nginx/Apache)
7. **Set ACCESS_TOKEN_EXPIRE_MINUTES** securely
8. **Enable database backups**

## Next Steps

1. ✅ Install PostgreSQL and Redis
2. ✅ Create vitalscan database
3. ✅ Setup Python virtual environment
4. ✅ Install requirements
5. ✅ Create `.env` file with credentials
6. ✅ Place ML models in `backend/models/`
7. ✅ Start PostgreSQL and Redis
8. ✅ Run FastAPI with `python -m uvicorn app.main:app --reload --port 8000`
9. ✅ Test at http://localhost:8000/docs
10. ✅ Frontend at http://localhost:5173 should connect seamlessly

## Support

- **API Docs**: http://localhost:8000/docs
- **Error Logs**: Check terminal output
- **Database Queries**: Use psql or PgAdmin
- **Redis Status**: `redis-cli info`

---

**VitalScan Backend v1.0.0** - Ready to predict health risks! 🏥🟢
