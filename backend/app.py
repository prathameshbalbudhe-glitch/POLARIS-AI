import csv
import io
import math
import os
from datetime import datetime, timezone
from typing import Any

import requests
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

USNIC_CSV_URL = os.getenv("USNIC_ANTARCTIC_ICEBERGS_URL", "https://usicecenter.gov/File/DownloadCurrent?pId=134")
COPERNICUS_TOKEN_URL = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
COPERNICUS_CATALOG_URL = "https://sh.dataspace.copernicus.eu/catalog/v1/search"
COPERNICUS_CLIENT_ID = os.getenv("COPERNICUS_CLIENT_ID", "")
COPERNICUS_CLIENT_SECRET = os.getenv("COPERNICUS_CLIENT_SECRET", "")

# Copernicus Marine dataset documented by the service for global forecast currents.
MARINE_DATASET_ID = os.getenv("COPERNICUS_MARINE_DATASET_ID", "cmems_mod_glo_phy-cur_anfc_0.083deg_P1D-m")
MARINE_USERNAME = os.getenv("COPERNICUS_MARINE_USERNAME", "")
MARINE_PASSWORD = os.getenv("COPERNICUS_MARINE_PASSWORD", "")

VESSEL_API_URL = os.getenv("VESSEL_API_URL", "")
VESSEL_API_KEY = os.getenv("VESSEL_API_KEY", "")

FALLBACK_VESSEL = {
    "name": "RV Aurora", "speed": 12.4, "heading": 142, "lat": -64.231, "lon": 58.942,
    "status": "Navigating", "eta": "14:32 UTC", "nextWaypoint": "WP-07 Scotia Ridge", "distanceToWaypoint": 47.3,
}

