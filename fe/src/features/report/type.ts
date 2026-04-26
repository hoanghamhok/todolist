export interface ProjectStats { 
     totalTasks: number;
     completedTasks: number; 
     inProgressTasks: number; 
     overdueTasks: number; 
     completionRate: number; 
     avgCompletionTime: number; 
} 
export interface MemberPerformance {
    userId: string; 
    fullName: string; 
    avatarUrl?: string; 
    assignedTasks: number; 
    completedTasks: number; 
} 
export interface TaskCompletionTrend {
    date: string; 
    completed: number;
}
export interface RecentActivity {
    id: string;
    user: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: any;
    createdAt: string;
}

export interface RiskTask {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    riskScore: number;
    assignees: {
        user: {
            fullName: string;
            avatarUrl?: string;
        };
    }[];
}