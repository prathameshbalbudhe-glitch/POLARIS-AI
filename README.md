# POLARIS AI — Antarctic Navigation Intelligence

A professional React + Vite frontend with an optional Python FastAPI backend for the Antarctic vessel navigation decision-support prototype.

## Run frontend

1. Install Node.js 20+.
2. Open this folder in VS Code.
3. In the VS Code terminal run:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually http://localhost:5173).

## Run backend (optional)

Install Python 3.11+ and run:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The API normally runs on http://localhost:8000.

## Important

The application is a decision-support prototype. Data sources and prediction outputs should be validated before any real-world navigation use. Configure API credentials only in local environment files and never commit secrets.
