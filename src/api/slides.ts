import client from './client';
import type { FinalSlide, PaginatedResponse } from '../types/ims';

export interface SlideFilters {
  user_id?: number;
  internship_id?: number;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface SlidePayload {
  internship_id?: number;
  title: string;
  description?: string | null;
  presentation_date?: string | null;
  slide_link?: string | null;
}

export interface ReviewPayload {
  status: string;
  feedback?: string | null;
}

export const getSlides = (filters?: SlideFilters) =>
  client.get<PaginatedResponse<FinalSlide>>('/final-slides', { params: filters }).then((r) => r.data);

export const getSlide = (id: number) =>
  client.get<{ data: FinalSlide }>(`/final-slides/${id}`).then((r) => r.data.data);

export const createSlide = (payload: SlidePayload) =>
  client.post<{ data: FinalSlide }>('/final-slides', payload).then((r) => r.data.data);

export const updateSlide = (id: number, payload: Partial<SlidePayload>) =>
  client.put<{ data: FinalSlide }>(`/final-slides/${id}`, payload).then((r) => r.data.data);

export const deleteSlide = (id: number) =>
  client.delete(`/final-slides/${id}`).then((r) => r.data);

export const submitSlide = (id: number) =>
  client.patch<{ data: FinalSlide }>(`/final-slides/${id}/submit`).then((r) => r.data.data);

export const reviewSlide = (id: number, payload: ReviewPayload) =>
  client.patch<{ data: FinalSlide }>(`/final-slides/${id}/review`, payload).then((r) => r.data.data);

export const uploadSlideFile = (id: number, uri: string, name: string) => {
  const formData = new FormData();
  formData.append('file', { uri, name, type: 'application/octet-stream' } as any);
  return client
    .post<{ data: FinalSlide }>(`/final-slides/${id}/upload`, formData)
    .then((r) => r.data.data);
};
