import client from './client';
import type { FinalReport, PaginatedResponse } from '../types/ims';

export interface ReportFilters {
  user_id?: number;
  internship_id?: number;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface ReportPayload {
  internship_id: number;
  title: string;
  content?: string | null;
}

export interface ReviewPayload {
  status: string;
  feedback?: string | null;
  grade?: string | null;
}

export const getReports = (filters?: ReportFilters) =>
  client.get<PaginatedResponse<FinalReport>>('/final-reports', { params: filters }).then((r) => r.data);

export const getReport = (id: number) =>
  client.get<{ data: FinalReport }>(`/final-reports/${id}`).then((r) => r.data.data);

export const createReport = (payload: ReportPayload) =>
  client.post<{ data: FinalReport }>('/final-reports', payload).then((r) => r.data.data);

export const updateReport = (id: number, payload: Partial<ReportPayload>) =>
  client.put<{ data: FinalReport }>(`/final-reports/${id}`, payload).then((r) => r.data.data);

export const deleteReport = (id: number) =>
  client.delete(`/final-reports/${id}`).then((r) => r.data);

export const submitReport = (id: number) =>
  client.patch<{ data: FinalReport }>(`/final-reports/${id}/submit`).then((r) => r.data.data);

export const reviewReport = (id: number, payload: ReviewPayload) =>
  client.patch<{ data: FinalReport }>(`/final-reports/${id}/review`, payload).then((r) => r.data.data);

export const uploadReportFile = (id: number, uri: string, name: string) => {
  const formData = new FormData();
  formData.append('file', { uri, name, type: 'application/octet-stream' } as any);
  return client
    .post<{ data: FinalReport }>(`/final-reports/${id}/upload`, formData)
    .then((r) => r.data.data);
};
