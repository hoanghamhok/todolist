import React from "react";
import type { Activity } from "./type";

export const formatTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 60) return `${minutes} MINUTES AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} HOURS AGO`;

  const days = Math.floor(hours / 24);
  return `${days} DAYS AGO`;
};

export const highlightMentions = (text: string): React.ReactNode[] => {
  const parts = text.split(/(@\w+)/g);

  return parts.map((part: string, i: number) =>
    part.startsWith("@") ? (
      <span key={i} className="text-indigo-600 font-medium">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};


export const mapActivity = (item: any): Activity | undefined => {
  const metadata = item.metadata || {};

  switch (item.action) {
    case "TASK_CREATED":
      return {
        id: item.id,
        type: "task_moved",
        user: {
          name: item.user?.fullName,
          avatar: item.user?.avatarUrl,
        },
        action: "created task",
        target: {
          name: metadata.title,
          link: `/tasks/${item.entityId}`,
        },
        project: {
          name: item.project?.name,
        },
        details: {
          taskStatus: "Created",
        },
        timestamp: formatTime(item.createdAt),
      };

    case "COMMENT_CREATED":
      return {
        id: item.id,
        type: "comment",
        user: {
          name: item.user?.fullName,
          avatar: item.user?.avatarUrl,
        },
        action: "commented on",
        target: {
          name: "Task",
          link: `/tasks/${metadata.taskId}`,
        },
        project: {
          name: item.project?.name,
        },
        details: {
          comment: metadata.content,
        },
        timestamp: formatTime(item.createdAt),
      };

    case "TASK_MOVED":
      return {
        id: item.id,
        type: "task_moved",
        user: {
          name: item.user?.fullName,
          avatar: item.user?.avatarUrl,
        },
        action: "moved",
        target: {
          name: metadata.taskTitle,
          link: `/tasks/${item.entityId}`,
        },
        project: {
          name: item.project?.name,
        },
        details: {
          taskStatus: metadata.toColumnTitle,
        },
        timestamp: formatTime(item.createdAt),
      };

    case "TASK_COMPLETED":
      return {
        id: item.id,
        type: "task_completed",
        user: {
          name: item.user?.fullName,
          avatar: item.user?.avatarUrl,
        },
        action: "completed",
        target: {
          name: metadata.taskTitle,
          link: `/tasks/${item.entityId}`,
        },
        project: {
          name: item.project?.name,
        },
        details: {
          taskStatus: "Completed",
        },
        timestamp: formatTime(item.createdAt),
      };
  }
};