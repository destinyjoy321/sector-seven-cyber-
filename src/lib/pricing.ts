// Sector Seven Cyber LLC - Dynamic Pricing & Internal Cost Engine (V2.0)
// STRICT SECURITY NOTICE: Internal cost calculations and unit rates ($2.00 / $2.50)
// are strictly for internal administrative use and MUST NEVER be exposed to customer-facing quotes.

export interface PricingTier {
  min: number;
  max: number;
  monthlyPrice: number;
  label: string;
}

export interface PricingConfig {
  tiers: PricingTier[];
  endpointUnitCost: number; // Internal vendor cost per endpoint (default: $2.00)
  cloudUserUnitCost: number; // Internal vendor cost per cloud user (default: $2.50)
  customQuoteThreshold: number; // Environments exceeding this threshold require custom quote (default: 30)
}

const CONFIG_STORAGE_KEY = 'sector_seven_pricing_config_v2';

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  tiers: [
    { min: 1, max: 10, monthlyPrice: 500, label: '1–10 Protected Environment' },
    { min: 11, max: 20, monthlyPrice: 750, label: '11–20 Protected Environment' },
    { min: 21, max: 30, monthlyPrice: 1000, label: '21–30 Protected Environment' },
  ],
  endpointUnitCost: 2.0,
  cloudUserUnitCost: 2.5,
  customQuoteThreshold: 30,
};

import { supabase } from './supabaseClient';

export const PRICING_CHANGED_EVENT = 'sector_seven_pricing_changed';

export function getPricingConfig(): PricingConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.tiers) && parsed.tiers.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading pricing config from storage:', e);
  }
  return DEFAULT_PRICING_CONFIG;
}

export async function fetchRemotePricingConfig(): Promise<PricingConfig> {
  // 1. Try fetching from Supabase pricing_engine_config table directly
  try {
    const { data, error } = await supabase
      .from('pricing_engine_config')
      .select('config_json')
      .eq('id', 'current')
      .single();

    if (data && !error && data.config_json) {
      const raw = data.config_json as any;
      let validConfig: PricingConfig | null = null;

      if (Array.isArray(raw.tiers) && raw.tiers.length > 0) {
        validConfig = raw as PricingConfig;
      } else if (raw.tier1Price || raw.tier2Price || raw.tier3Price) {
        // Normalize legacy structure
        validConfig = {
          tiers: [
            { min: 1, max: raw.tier1Max || 10, monthlyPrice: raw.tier1Price || 500, label: '1–10 Protected Environment' },
            { min: 11, max: raw.tier2Max || 20, monthlyPrice: raw.tier2Price || 750, label: '11–20 Protected Environment' },
            { min: 21, max: raw.tier3Max || 30, monthlyPrice: raw.tier3Price || 1000, label: '21–30 Protected Environment' },
          ],
          endpointUnitCost: raw.endpointUnitCost || 2.0,
          cloudUserUnitCost: raw.cloudUserUnitCost || 2.5,
          customQuoteThreshold: raw.tier3Max || 30,
        };
      }

      if (validConfig) {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(validConfig));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(PRICING_CHANGED_EVENT, { detail: validConfig }));
        }
        return validConfig;
      }
    }
  } catch (err) {
    console.warn('Supabase remote pricing config fetch error:', err);
  }

  // 2. Fallback: Try serverless endpoint GET /api/update-pricing
  try {
    const apiRes = await fetch('/api/update-pricing', { method: 'GET' });
    if (apiRes.ok) {
      const { config } = await apiRes.json();
      if (config && Array.isArray(config.tiers) && config.tiers.length > 0) {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(PRICING_CHANGED_EVENT, { detail: config }));
        }
        return config;
      }
    }
  } catch (apiErr) {
    // silent fallback
  }

  return getPricingConfig();
}

