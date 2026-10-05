const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers = {}, ...customOptions } = options;

  const headerObj = new Headers(headers);
  if (!headerObj.has("Content-Type") && !(customOptions.body instanceof FormData)) {
    headerObj.set("Content-Type", "application/json");
  }

  if (token) {
    headerObj.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: headerObj,
    ...customOptions,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `API error: ${res.statusText}`);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}
