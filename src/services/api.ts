import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ph-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (name: string, email: string, password: string) =>
  api.post<{ token: string; user: { id: string; name: string; email: string } }>(
    '/auth/register',
    { name, email, password }
  );

export const loginUser = (email: string, password: string) =>
  api.post<{ token: string; user: { id: string; name: string; email: string } }>(
    '/auth/login',
    { email, password }
  );

export const fetchTrips = () => api.get<ApiTrip[]>('/trips');
export const fetchTrip  = (id: string) => api.get<ApiTrip>(`/trips/${id}`);

export const createTrip = (formData: FormData) =>
  api.post<ApiTrip>('/trips', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateTrip = (
  id: string,
  data: Partial<Pick<ApiTrip, 'place' | 'region' | 'dates' | 'summary' | 'accent' | 'tags'>>
) => api.put<ApiTrip>(`/trips/${id}`, data);

export const deleteTrip = (id: string) =>
  api.delete<{ message: string }>(`/trips/${id}`);

export const fetchProfile = () => api.get<ApiProfile>('/profile');
export const saveProfile  = (data: Partial<ApiProfile>) => api.put<ApiProfile>('/profile', data);

export const fetchPublicProfile = (username: string) =>
  api.get<PublicProfileResponse>(`/public/${username}`);

export interface ApiPhoto {
  url: string;
  caption: string;
}

export interface ApiTrip {
  id: string;
  userId: string;
  place: string;
  region: string;
  dates: string;
  summary: string;
  cover: string;
  photos: ApiPhoto[];
  accent: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiInterest {
  id: string;
  title: string;
  body: string;
}

export interface ApiProfile {
  bio: string;
  quote: string;
  gear: string[];
  interests: ApiInterest[];
}

export interface PublicProfileResponse {
  user: { id: string; name: string; username: string };
  trips: ApiTrip[];
  profile: ApiProfile;
}

export default api;