app = FastAPI(title="POLARIS AI Data Gateway", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def pick(row: dict[str, Any], *names: str) -> Any:
    normalized = {str(k).strip().lower().replace(" ", "_"): v for k, v in row.items()}
    for name in names:
        value = normalized.get(name.lower().replace(" ", "_"))
        if value not in (None, ""):
            return value
    return None


def number(value: Any, default: float = 0.0) -> float:
    try:
        return float(str(value).strip().replace(",", ""))
    except (TypeError, ValueError):
        return default


def haversine_nm(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r_km = 6371.0088
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return (2 * r_km * math.asin(math.sqrt(a))) / 1.852


def risk_for_distance(distance_nm: float) -> str:
    if distance_nm <= 8:
        return "CRITICAL"
    if distance_nm <= 15:
        return "HIGH"
    if distance_nm <= 25:
        return "MODERATE"
    return "LOW"


def propagate(lat: float, lon: float, u_ms: float, v_ms: float, hours: float, coefficient: float = 0.35):
    # Lightweight drift model: ocean-current vector * drift coefficient.
    # It is a decision-support estimate, not a validated operational forecast.
    meters = math.hypot(u_ms, v_ms) * hours * 3600 * coefficient
    if meters == 0:
        return lat, lon
    bearing = math.degrees(math.atan2(u_ms, v_ms))
    dlat = (meters * math.cos(math.radians(bearing))) / 111_320
    cos_lat = max(0.2, math.cos(math.radians(lat)))
    dlon = (meters * math.sin(math.radians(bearing))) / (111_320 * cos_lat)
    return lat + dlat, lon + dlon


def fetch_usnic_icebergs() -> list[dict[str, Any]]:
    response = requests.get(USNIC_CSV_URL, timeout=30)
    response.raise_for_status()
    text = response.content.decode("utf-8-sig", errors="replace")
    reader = csv.DictReader(io.StringIO(text))
    vessel = FALLBACK_VESSEL
    result = []
    for index, row in enumerate(reader):
        lat = number(pick(row, "latitude", "lat", "location_latitude"), float("nan"))
        lon = number(pick(row, "longitude", "lon", "location_longitude"), float("nan"))
        if math.isnan(lat) or math.isnan(lon):
            continue
        name = str(pick(row, "name", "iceberg_name", "id") or f"USNIC-{index + 1:03d}").strip()
        length_nm = number(pick(row, "length", "length_nm"), 0)
        width_nm = number(pick(row, "width", "width_nm"), 0)
        distance = haversine_nm(vessel["lat"], vessel["lon"], lat, lon)
        risk = risk_for_distance(distance)
        result.append({
            "id": name,
            "lat": lat,
            "lon": lon,
            "size": "massive" if length_nm >= 20 else "large" if length_nm >= 10 else "medium",
            "length": round(length_nm * 1852, 1),
            "height": 0,
            "distance": round(distance, 1),
            "movementDir": "N/A",
            "movementDirDeg": 0,
            "speed": 0,
            "risk": risk,
            "confidence": 100,
            "predictedLat": lat,
            "predictedLon": lon,
            "trajectoryPoints": [
                {"lat": lat, "lon": lon, "hoursAhead": 0},
                {"lat": lat, "lon": lon, "hoursAhead": 6},
                {"lat": lat, "lon": lon, "hoursAhead": 12},
                {"lat": lat, "lon": lon, "hoursAhead": 24},
            ],
            "recommendedClearance": 12 if risk in ("HIGH", "CRITICAL") else 8,
            "detectedAt": str(pick(row, "date", "last_update", "update_date") or "USNIC latest"),
            "dataSource": "USNIC",
            "predictionStatus": "Awaiting ocean-current feed",
            "region": str(pick(row, "region") or "Antarctic waters"),
            "width": width_nm,
        })
    return result


def get_copernicus_token() -> str:
    if not COPERNICUS_CLIENT_ID or not COPERNICUS_CLIENT_SECRET:
        raise RuntimeError("Copernicus OAuth credentials are not configured")
    response = requests.post(
        COPERNICUS_TOKEN_URL,
        data={
            "grant_type": "client_credentials",
            "client_id": COPERNICUS_CLIENT_ID,
            "client_secret": COPERNICUS_CLIENT_SECRET,
        },
        timeout=20,
    )
    response.raise_for_status()
    return response.json()["access_token"]


def satellite_catalog(bbox: list[float], hours: int = 72):
    token = get_copernicus_token()
    now = datetime.now(timezone.utc)
    start = now.timestamp() - hours * 3600
    from datetime import timedelta
    start_iso = (now - timedelta(hours=hours)).isoformat().replace("+00:00", "Z")
    end_iso = now.isoformat().replace("+00:00", "Z")
    payload = {
        "collections": ["sentinel-1-grd"],
        "datetime": f"{start_iso}/{end_iso}",
        "bbox": bbox,
        "limit": 10,
    }
    response = requests.post(
        COPERNICUS_CATALOG_URL,
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    return [{
        "id": item.get("id"),
        "datetime": item.get("properties", {}).get("datetime"),
        "collection": item.get("collection"),
        "bbox": item.get("bbox"),
    } for item in data.get("features", [])]


def ocean_current(lat: float, lon: float):
    if not MARINE_USERNAME or not MARINE_PASSWORD:
        return {"available": False, "source": "Copernicus Marine", "reason": "credentials_not_configured", "u": 0, "v": 0}
    try:
        import copernicusmarine
        ds = copernicusmarine.open_dataset(
            dataset_id=MARINE_DATASET_ID,
            username=MARINE_USERNAME,
            password=MARINE_PASSWORD,
        )
        # Variable names are uo/vo in the documented current products.
        point = ds.sel(longitude=lon, latitude=lat, method="nearest").isel(time=-1)
        u = float(point["uo"].values)
        v = float(point["vo"].values)
        return {"available": True, "source": "Copernicus Marine", "u": u, "v": v, "unit": "m/s"}
    except Exception as exc:
        return {"available": False, "source": "Copernicus Marine", "reason": str(exc), "u": 0, "v": 0}


def vessel_position():
    if not VESSEL_API_URL:
        return {**FALLBACK_VESSEL, "source": "simulation", "live": False}
    headers = {"Accept": "application/json"}
    if VESSEL_API_KEY:
        headers["Authorization"] = f"Bearer {VESSEL_API_KEY}"
    response = requests.get(VESSEL_API_URL, headers=headers, timeout=20)
    response.raise_for_status()
    data = response.json()
    # Map common AIS field names into POLARIS schema.
    return {
        "name": data.get("name", FALLBACK_VESSEL["name"]),
        "speed": number(data.get("speed", data.get("sog", FALLBACK_VESSEL["speed"]))),
        "heading": number(data.get("heading", data.get("cog", FALLBACK_VESSEL["heading"]))),
        "lat": number(data.get("lat", data.get("latitude", FALLBACK_VESSEL["lat"]))),
        "lon": number(data.get("lon", data.get("longitude", FALLBACK_VESSEL["lon"]))),
        "status": data.get("status", "Live AIS"),
        "eta": data.get("eta", FALLBACK_VESSEL["eta"]),
        "nextWaypoint": data.get("nextWaypoint", FALLBACK_VESSEL["nextWaypoint"]),
        "distanceToWaypoint": number(data.get("distanceToWaypoint", FALLBACK_VESSEL["distanceToWaypoint"])),
        "source": "configured AIS provider",
        "live": True,
    }


@app.get("/api/health")
def health():
    return {"ok": True, "service": "POLARIS AI Data Gateway", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.get("/api/icebergs")
def icebergs():
    try:
        data = fetch_usnic_icebergs()
        return {"source": "USNIC", "live": True, "count": len(data), "items": data}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"USNIC iceberg feed unavailable: {exc}") from exc


@app.get("/api/satellite")
def satellite(min_lon: float = Query(55), min_lat: float = Query(-68), max_lon: float = Query(65), max_lat: float = Query(-60)):
    try:
        items = satellite_catalog([min_lon, min_lat, max_lon, max_lat])
        return {"source": "Copernicus Sentinel-1", "live": True, "count": len(items), "items": items}
    except Exception as exc:
        return {"source": "Copernicus Sentinel-1", "live": False, "configured": bool(COPERNICUS_CLIENT_ID), "items": [], "message": str(exc)}


@app.get("/api/ocean")
def ocean(lat: float = -64.231, lon: float = 58.942):
    return ocean_current(lat, lon)


@app.get("/api/vessel")
def vessel():
    try:
        return vessel_position()
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Vessel provider unavailable: {exc}") from exc


@app.get("/api/dashboard")
def dashboard():
    vessel_data = vessel_position()
    ocean_data = ocean_current(vessel_data["lat"], vessel_data["lon"])
    try:
        raw_icebergs = fetch_usnic_icebergs()
        # If currents are available, apply a transparent, lightweight drift estimate.
        if ocean_data.get("available"):
            for item in raw_icebergs:
                points = []
                for hours in (0, 1, 3, 6, 12, 24):
                    p_lat, p_lon = propagate(item["lat"], item["lon"], ocean_data["u"], ocean_data["v"], hours)
                    points.append({"lat": round(p_lat, 5), "lon": round(p_lon, 5), "hoursAhead": hours})
                item["trajectoryPoints"] = points
                item["predictedLat"] = points[3]["lat"]
                item["predictedLon"] = points[3]["lon"]
                item["predictionStatus"] = "Current-assisted drift estimate"
                item["confidence"] = 65
        iceberg_data = {"source": "USNIC", "live": True, "items": raw_icebergs}
    except Exception as exc:
        iceberg_data = {"source": "USNIC", "live": False, "items": [], "message": str(exc)}
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "vessel": vessel_data,
        "ocean": ocean_data,
        "icebergs": iceberg_data,
        "sources": {
            "USNIC": iceberg_data.get("live", False),
            "CopernicusMarine": ocean_data.get("available", False),
            "VesselAIS": vessel_data.get("live", False),
            "CopernicusSentinel": bool(COPERNICUS_CLIENT_ID and COPERNICUS_CLIENT_SECRET),
        },
    }
