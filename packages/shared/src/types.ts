// ─── Core Domain Types ───────────────────────────────────────────────────────

export interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  trafficSplit: number[]; // percentages, must sum to 100
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  id: string;
  name: string;
  description?: string;
}

export interface Assignment {
  id: string;
  visitorId: string;
  experimentId: string;
  variantId: string;
  assignedAt: string;
}

export interface TrackingEvent {
  id: string;
  visitorId: string;
  experimentId: string;
  variantId: string;
  eventType: EventType;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export type EventType = 'page_view' | 'click' | 'form_submit' | 'cta_click' | 'scroll_depth';

export interface FeatureToggle {
  id: string;
  key: string;
  enabled: boolean;
  description: string;
  updatedAt: string;
}

// ─── API Request/Response Types ──────────────────────────────────────────────

export interface AssignVariantRequest {
  visitorId: string;
  experimentId: string;
}

export interface AssignVariantResponse {
  visitorId: string;
  experimentId: string;
  variantId: string;
  variantName: string;
}

export interface CreateExperimentRequest {
  name: string;
  description: string;
  variants: Omit<Variant, 'id'>[];
  trafficSplit: number[];
}

export interface UpdateExperimentRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'paused' | 'completed';
  trafficSplit?: number[];
}

export interface IngestEventRequest {
  visitorId: string;
  experimentId: string;
  variantId: string;
  eventType: EventType;
  metadata?: Record<string, unknown>;
}

export interface StatsQuery {
  experimentId?: string;
  variantId?: string;
  eventType?: EventType;
  startDate?: string;
  endDate?: string;
}

export interface VariantStats {
  variantId: string;
  variantName: string;
  totalEvents: number;
  uniqueVisitors: number;
  eventBreakdown: Record<EventType, number>;
  conversionRate: number;
}

export interface ExperimentStats {
  experimentId: string;
  experimentName: string;
  totalVisitors: number;
  variants: VariantStats[];
  confidence: number | null; // p-value from chi-squared test
  significanceReached: boolean;
}

export interface ToggleUpdateRequest {
  enabled: boolean;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded';
  service: string;
  version: string;
  uptime: number;
  timestamp: string;
}
