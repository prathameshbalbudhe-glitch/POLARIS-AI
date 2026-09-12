import type {
  Iceberg,
  Alert,
  VesselInfo,
  WeatherInfo,
  SeaIceInfo,
  RouteInfo,
  MissionHistoryEntry,
  DataPipelineStage,
  DataSource,
} from '@/types';

export let VESSEL: VesselInfo = {
  name: 'RV Aurora',
  speed: 12.4,
  heading: 142,
  lat: -64.231,
  lon: 58.942,
  status: 'Navigating',
  eta: '14:32 UTC',
  nextWaypoint: 'WP-07 Scotia Ridge',
  distanceToWaypoint: 47.3,
};

export let WEATHER: WeatherInfo = {
  temperature: -18.3,
  windSpeed: 28,
  windDir: 'SSW',
  visibility: 2.4,
  seaState: 'Rough (5)',
  pressure: 982,
  humidity: 87,
};

export let SEA_ICE: SeaIceInfo = {
  concentration: 62,
  thickness: 1.4,
  movement: 'NNE at 0.3 knots',
  type: 'Multi-year pack ice',
  edgeDistance: 12.6,
};

export let ICEBERGS: Iceberg[] = [
  {
    id: 'ICE-047',
    lat: -64.18,
    lon: 59.12,
    size: 'large',
    length: 420,
    height: 52,
    distance: 8.4,
    movementDir: 'NE',
    movementDirDeg: 45,
    speed: 0.8,
    risk: 'HIGH',
    confidence: 91,
    predictedLat: -64.12,
    predictedLon: 59.22,
    trajectoryPoints: [
      { lat: -64.18, lon: 59.12, hoursAhead: 0 },
      { lat: -64.16, lon: 59.15, hoursAhead: 1 },
      { lat: -64.14, lon: 59.18, hoursAhead: 3 },
      { lat: -64.12, lon: 59.22, hoursAhead: 6 },
      { lat: -64.08, lon: 59.3, hoursAhead: 12 },
      { lat: -64.02, lon: 59.42, hoursAhead: 24 },
    ],
    recommendedClearance: 12,
    detectedAt: '08:42 UTC',
  },
  {
    id: 'ICE-031',
    lat: -64.35,
    lon: 58.75,
    size: 'massive',
    length: 680,
    height: 78,
    distance: 14.2,
    movementDir: 'E',
    movementDirDeg: 90,
    speed: 0.5,
    risk: 'CRITICAL',
    confidence: 94,
    predictedLat: -64.33,
    predictedLon: 58.9,
    trajectoryPoints: [
      { lat: -64.35, lon: 58.75, hoursAhead: 0 },
      { lat: -64.34, lon: 58.78, hoursAhead: 1 },
      { lat: -64.33, lon: 58.83, hoursAhead: 3 },
      { lat: -64.33, lon: 58.9, hoursAhead: 6 },
      { lat: -64.32, lon: 59.02, hoursAhead: 12 },
      { lat: -64.3, lon: 59.2, hoursAhead: 24 },
    ],
    recommendedClearance: 15,
    detectedAt: '06:15 UTC',
  },
  {
    id: 'ICE-052',
    lat: -64.05,
    lon: 59.05,
    size: 'medium',
    length: 180,
    height: 28,
    distance: 18.7,
    movementDir: 'N',
    movementDirDeg: 0,
    speed: 1.1,
    risk: 'MODERATE',
    confidence: 85,
    predictedLat: -63.98,
    predictedLon: 59.06,
    trajectoryPoints: [
      { lat: -64.05, lon: 59.05, hoursAhead: 0 },
      { lat: -64.03, lon: 59.055, hoursAhead: 1 },
      { lat: -64.01, lon: 59.06, hoursAhead: 3 },
      { lat: -63.98, lon: 59.06, hoursAhead: 6 },
      { lat: -63.93, lon: 59.07, hoursAhead: 12 },
      { lat: -63.85, lon: 59.08, hoursAhead: 24 },
    ],
    recommendedClearance: 8,
    detectedAt: '09:20 UTC',
  },
  {
    id: 'ICE-068',
    lat: -64.42,
    lon: 59.3,
    size: 'medium',
    length: 220,
    height: 34,
    distance: 22.5,
    movementDir: 'NE',
    movementDirDeg: 50,
    speed: 0.6,
    risk: 'MODERATE',
    confidence: 82,
    predictedLat: -64.38,
    predictedLon: 59.38,
    trajectoryPoints: [
      { lat: -64.42, lon: 59.3, hoursAhead: 0 },
      { lat: -64.4, lon: 59.33, hoursAhead: 1 },
      { lat: -64.38, lon: 59.36, hoursAhead: 3 },
      { lat: -64.36, lon: 59.38, hoursAhead: 6 },
      { lat: -64.32, lon: 59.44, hoursAhead: 12 },
      { lat: -64.25, lon: 59.55, hoursAhead: 24 },
    ],
    recommendedClearance: 10,
    detectedAt: '07:50 UTC',
  },
  {
    id: 'ICE-019',
    lat: -63.92,
    lon: 58.6,
    size: 'small',
    length: 95,
    height: 15,
    distance: 31.8,
    movementDir: 'SW',
    movementDirDeg: 225,
    speed: 0.9,
    risk: 'LOW',
    confidence: 78,
    predictedLat: -63.95,
    predictedLon: 58.55,
    trajectoryPoints: [
      { lat: -63.92, lon: 58.6, hoursAhead: 0 },
      { lat: -63.925, lon: 58.58, hoursAhead: 1 },
      { lat: -63.93, lon: 58.56, hoursAhead: 3 },
      { lat: -63.95, lon: 58.55, hoursAhead: 6 },
      { lat: -63.98, lon: 58.52, hoursAhead: 12 },
      { lat: -64.02, lon: 58.48, hoursAhead: 24 },
    ],
    recommendedClearance: 5,
    detectedAt: '05:30 UTC',
  },
  {
    id: 'ICE-074',
    lat: -64.5,
    lon: 58.5,
    size: 'large',
    length: 350,
    height: 45,
    distance: 28.3,
    movementDir: 'E',
    movementDirDeg: 90,
    speed: 0.4,
    risk: 'LOW',
    confidence: 88,
    predictedLat: -64.48,
    predictedLon: 58.62,
    trajectoryPoints: [
      { lat: -64.5, lon: 58.5, hoursAhead: 0 },
      { lat: -64.49, lon: 58.53, hoursAhead: 1 },
      { lat: -64.48, lon: 58.57, hoursAhead: 3 },
      { lat: -64.48, lon: 58.62, hoursAhead: 6 },
      { lat: -64.47, lon: 58.72, hoursAhead: 12 },
      { lat: -64.45, lon: 58.9, hoursAhead: 24 },
    ],
    recommendedClearance: 10,
    detectedAt: '04:10 UTC',
  },
  {
    id: 'ICE-088',
    lat: -64.1,
    lon: 58.4,
    size: 'medium',
    length: 200,
    height: 30,
    distance: 35.6,
    movementDir: 'NE',
    movementDirDeg: 40,
    speed: 0.7,
    risk: 'LOW',
    confidence: 80,
    predictedLat: -64.05,
    predictedLon: 58.5,
    trajectoryPoints: [
      { lat: -64.1, lon: 58.4, hoursAhead: 0 },
      { lat: -64.08, lon: 58.42, hoursAhead: 1 },
      { lat: -64.06, lon: 58.45, hoursAhead: 3 },
      { lat: -64.05, lon: 58.5, hoursAhead: 6 },
      { lat: -64.0, lon: 58.6, hoursAhead: 12 },
      { lat: -63.92, lon: 58.78, hoursAhead: 24 },
    ],
    recommendedClearance: 8,
    detectedAt: '10:05 UTC',
  },
];

