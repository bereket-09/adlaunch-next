// API Configuration
// Update this file when your backend host changes

export const API_CONFIG = {
  // Base URL for the proxy
  BASE_URL: '', // Use relative path for proxy

  // API version prefix (already included in backend URL in proxy)
  API_VERSION: '/api/proxy',

  // Full API base URL
  get API_BASE() {
    return `${this.API_VERSION}`;
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Video/Watch endpoints
  VIDEO: {
    GET: (token: string) => `${API_CONFIG.API_BASE}/video/${token}`,
  },

  // Track endpoints (for video watching)
  TRACK: {
    START: `${API_CONFIG.API_BASE}/track/start`,
    COMPLETE: `${API_CONFIG.API_BASE}/track/complete`,
  },

  // Ad management endpoints
  AD: {
    LIST: `${API_CONFIG.API_BASE}/ad/list`,
    CREATE: `${API_CONFIG.API_BASE}/ad/create`,
    APPROVE: `${API_CONFIG.API_BASE}/ad/approve`,
    UPDATE: (adId: string) => `${API_CONFIG.API_BASE}/ad/${adId}`,
    VIDEO: (adId: string) => `${API_CONFIG.API_BASE}/ad/video/${adId}`,
    ListByMarketer: (marketerId: string) => `${API_CONFIG.API_BASE}/ad/marketer/${marketerId}`,
  },

  // Marketer endpoints
  MARKETER: {
    LIST: `${API_CONFIG.API_BASE}/marketer`,
    CREATE: `${API_CONFIG.API_BASE}/marketer/create`,
    GET: (id: string) => `${API_CONFIG.API_BASE}/marketer/${id}`,
    UPDATE: (id: string) => `${API_CONFIG.API_BASE}/marketer/${id}`,
    LOGIN: `${API_CONFIG.API_BASE}/auth/marketer/login`,
    REGISTER: `${API_CONFIG.API_BASE}/auth/marketer/register`,
    UPDATE_PASSWORD: `${API_CONFIG.API_BASE}/marketer/update-password`,
    KYC: (id: string) => `${API_CONFIG.API_BASE}/marketer/${id}/kyc`,
  },

  // Admin Auth endpoints
  ADMIN: {
    LOGIN: `${API_CONFIG.API_BASE}/auth/admin/login`,
    ME: `${API_CONFIG.API_BASE}/auth/admin/me`,
  },

  // Budget endpoints
  BUDGET: {
    TOPUP: `${API_CONFIG.API_BASE}/budget/topup`,
    DEDUCT: `${API_CONFIG.API_BASE}/budget/deduct`,
    TRANSACTIONS: (marketerId: string) => `${API_CONFIG.API_BASE}/budget/${marketerId}/transactions`,
  },

  // Analytics endpoints
  ANALYTICS: {
    ADS: `${API_CONFIG.API_BASE}/analytics/ads`,
    MARKETERS: `${API_CONFIG.API_BASE}/analytics/marketers`,
    AUDITS: `${API_CONFIG.API_BASE}/analytics/audits`,
    WATCH_LINKS: `${API_CONFIG.API_BASE}/analytics/watch-links`,
    AD_DETAIL: (adId: string) => `${API_CONFIG.API_BASE}/analytics/ad/${adId}/detail`,
    AD_USERS: (adId: string) => `${API_CONFIG.API_BASE}/analytics/ad/${adId}/users`,
    USER_DETAIL: (msisdn: string) => `${API_CONFIG.API_BASE}/analytics/user/${msisdn}/detail`,
    Marketer_DETAIL: (marketerId: string) => `${API_CONFIG.API_BASE}/analytics/marketer/${marketerId}/analytics`,
    MarketerReports: (marketerId: string) => `${API_CONFIG.API_BASE}/analytics/marketer/reports/${marketerId}`,
    ADMIN_DASHBOARD: `${API_CONFIG.API_BASE}/analytics/admin/dashboard`,
    ADMIN_ANALYTICS: `${API_CONFIG.API_BASE}/analytics/admin/analysis`,
    ADMIN_FRAUD: `${API_CONFIG.API_BASE}/analytics/admin/fraud`,
    ADMIN_BUDGET: `${API_CONFIG.API_BASE}/analytics/admin/budget`

  },

  SUBSCRIBER: {
    // Fetch video info for a given token
    GETVIDEOID: (token: string) => `${API_CONFIG.API_BASE}/video/${token}`,

    // Track ad start
    STARTWATCH: `${API_CONFIG.API_BASE}/track/start`,

    // Track ad complete
    COMPLETEWATCH: `${API_CONFIG.API_BASE}/track/complete`,
  },

  // Blacklist Management
  BLACKLIST: {
    LIST: `${API_CONFIG.API_BASE}/blacklist`,
    ADD: `${API_CONFIG.API_BASE}/blacklist`,
    BULK_ADD: `${API_CONFIG.API_BASE}/blacklist/bulk`,
    STATS: `${API_CONFIG.API_BASE}/blacklist/stats`,
    UPDATE: (id: string) => `${API_CONFIG.API_BASE}/blacklist/${id}`,
    REMOVE: (id: string) => `${API_CONFIG.API_BASE}/blacklist/${id}`,
    PERMANENT_DELETE: (id: string) => `${API_CONFIG.API_BASE}/blacklist/${id}/permanent`,
  },

  // System Config endpoints
  SYSTEM_CONFIG: {
    LIST: `${API_CONFIG.API_BASE}/system-config`,
    UPDATE: `${API_CONFIG.API_BASE}/system-config/update`,
    MAINTENANCE_STATUS: `${API_CONFIG.API_BASE}/maintenance-status`,
  },

  // Billing Model endpoints
  BILLING_MODEL: {
    LIST: `${API_CONFIG.API_BASE}/billing-models/list`,
    CREATE: `${API_CONFIG.API_BASE}/billing-models/create`,
    UPDATE: (id: string) => `${API_CONFIG.API_BASE}/billing-models/${id}`,
    DELETE: (id: string) => `${API_CONFIG.API_BASE}/billing-models/${id}`,
  },

  // System Health
  HEALTH: `${API_CONFIG.API_BASE}/health`,
};

export default API_CONFIG;
