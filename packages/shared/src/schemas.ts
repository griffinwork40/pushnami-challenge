import { z } from 'zod';

// ─── Shared Validation Schemas ───────────────────────────────────────────────

export const EVENT_TYPES = [
  'page_view', 'click', 'form_submit', 'cta_click', 'scroll_depth',
] as const;

export const EXPERIMENT_STATUSES = ['active', 'paused', 'completed'] as const;

export const VariantSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const AssignVariantSchema = z.object({
  visitorId: z.string().uuid(),
  experimentId: z.string().uuid(),
});

export const CreateExperimentSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000),
  variants: z.array(VariantSchema).min(2).max(10),
  trafficSplit: z.array(z.number().min(0).max(100)),
}).refine(
  (data) => data.variants.length === data.trafficSplit.length,
  { message: 'trafficSplit must have same length as variants' },
).refine(
  (data) => data.trafficSplit.reduce((a, b) => a + b, 0) === 100,
  { message: 'trafficSplit must sum to 100' },
);

export const UpdateExperimentSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(EXPERIMENT_STATUSES).optional(),
  trafficSplit: z.array(z.number().min(0).max(100)).optional(),
});

export const IngestEventSchema = z.object({
  visitorId: z.string().uuid(),
  experimentId: z.string().uuid(),
  variantId: z.string().uuid(),
  eventType: z.enum(EVENT_TYPES),
  metadata: z.record(z.unknown()).optional().default({}),
});

export const StatsQuerySchema = z.object({
  experimentId: z.string().uuid().optional(),
  variantId: z.string().uuid().optional(),
  eventType: z.enum(EVENT_TYPES).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const ToggleUpdateSchema = z.object({
  enabled: z.boolean(),
});

export const UUIDParam = z.object({
  id: z.string().uuid(),
});