export let ALERTS: Alert[] = [
  {
    id: 'ALT-001',
    timestamp: '09:42 UTC',
    severity: 'HIGH',
    category: 'Iceberg Threat',
    title: 'ICE-047 entering safety corridor',
    description: 'ICE-047 predicted to enter 10 NM safety corridor within 6 hours at current drift rate.',
    action: 'Reduce speed and maintain 12 NM clearance from predicted iceberg trajectory.',
    acknowledged: false,
    icebergId: 'ICE-047',
  },
  {
    id: 'ALT-002',
    timestamp: '09:28 UTC',
    severity: 'HIGH',
    category: 'Collision Risk',
    title: 'ICE-031 on intersecting course',
    description: 'Massive iceberg ICE-031 trajectory intersects current route within 12 hours.',
    action: 'Consider immediate course adjustment to 165° heading.',
    acknowledged: false,
    icebergId: 'ICE-031',
  },
  {
    id: 'ALT-003',
    timestamp: '09:15 UTC',
    severity: 'MEDIUM',
    category: 'Sea Ice',
    title: 'Sea-ice concentration increasing',
    description: 'Sea-ice concentration along current route increased from 55% to 62% in last 3 hours.',
    action: 'Monitor ice thickness and consider route optimization.',
    acknowledged: false,
  },
  {
    id: 'ALT-004',
    timestamp: '08:50 UTC',
    severity: 'MEDIUM',
    category: 'Weather',
    title: 'Visibility deteriorating',
    description: 'Visibility dropped to 2.4 NM. Forecast indicates further reduction over next 6 hours.',
    action: 'Reduce speed and activate enhanced radar monitoring.',
    acknowledged: true,
  },
  {
    id: 'ALT-005',
    timestamp: '08:30 UTC',
    severity: 'INFO',
    category: 'Route Optimization',
    title: 'AI route optimization available',
    description: 'A safer alternative route has been identified with 34% lower risk score.',
    action: 'Review recommended route in Route Optimizer.',
    acknowledged: false,
  },
  {
    id: 'ALT-006',
    timestamp: '08:12 UTC',
    severity: 'INFO',
    category: 'System',
    title: 'Prediction model updated',
    description: 'Iceberg trajectory prediction model refreshed with latest environmental data.',
    action: 'No action required.',
    acknowledged: true,
  },
];

