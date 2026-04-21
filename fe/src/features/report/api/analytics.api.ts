import api from "../../../api/client";

// Project stats
export const fetchProjectStats = (projectId: string) =>
  api.get(`/analytics/projects/${projectId}/stats`);

// Member performance
export const fetchMemberPerformance = (projectId: string) =>
  api.get(`/analytics/projects/${projectId}/member-performance`);

// Task completion trend
export const fetchTaskCompletionTrend = (projectId: string,days: number = 30) =>
  api.get(`/analytics/projects/${projectId}/trend`, {params: { days }});

// Recent activity
export const fetchRecentActivity = (projectId: string,limit: number = 10) =>
  api.get(`/analytics/projects/${projectId}/activity`, {params: { limit }});