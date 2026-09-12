# POLARIS AI Data Gateway

This backend keeps external API credentials away from the React browser client and exposes a small normalized API to the POLARIS dashboard.

## Endpoints

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/icebergs` — USNIC Antarctic iceberg CSV
- `GET /api/satellite` — Copernicus Sentinel-1 catalog search when OAuth credentials are configured
- `GET /api/ocean?lat=-64.231&lon=58.942` — Copernicus Marine current sample when credentials are configured
- `GET /api/vessel` — optional configured AIS/vessel provider; otherwise clearly marked simulation

## Run locally

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
uvicorn app:app --reload --port 8000
```

The React app expects `VITE_API_BASE_URL=http://localhost:8000`.

## Data integrity

USNIC provides current Antarctic iceberg tracking data as CSV. Copernicus Sentinel Hub provides catalog/processing APIs, and Copernicus Marine provides programmatic access to ocean datasets. The POLARIS UI labels unavailable feeds as simulated/configuration-required instead of presenting mock values as live operational data.

The current-assisted iceberg drift calculation is a prototype decision-support estimate. It is not a certified navigation forecast and should not be used for real-world vessel control.