export let CURRENT_ROUTE: RouteInfo = {
  name: 'Current Route',
  distance: 384.6,
  estimatedTime: '31h 12m',
  icebergEncounters: 7,
  riskScore: 68,
  fuelEstimate: 42.8,
  waypoints: [
    { lat: -64.231, lon: 58.942, label: 'RV Aurora' },
    { lat: -64.15, lon: 59.0, label: 'WP-05' },
    { lat: -64.08, lon: 59.1, label: 'WP-06' },
    { lat: -64.0, lon: 59.25, label: 'WP-07 Scotia Ridge' },
    { lat: -63.88, lon: 59.4, label: 'WP-08' },
    { lat: -63.75, lon: 59.55, label: 'Destination' },
  ],
  color: '#f59e0b',
  dashed: false,
};

export let AI_ROUTE: RouteInfo = {
  name: 'AI Recommended Route',
  distance: 412.3,
  estimatedTime: '33h 45m',
  icebergEncounters: 2,
  riskScore: 34,
  fuelEstimate: 45.2,
  waypoints: [
    { lat: -64.231, lon: 58.942, label: 'RV Aurora' },
    { lat: -64.28, lon: 58.88, label: 'WP-A1' },
    { lat: -64.35, lon: 58.78, label: 'WP-A2' },
    { lat: -64.4, lon: 58.95, label: 'WP-A3' },
    { lat: -64.32, lon: 59.15, label: 'WP-A4' },
    { lat: -63.88, lon: 59.4, label: 'WP-08' },
    { lat: -63.75, lon: 59.55, label: 'Destination' },
  ],
  color: '#38b6ff',
  dashed: true,
};

