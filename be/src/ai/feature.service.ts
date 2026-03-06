import { Injectable } from "@nestjs/common";

@Injectable()
export class FeatureService {

  extractFeatures(task, logs, comments, timeLogs, assignees) {

    const daysToDeadline =
      task.dueDate
        ? (task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        : null;

    const deadlineProximity =
      daysToDeadline === null
        ? 0
        : daysToDeadline < 2
        ? 1
        : daysToDeadline < 5
        ? 0.6
        : 0.2;

    const moveCount =
      logs.filter(l => l.action === "TASK_MOVED").length;

    const reassignCount =
      logs.filter(l => l.action === "TASK_REASSIGNED").length;

    const commentCount = comments.length;

    const totalHours =
      timeLogs.reduce((sum, l) => sum + l.hours, 0);

    return {
      deadlineProximity,
      moveCount,
      reassignCount,
      commentCount,
      totalHours,
      assigneeCount: assignees.length
    };
  }
}