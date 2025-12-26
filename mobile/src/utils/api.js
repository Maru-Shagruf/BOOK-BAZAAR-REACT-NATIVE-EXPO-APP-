import { API_BASE_URL } from './config';

async function request(path, options = {}, user) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (user?.id) {
    headers['x-user-id'] = user.id;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export function apiGet(path, user) {
  return request(path, { method: 'GET' }, user);
}

export function apiPost(path, body, user) {
  return request(
    path,
    {
      method: 'POST',
      body: JSON.stringify(body)
    },
    user
  );
}

export function apiPatch(path, body, user) {
  return request(
    path,
    {
      method: 'PATCH',
      body: JSON.stringify(body)
    },
    user
  );
}

export function apiDelete(path, user) {
  return request(path, { method: 'DELETE' }, user);
}