export let MISSION_HISTORY: MissionHistoryEntry[] = [
  {
    id: 'ANT-26059',
    name: 'Scotia Ridge Survey',
    startDate: '2026-09-01',
    endDate: 'Ongoing',
    duration: '7 days',
    routeEfficiency: 87,
    icebergEncounters: 14,
    alerts: 23,
    safetyScore: 91,
    riskOverTime: [45, 52, 48, 55, 62, 58, 68, 71, 65, 60, 55, 50],
    icebergDetections: [3, 5, 4, 7, 6, 8, 5, 9, 7, 6, 4, 3],
  },
  {
    id: 'ANT-26042',
    name: 'Weddell Sea Transit',
    startDate: '2026-08-15',
    endDate: '2026-08-22',
    duration: '7 days',
    routeEfficiency: 82,
    icebergEncounters: 22,
    alerts: 31,
    safetyScore: 85,
    riskOverTime: [30, 35, 42, 50, 58, 65, 70, 68, 60, 52, 45, 40],
    icebergDetections: [5, 8, 10, 12, 9, 11, 8, 6, 5, 4, 3, 2],
  },
  {
    id: 'ANT-26031',
    name: 'Bellingshausen Patrol',
    startDate: '2026-07-20',
    endDate: '2026-07-28',
    duration: '8 days',
    routeEfficiency: 79,
    icebergEncounters: 18,
    alerts: 27,
    safetyScore: 88,
    riskOverTime: [40, 45, 50, 55, 60, 55, 50, 45, 48, 52, 48, 42],
    icebergDetections: [4, 6, 8, 7, 9, 6, 5, 7, 4, 3, 2, 2],
  },
  {
    id: 'ANT-26018',
    name: 'Amundsen Sea Approach',
    startDate: '2026-06-10',
    endDate: '2026-06-17',
    duration: '7 days',
    routeEfficiency: 90,
    icebergEncounters: 9,
    alerts: 15,
    safetyScore: 94,
    riskOverTime: [25, 28, 30, 35, 32, 30, 28, 25, 22, 20, 18, 22],
    icebergDetections: [2, 3, 4, 3, 2, 3, 2, 1, 2, 1, 1, 1],
  },
];

export let PIPELINE_STAGES: DataPipelineStage[] = [
  { id: 'sources', name: 'Data Sources', icon: 'Database', status: 'active', description: 'Satellite, AIS, weather, ocean, radar, cameras' },
  { id: 'preprocessing', name: 'Data Preprocessing', icon: 'Filter', status: 'processing', description: 'Cleaning, normalization, fusion' },
  { id: 'detection', name: 'Iceberg Detection', icon: 'ScanEye', status: 'active', description: 'Computer vision detection pipeline' },
  { id: 'trajectory', name: 'Trajectory Prediction', icon: 'TrendingUp', status: 'active', description: 'Drift prediction model' },
  { id: 'risk', name: 'Environmental Risk Analysis', icon: 'ShieldAlert', status: 'processing', description: 'Multi-factor risk assessment' },
  { id: 'route', name: 'AI Route Optimization', icon: 'Route', status: 'active', description: 'Safe path generation' },
  { id: 'navigator', name: 'Human Navigator', icon: 'UserCheck', status: 'ready', description: 'Decision support review' },
  { id: 'safe', name: 'Safer Navigation', icon: 'ShieldCheck', status: 'active', description: 'Optimized transit' },
];

export let DATA_SOURCES: DataSource[] = [
  { name: 'Satellite Imagery', status: 'simulated', description: 'SAR & optical satellite imagery for iceberg detection', icon: 'Satellite' },
  { name: 'AIS', status: 'simulated', description: 'Automatic Identification System vessel tracking', icon: 'Radio' },
  { name: 'Weather Data', status: 'simulated', description: 'Wind, temperature, pressure, visibility data', icon: 'CloudWind' },
  { name: 'Ocean Current Data', status: 'simulated', description: 'Surface and subsurface current models', icon: 'Waves' },
  { name: 'Sea-Ice Data', status: 'simulated', description: 'Ice concentration, thickness, and movement', icon: 'Snowflake' },
  { name: 'Onboard Radar', status: 'ready', description: 'Marine radar for surface obstacle detection', icon: 'Radar' },
  { name: 'Cameras', status: 'ready', description: 'Optical and thermal imaging systems', icon: 'Camera' },
];

export let RISK_CATEGORIES = [
  { name: 'Collision Risk', value: 68, level: 'HIGH' as const, color: '#ef4444' },
  { name: 'Sea-Ice Risk', value: 55, level: 'MODERATE' as const, color: '#f59e0b' },
  { name: 'Weather Risk', value: 48, level: 'MODERATE' as const, color: '#f59e0b' },
  { name: 'Visibility Risk', value: 42, level: 'MODERATE' as const, color: '#f59e0b' },
  { name: 'Navigation Risk', value: 35, level: 'LOW' as const, color: '#10b981' },
];

