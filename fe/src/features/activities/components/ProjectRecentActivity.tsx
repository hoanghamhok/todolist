import { Link } from "react-router-dom";
import { useProjectActivities } from "../hooks/useProjectActivities";
import type { Activity } from "../type";
import { mapActivity, highlightMentions } from "../utils";

// ── Dot colour per activity type ─────────────────────────────────────────────
const DOT_CONFIG: Record<string, { bg: string; icon: string }> = {
  comment:        { bg: "bg-blue-400",   icon: "chat_bubble" },
  task_completed: { bg: "bg-emerald-500", icon: "check_circle" },
  task_moved:     { bg: "bg-amber-500",  icon: "swap_horiz" },
  member_added:   { bg: "bg-blue-600",   icon: "person_add" },
  default:        { bg: "bg-gray-400",   icon: "circle" },
};

function dot(type: string) {
  return DOT_CONFIG[type] ?? DOT_CONFIG.default;
}

// ── Single feed item ──────────────────────────────────────────────────────────
interface FeedItemProps {
  activity: Activity;
}

function FeedItem({ activity }: FeedItemProps) {
  const { bg, icon } = dot(activity.type);

  return (
    <div className="relative pl-9">
      {/* Coloured dot */}
      <div
        className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${bg}`}
        style={{ flexShrink: 0 }}
      >
        {activity.user.avatar ? (
          <img
            src={activity.user.avatar}
            className="w-full h-full rounded-full object-cover"
            alt={activity.user.name}
          />
        ) : (
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="space-y-1">
        {/* Action line */}
        <p className="text-xs text-gray-800 leading-snug flex gap-1 flex-wrap">
          <span className="font-bold">{activity.user.name}</span>
          <span className="text-gray-500">{activity.action}</span>
          <Link
            to={activity.target.link}
            className="font-bold text-blue-600 hover:underline"
          >
            {activity.target.name}
          </Link>
        </p>

        {/* Comment quote */}
        {activity.type === "comment" && activity.details?.comment && (
          <p className="text-[11px] text-gray-500 italic bg-gray-50 border-l-2 border-blue-500 rounded-r-lg px-2 py-1.5 mt-1">
            "{highlightMentions(activity.details.comment)}"
          </p>
        )}

        {/* Status badge */}
        {activity.type === "task_moved" && activity.details?.taskStatus && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">
            → {activity.details.taskStatus}
          </span>
        )}

        {activity.type === "task_completed" && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
            Completed
          </span>
        )}

        {/* Timestamp */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">
          {activity.timestamp}
        </p>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function ProjectRecentActivity({ projectId }: { projectId: string }) {
  const { data: rawActivities = [], isLoading } = useProjectActivities(projectId);

  const activities: Activity[] = rawActivities
    .map(mapActivity)
    .filter(Boolean) as Activity[];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xs font-black uppercase tracking-[0.12em] text-gray-500">
          Recent Activity
        </h4>
        <button className="text-blue-500 hover:text-blue-600 transition-colors">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 18 }}
          >
            history
          </span>
        </button>
      </div>

      {/* Timeline */}
      <div className="relative space-y-6 flex-1">
        {/* Vertical line */}
        <div className="absolute left-3 top-1 bottom-1 w-px bg-gray-100" />

        {isLoading && (
          <div className="pl-9 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && activities.length === 0 && (
          <p className="pl-9 text-xs text-gray-400">No recent activity.</p>
        )}

        {activities.slice(0, 5).map((activity) => (
          <FeedItem key={activity.id} activity={activity} />
        ))}
      </div>

      {/* Footer button */}
      <button className="w-full mt-6 py-3 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-[0.12em] text-gray-400 hover:bg-gray-50 transition-colors">
        View All Activity
      </button>
    </>
  );
}