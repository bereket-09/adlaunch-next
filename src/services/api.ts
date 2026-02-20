// API Service Layer
import { API_ENDPOINTS } from '@/config/api';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  // Only set Content-Type to JSON if body is NOT FormData
  if (!(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Try parsing JSON safely
  let data: any;
  try {
    console.log("🚀 ~ fetchAPI ~ response:", response)
    data = await response.json();
    console.log("🚀 ~ fetchAPI ~ data:", data)
  } catch (err) {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || 'API request failed');
  }

  return data;
}


/**
 * Fetch wrapper for media (video, audio, images, etc.)
 * Returns a Blob
 */
// Fetch media (video, audio, images, etc.) as Blob
export async function fetchMedia(url: string, options: RequestInit = {}): Promise<Blob> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.statusText}`);
  }

  const blob = await response.blob();
  return blob;
}



// ============ Video/Watch API ============

export interface VideoResponse {
  status: boolean;
  ad_id: string;
  video_url: string;
  token: string;
  secure_key: string;
}

export interface TrackStartResponse {
  status: boolean;
  watch_status: string;
  fraud_flags: string[];
  secure_key: string;
}

export interface TrackCompleteResponse {
  status: boolean;
  watch_status: string;
  fraud_flags: string[];
  reward: string;
  reward_offer_id: string;
  reward_record_id: string;
}

export const videoAPI = {
  getVideo: (token: string, metaBase64: string): Promise<VideoResponse> =>
    fetchAPI(API_ENDPOINTS.VIDEO.GET(token), {
      method: 'GET',
      headers: {
        meta_base64: metaBase64,
      },
    }),

  trackStart: (token: string, meta: string, secureKey: string): Promise<TrackStartResponse> =>
    fetchAPI(API_ENDPOINTS.TRACK.START, {
      method: 'POST',
      body: JSON.stringify({ token, meta, secure_key: secureKey }),
    }),

  trackComplete: (token: string, meta: string, secureKey: string): Promise<TrackCompleteResponse> =>
    fetchAPI(API_ENDPOINTS.TRACK.COMPLETE, {
      method: 'POST',
      body: JSON.stringify({ token, meta, secure_key: secureKey }),
    }),
};

// ============ Ad Management API ============

export interface Ad {
  [key: string]: any;
}


export interface AdListResponse {
  status: boolean;
  ads: Ad[];
}

// export interface AdCreateRequest {
//   marketer_id: string;
//   campaign_name: string;
//   title: string;
//   cost_per_view: number;
//   budget_allocation: number;
//   video_description?: string;
//   video_file_path: string;
//   start_date: string;
//   end_date: string;
// }

export interface AdCreateRequest {
  marketer_id: string;
  campaign_name: string;
  title: string;
  cost_per_view: number;
  budget_allocation: number;
  video_description?: string;
  video_file?: File; // <-- actual File object for upload
  start_date: string;
  end_date: string;
}

export interface AdUpdateRequest {
  campaign_name?: string;
  title?: string;
  cost_per_view?: number;
  budget_allocation?: number;
  video_description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

// export interface AdUpdateRequest {
//   title?: string;
//   campaign_name?: string;
//   cost_per_view?: number;
//   budget_allocation?: number;
//   description?: string;
//   video_file_path?: string;
//   start_date?: string;
//   end_date?: string;
//   status?: string;
// }
export const adAPI = {
  list: (): Promise<AdListResponse> =>
    fetchAPI(API_ENDPOINTS.AD.LIST),


  listByMarketer: (marketerId: any): Promise<any> =>
    fetchAPI(API_ENDPOINTS.AD.ListByMarketer(marketerId), {
      method: 'GET'
    }),

  create: async (data: AdCreateRequest): Promise<{ status: boolean; ad: Ad; error?: string }> => {
    const formData = new FormData();

    // Append all fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== "video_file") {
        formData.append(key, String(value));
      }
    });

    // Append the video file
    if (data.video_file) {
      formData.append("video", data.video_file, data.video_file.name);
    }

    return fetchAPI(API_ENDPOINTS.AD.CREATE, {
      method: 'POST',
      body: formData, // Multer expects FormData
    });
  },

  approve: (adId: string): Promise<{ status: boolean; ad: Ad }> =>
    fetchAPI(API_ENDPOINTS.AD.APPROVE, {
      method: 'POST',
      body: JSON.stringify({ ad_id: adId }),
    }),

  update: (adId: string, data: AdUpdateRequest): Promise<{ status: boolean; message: string }> =>
    fetchAPI(API_ENDPOINTS.AD.UPDATE(adId), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getVideo: (adID: any): Promise<any> =>
    fetchMedia(API_ENDPOINTS.AD.VIDEO(adID), {
      method: 'GET'
    })
};



// ============ Marketer API ============

export interface Marketer {
  _id: string;
  name: string;
  email: string;
  total_budget: number;
  remaining_budget: number;
  contact_info: string;
  status: 'active' | 'inactive' | 'pendingPassChange';
  created_at: string;
  total_ads?: number;
  total_remaining_budget?: number;
  total_cost_per_view?: number;
}

export interface MarketerCreateRequest {
  name: string;
  email: string;
  password: string;
  total_budget: number;
  contact_info: string;
  status?: string;
}

export interface MarketerUpdateRequest {
  name?: string;
  email?: string;
  total_budget?: number;
  contact_info?: string;
  status?: string;
}

export const marketerAPI = {
  list: (): Promise<{ status: boolean; marketers: Marketer[] }> =>
    fetchAPI(API_ENDPOINTS.MARKETER.LIST),

  get: (id: string): Promise<{ status: boolean; marketer: Marketer }> =>
    fetchAPI(API_ENDPOINTS.MARKETER.GET(id)),

  create: (data: MarketerCreateRequest): Promise<{ status: boolean; marketer: Marketer }> =>
    fetchAPI(API_ENDPOINTS.MARKETER.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: MarketerUpdateRequest): Promise<{ status: boolean; message: string }> =>
    fetchAPI(API_ENDPOINTS.MARKETER.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ============ Budget API ============

export interface Transaction {
  _id: string;
  marketer_id: string;
  type: 'topup' | 'deduction';
  amount: number;
  previous_budget: number;
  new_budget: number;
  payment_method?: string;
  reason?: string;
  description?: string;
  created_at: string;
}

export interface TopupRequest {
  marketerId: string;
  amount: number;
  payment_method: string;
  description?: string;
}

export interface DeductRequest {
  marketerId: string;
  amount: number;
  reason: string;
  description?: string;
}

export const budgetAPI = {
  topup: (data: TopupRequest): Promise<{ status: boolean; message: string; marketer: Marketer; transaction: Transaction }> =>
    fetchAPI(API_ENDPOINTS.BUDGET.TOPUP, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deduct: (data: DeductRequest): Promise<{ status: boolean; message: string; marketer: Marketer; transaction: Transaction }> =>
    fetchAPI(API_ENDPOINTS.BUDGET.DEDUCT, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getTransactions: (marketerId: string): Promise<{ status: boolean; transactions: Transaction[] }> =>
    fetchAPI(API_ENDPOINTS.BUDGET.TRANSACTIONS(marketerId)),
};

// ============ Analytics API ============

export interface AdAnalytics {
  _id: string;
  marketer_id: string;
  campaign_name: string;
  title: string;
  cost_per_view: number;
  budget_allocation: number;
  remaining_budget: number;
  video_file_path: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  total_views: number;
  completed_views: number;
  completion_rate: number;
}

export interface AdDetailAnalytics {
  [key: string]: any;
}

export interface MarketerDashoboardAnalytics {
  [key: string]: any;
}
//   status: boolean;
//   ad_id: string;
//   total_views: number;
//   opened_views: number;
//   completed_views: number;
//   pending_views: number;
//   completion_rate: number;
// }

export interface AdUser {
  msisdn: string;
  status: string;
  opened_at?: string;
  started_at?: string;
  completed_at?: string;
  device_info?: {
    model: string;
    brand: string;
  };
  ip?: string;
  location?: {
    lat: number;
    lon: number;
    category: string;
  };
}

export interface WatchLink {
  _id: string;
  token: string;
  msisdn: string;
  ad_id: string;
  marketer_id: string;
  status: string;
  created_at: string;
  expires_at: string;
  fraud_flags: string[];
  device_info?: {
    model: string;
    brand: string;
  };
  ip?: string;
  location?: {
    lat: number;
    lon: number;
    category: string;
  };
  meta_json?: Record<string, any>;
  opened_at?: string;
  started_at?: string;
  completed_at?: string;
  user_agent?: string;
  secure_key?: string;
}

export interface AuditLog {
  _id: string;
  type: string;
  msisdn: string;
  token: string;
  ad_id: string;
  marketer_id: string;
  timestamp: string;
  ip?: string;
  user_agent?: string;
  device_info?: {
    model: string;
    brand: string;
  };
  location?: {
    lat: number;
    lon: number;
    category: string;
  };
  request_payload?: any;
  fraud_detected: boolean;
}

export interface UserAnalytics {
  status: boolean;
  msisdn: string;
  total_ads_watched: number;
  total_rewards: number;
  ads: {
    ad_id: string;
    status: string;
    completed_at?: string;
    reward_granted: boolean;
  }[];
  audit_logs: AuditLog[];
}

export interface MarketerAnalytics extends Marketer {
  total_ads: number;
  total_remaining_budget: number;
  total_cost_per_view: number;
}


export const analyticsAPI = {
  getAds: (): Promise<{ status: boolean; ads: AdAnalytics[] }> =>
    fetchAPI(API_ENDPOINTS.ANALYTICS.ADS),

  getMarketers: (): Promise<{ status: boolean; marketers: MarketerAnalytics[] }> =>
    fetchAPI(API_ENDPOINTS.ANALYTICS.MARKETERS),

  getMarketerAnalysis: (marketerId: string): Promise<MarketerDashoboardAnalytics> =>
    fetchAPI(API_ENDPOINTS.ANALYTICS.Marketer_DETAIL(marketerId)),

  getAudits: (): Promise<{ status: boolean; audits: AuditLog[] }> =>
    fetchAPI(API_ENDPOINTS.ANALYTICS.AUDITS),

  getWatchLinks: (): Promise<{ status: boolean; watch_links: WatchLink[] }> =>
    fetchAPI(API_ENDPOINTS.ANALYTICS.WATCH_LINKS),

  getAdDetail: (adId: string): Promise<AdDetailAnalytics> =>
    fetchAPI(API_ENDPOINTS.ANALYTICS.AD_DETAIL(adId)),

  getAdUsers: (adId: string): Promise<{ status: boolean; ad_id: string; users: AdUser[] }> =>
    fetchAPI(API_ENDPOINTS.ANALYTICS.AD_USERS(adId)),

  getUserDetail: (msisdn: string): Promise<UserAnalytics> =>
    fetchAPI(API_ENDPOINTS.ANALYTICS.USER_DETAIL(msisdn)),
};
