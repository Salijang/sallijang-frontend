export function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, { ...options, credentials: 'include' });
}