export async function savePricingConfig(
  config: PricingConfig,
  passcode?: string
): Promise<{ success: boolean; error?: string }> {
  // Always update local storage first so immediate calculations work
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(PRICING_CHANGED_EVENT, { detail: config }));
    }
  } catch (e) {
    console.warn('Error saving pricing config to storage:', e);
  }

  const effectivePasscode =
    passcode ||
    (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('sector_seven_admin_passcode') : null) ||
    'sector7';

  // 1. Primary: Save via Vercel serverless API using backend service-role privileges
  try {
    const response = await fetch('/api/update-pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        config,
        passcode: effectivePasscode,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Pricing config synced to backend successfully via API:', data);
      return { success: true };
    } else {
      const errData = await response.json().catch(() => ({}));
      console.warn('API update pricing returned error:', errData);
      // If unauthorized or specific error, report it
      if (response.status === 401) {
        return { success: false, error: 'Unauthorized: Admin passcode invalid' };
      }
    }
  } catch (apiErr: any) {
    console.warn('Failed to call /api/update-pricing, trying direct client sync:', apiErr);
  }

  // 2. Direct Supabase Fallback (if API endpoint is unavailable)
  try {
    const { error } = await supabase
      .from('pricing_engine_config')
      .upsert([
        {
          id: 'current',
          updated_at: new Date().toISOString(),
          updated_by: 'ADMIN',
          config_json: config,
        },
      ]);

    if (error) {
      console.warn('Pricing config direct Supabase sync error:', error.message);
      return { success: false, error: error.message };
    }

    console.log('Pricing config synced to Supabase successfully via direct client.');
    return { success: true };
  } catch (err: any) {
    console.warn('Direct Supabase save exception:', err);
    return { success: false, error: err.message || 'Unknown save error' };
  }
}

export interface QuoteCalculationResult {
  deviceCount: number;
  cloudUserCount: number;
  evaluatingQuantity: number; // Higher of deviceCount and cloudUserCount
  tier: PricingTier | null;
  monthlyPrice: number | null;
  isCustomQuote: boolean;
  tierLabel: string;
  // Internal metrics (strictly isolated from client UI)
  internalEstimatedCost: number;
  internalEstimatedMargin: number | null;
}

/**
 * Calculates Sector Seven monthly subscription rate based on:
 * Rule: Use the higher of device count and cloud-user count to determine the pricing band.
 * Band 1-10: $500/mo
 * Band 11-20: $750/mo
 * Band 21-30: $1,000/mo
 * >30: Custom Cybersecurity Plan
 *
 * Internal Cost Calculation: (Device Count * $2.00) + (Cloud User Count * $2.50)
 */
export function calculateQuote(
  deviceCount: number,
  cloudUserCount: number,
  customConfig?: PricingConfig
): QuoteCalculationResult {
  const config = customConfig || getPricingConfig();
  const safeDevices = Math.max(0, Math.floor(deviceCount || 0));
  const safeCloudUsers = Math.max(0, Math.floor(cloudUserCount || 0));
  
  // Rule: Higher of the two quantities determines the pricing band
  const evaluatingQuantity = Math.max(safeDevices, safeCloudUsers);

  // Internal cost tracking (endpoint: $2.00, cloud user: $2.50)
  const internalCost = Number(
    (safeDevices * config.endpointUnitCost + safeCloudUsers * config.cloudUserUnitCost).toFixed(2)
  );

  // Check if exceeds custom threshold
  if (evaluatingQuantity > config.customQuoteThreshold || evaluatingQuantity === 0) {
    return {
      deviceCount: safeDevices,
      cloudUserCount: safeCloudUsers,
      evaluatingQuantity,
      tier: null,
      monthlyPrice: null,
      isCustomQuote: true,
      tierLabel: 'Custom Cybersecurity Plan',
      internalEstimatedCost: internalCost,
      internalEstimatedMargin: null,
    };
  }

  // Find matching tier
  const matchedTier = config.tiers.find(
    (t) => evaluatingQuantity >= t.min && evaluatingQuantity <= t.max
  );

  if (!matchedTier) {
    return {
      deviceCount: safeDevices,
      cloudUserCount: safeCloudUsers,
      evaluatingQuantity,
      tier: null,
      monthlyPrice: null,
      isCustomQuote: true,
      tierLabel: 'Custom Cybersecurity Plan',
      internalEstimatedCost: internalCost,
      internalEstimatedMargin: null,
    };
  }

  const margin = Number((matchedTier.monthlyPrice - internalCost).toFixed(2));

  return {
    deviceCount: safeDevices,
    cloudUserCount: safeCloudUsers,
    evaluatingQuantity,
    tier: matchedTier,
    monthlyPrice: matchedTier.monthlyPrice,
    isCustomQuote: false,
    tierLabel: matchedTier.label,
    internalEstimatedCost: internalCost,
    internalEstimatedMargin: margin,
  };
}

/**
 * Standard list of What's Included capabilities in Sector Seven Cyber Protection.
 * As strictly specified in document requirements (no extra inventions, no individual pricing).
 */
export const WHATS_INCLUDED_CAPABILITIES = [
  'Cloud & Endpoint Managed Detection & Response',
  '24/7 Security Operations Center (SOC) with Active Response',
  'Managed Detection & Response with EDR',
  'Cloud Identity Detection & Response',
  'Security Posture Rating',
  'Asset Inventory',
  'Supported Endpoint Security Integrations',
  'Windows Defender Management',
  'Microsoft Defender for Endpoint Management',
] as const;
