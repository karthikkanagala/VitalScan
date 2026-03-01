# VitalScan Backend - Quick Start

## ⚡ 30-Second Setup

### Prerequisites (one-time)
1. **Python 3.8+**
   ```bash
   python --version
   ```

2. **PostgreSQL**
   - Windows: https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql@15 && brew services start postgresql@15`
   - Linux: `sudo apt install postgresql && sudo systemctl start postgresql`

3. **Redis**
   - Windows: https://github.com/microsoftarchive/redis/releases
   - macOS: `brew install redis && brew services start redis`
   - Linux: `sudo apt install redis-server && sudo systemctl start redis-server`

4. **Create database**
   ```bash
   psql -U postgres
   # In psql shell:
   # CREATE DATABASE vitalscan;
   # \q
   ```

### Setup Backend (first time)
```bash
cd vitalscan/backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Update DATABASE_URL with your PostgreSQL password
```

## 🚀 Run Backend

**Every time you want to run the backend:**

```bash
cd vitalscan/backend

# Make sure venv is activated (you see (venv) in terminal)
# If not:
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Make sure PostgreSQL and Redis are running
# Then run:
python -m uvicorn app.main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

## ✅ Verify It's Working

Open browser:
- **API Docs**: http://localhost:8000/docs ← Try endpoints here
- **Health Check**: http://localhost:8000/health
- **Status**: http://localhost:8000/

## 📝 Checklist

- [ ] PostgreSQL running (port 5432)
- [ ] Redis running (port 6379)
- [ ] Python venv activated (see `(venv)` in terminal)
- [ ] Ran `pip install -r requirements.txt`
- [ ] Created `.env` file with DATABASE_URL
- [ ] Backend running on http://localhost:8000
- [ ] React frontend running on http://localhost:5173

## 🔗 Connect Frontend to Backend

The React frontend already connects to `http://localhost:8000` by default.

No additional config needed — just run both:
1. Backend: `python -m uvicorn app.main:app --reload --port 8000`
2. Frontend: `npm run dev` (from frontend folder)

## 📖 Full Documentation

See `BACKEND_SETUP.md` for detailed setup, troubleshooting, and API reference.

## 🆘 Quick Fixes

**"Connection refused" error?**
- Make sure PostgreSQL is running: `psql -U postgres -c "SELECT 1;"`
- Make sure Redis is running: `redis-cli ping` (should return PONG)

**"Database does not exist"?**
- Create it: `psql -U postgres -c "CREATE DATABASE vitalscan;"`

**ModuleNotFoundError?**
- Install dependencies: `pip install -r requirements.txt`

**Still stuck?**
- Check `BACKEND_SETUP.md` troubleshooting section
- Check terminal output for error messages
- Verify `.env` file has correct PostgreSQL password

---

**That's it! Backend is ready to power VitalScan!** 🏥🟢
