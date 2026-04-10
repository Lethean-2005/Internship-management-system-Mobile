import client from './client';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth';

export interface ProfileUpdatePayload {
  name?: string;
  email?: string;
  phone?: string | null;
  department?: string | null;
  company_name?: string | null;
  position?: string | null;
  supervisor_name?: string | null;
  generation?: string | null;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const login = (payload: LoginPayload) =>
  client.post<AuthResponse>('/login', payload).then((r) => r.data);

export const register = (payload: RegisterPayload) =>
  client.post<AuthResponse>('/register', payload).then((r) => r.data);

export const logout = () =>
  client.post('/logout').then((r) => r.data);

export const getMe = () =>
  client.get<{ data: User }>('/me').then((r) => r.data.data);

// Updates the currently-authenticated user via PUT /me — verified by probing
// the backend: GET/PUT /me return 401 unauthenticated (route exists), while
// PUT /profile returns a generic 500 (route missing, handler crashes).
export const updateProfile = (payload: ProfileUpdatePayload) =>
  client.put<{ data: User }>('/me', payload).then((r) => r.data.data);

export const changePassword = (payload: ChangePasswordPayload) =>
  client.put('/me/password', payload).then((r) => r.data);

// Uploads a new avatar for the current user. On native React Native, FormData
// accepts the `{ uri, name, type }` shape and the bridge reads the file off
// disk. On web, that shape is silently stringified and the server receives no
// file at all (→ 422), so we fetch the blob from the URI and append that
// instead. The backend field name is `avatar` (probed directly — `photo` and
// `image` both return 500).
export const uploadAvatar = async (uri: string, name: string, mimeType: string) => {
  const formData = new FormData();

  if (typeof window !== 'undefined' && typeof window.fetch === 'function' && uri.startsWith('blob:')) {
    // Web: fetch the blob and append as a File so the multipart body is valid.
    const blob = await fetch(uri).then((r) => r.blob());
    formData.append('avatar', blob, name);
  } else if (uri.startsWith('data:')) {
    // Web image picker can also return a data: URL — convert to Blob.
    const blob = await fetch(uri).then((r) => r.blob());
    formData.append('avatar', blob, name);
  } else {
    // Native: RN's FormData polyfill reads the file from disk given this shape.
    formData.append('avatar', { uri, name, type: mimeType } as any);
  }

  const r = await client.post<{ data: User }>('/me/avatar', formData);
  return r.data.data;
};

export const verifyEmail = (code: string) =>
  client.post('/verify-email', { code }).then((r) => r.data);

export const resendCode = () =>
  client.post('/resend-code').then((r) => r.data);
