import { useQuery } from '@tanstack/react-query';
import { tasksAPI } from '../tasks.api';

export const useRiskScore = (taskId: string) => {
  return useQuery({
    queryKey: ['riskScore', taskId],
    queryFn: async () => {
      const res = await tasksAPI.getRiskScore(taskId);
      return res.data.riskScore;
    },
    enabled: !!taskId,
    staleTime: 30 * 1000, // 30 giây không cần refetch lại nếu data vẫn fresh
  });
};