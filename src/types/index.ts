export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type AlertSeverity = 'HIGH' | 'MEDIUM' | 'INFO';
export type PageKey =
  | 'command'
  | 'navigation'
  | 'iceberg'
  | 'route'
  | 'risk'
  | 'alerts'
  | 'history'
  | 'settings';

export interface Iceberg {
  id: string;
  lat: number;
  lon: number;
  size: 'small' | 'medium' | 'large' | 'massive';
  length: number;
  height: number;
  distance: number;
  movementDir: string;
  movementDirDeg: number;
  speed: number;
  risk: RiskLevel;
  confidence: number;
  predictedLat: number;
  predictedLon: number;
  trajectoryPoints: { lat: number; lon: number; hoursAhead: number }[];
  recommendedClearance: number;
  detectedAt: string;
  dataSource?: string;
  predictionStatus?: string;
  region?: string;
  width?: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  category: string;
  title: string;
  description: string;
  action: string;
  acknowledged: boolean;
  icebergId?: string;
}

export interface VesselInfo {
  name: string;
  speed: number;
  heading: number;
  lat: number;
  lon: number;
  status: string;
  eta: string;
  nextWaypoint: string;
  distanceToWaypoint: number;
}

export interface WeatherInfo {
  temperature: number;
  windSpeed: number;
  windDir: string;
  visibility: number;
  seaState: string;
  pressure: number;
  humidity: number;
}

export interface SeaIceInfo {
  concentration: number;
  thickness: number;
  movement: string;
  type: string;
  edgeDistance: number;
}

export interface RouteInfo {
  name: string;
  distance: number;
  estimatedTime: string;
  icebergEncounters: number;
  riskScore: number;
  fuelEstimate: number;
  waypoints: { lat: number; lon: number; label: string }[];
  color: string;
  dashed: boolean;
}

export interface MissionHistoryEntry {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: string;
  routeEfficiency: number;
  icebergEncounters: number;
  alerts: number;
  safetyScore: number;
  riskOverTime: number[];
  icebergDetections: number[];
}

export interface DataPipelineStage {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'processing' | 'ready';
  description: string;
}

export interface DataSource {
  name: string;
  status: 'connected' | 'simulated' | 'ready';
  description: string;
  icon: string;
}