export let RISK_TIMELINE = [
  { time: 'Now', value: 52, label: 'MODERATE' },
  { time: '+1h', value: 55, label: 'MODERATE' },
  { time: '+3h', value: 62, label: 'HIGH' },
  { time: '+6h', value: 71, label: 'HIGH' },
  { time: '+9h', value: 68, label: 'HIGH' },
  { time: '+12h', value: 58, label: 'MODERATE' },
  { time: '+15h', value: 48, label: 'MODERATE' },
  { time: '+18h', value: 42, label: 'MODERATE' },
  { time: '+21h', value: 38, label: 'LOW' },
  { time: '+24h', value: 35, label: 'LOW' },
];

export let SIMULATION_STEPS = [
  { step: 1, title: 'Iceberg Detected', description: 'ICE-047 identified via computer vision pipeline at 8.4 NM from vessel.' },
  { step: 2, title: 'Trajectory Predicted', description: 'AI predicts NE drift at 0.8 knots. 6-hour position calculated with 91% confidence.' },
  { step: 3, title: 'Collision Risk Calculated', description: 'ICE-047 predicted to enter 10 NM safety corridor within 6 hours. Risk level: HIGH.' },
  { step: 4, title: 'Alternative Routes Evaluated', description: 'AI evaluates 12 candidate routes considering ice concentration, weather, and iceberg trajectories.' },
  { step: 5, title: 'Safer Route Generated', description: 'Optimal route identified with 34% lower risk score. Iceberg encounters reduced from 7 to 2.' },
  { step: 6, title: 'Navigator Approval Required', description: 'AI recommendation ready for human operator review. Final decision remains with qualified navigator.' },
];


export type LiveDashboardPayload = {
  timestamp: string;
  vessel?: VesselInfo & { source?: string; live?: boolean };
  icebergs?: { source?: string; live?: boolean; items?: Iceberg[] };
  ocean?: { available?: boolean; source?: string; u?: number; v?: number };
  sources?: Record<string, boolean>;
};

/** Merge live backend data into the existing UI model while retaining the demo fallback. */
export function setLiveData(payload: LiveDashboardPayload) {
  if (payload.vessel) {
    VESSEL = { ...VESSEL, ...payload.vessel };
  }
  if (payload.icebergs?.items?.length) {
    ICEBERGS = payload.icebergs.items;
  }

  const sourceStatus = payload.sources || {};
  DATA_SOURCES = DATA_SOURCES.map((source) => {
    if (source.name === 'Satellite Imagery') return { ...source, status: sourceStatus.CopernicusSentinel ? 'connected' : 'simulated', description: sourceStatus.CopernicusSentinel ? 'Copernicus Sentinel-1 catalog feed configured' : 'Copernicus Sentinel-1 feed awaiting OAuth credentials' };
    if (source.name === 'AIS') return { ...source, status: sourceStatus.VesselAIS ? 'connected' : 'simulated', description: sourceStatus.VesselAIS ? 'Configured vessel/AIS provider' : 'AIS provider endpoint not configured; demo vessel retained' };
    if (source.name === 'Ocean Current Data') return { ...source, status: sourceStatus.CopernicusMarine ? 'connected' : 'simulated', description: sourceStatus.CopernicusMarine ? 'Copernicus Marine current feed' : 'Copernicus Marine credentials not configured' };
    if (source.name === 'Sea-Ice Data') return { ...source, status: 'ready', description: 'NSIDC sea-ice datasets are ready for the next adapter' };
    if (source.name === 'Weather Data') return { ...source, status: 'simulated', description: 'Weather adapter not configured; prototype fallback retained' };
    if (source.name === 'USNIC Icebergs') return source;
    return source;
  });

  const hasUSNIC = Boolean(payload.icebergs?.live);
  const hasMarine = Boolean(payload.ocean?.available);
  const icebergSource = DATA_SOURCES.find((s) => s.name === 'USNIC Icebergs');
  if (hasUSNIC && !icebergSource) {
    DATA_SOURCES = [{ name: 'USNIC Icebergs', status: 'connected', description: 'U.S. National Ice Center Antarctic iceberg CSV feed', icon: 'Snowflake' }, ...DATA_SOURCES];
  }
  if (hasUSNIC && icebergSource) {
    DATA_SOURCES = DATA_SOURCES.map((source) => source.name === 'USNIC Icebergs' ? { ...source, status: 'connected' } : source);
  }
  if (!hasMarine) {
    SEA_ICE = { ...SEA_ICE, movement: SEA_ICE.movement };
  }
}
