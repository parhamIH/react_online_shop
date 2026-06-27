const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const JSON_ACCEPT = 'application/json';
const JSON_CONTENT_TYPE = 'application/json';

function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * HTTP client with JSON content negotiation (Accept / Content-Type).
 */
export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, headers = {}, auth = false, ...rest } = options;

  const requestHeaders = {
    Accept: JSON_ACCEPT,
    ...headers,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = JSON_CONTENT_TYPE;
  }

  if (auth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders.Authorization = `Token ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: requestHeaders,
    credentials: 'include',
    body: body !== undefined && !(body instanceof FormData) ? JSON.stringify(body) : body,
    ...rest,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes(JSON_ACCEPT);
  const data = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message = data?.detail || data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export function unwrapPaginated(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  return [];
}
