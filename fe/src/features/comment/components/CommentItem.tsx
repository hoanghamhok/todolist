import dayjs from "dayjs";
import type { Comment } from "../type";
import relativeTime from "dayjs/plugin/relativeTime";

interface Props {
  comment: Comment;
  replies: Comment[];
  onReply: (id: string,username:string) => void;
  onDelete: (id: string) => void;
}

export function CommentItem({ comment, replies, onReply, onDelete }: Props) {
  dayjs.extend(relativeTime);

  function highlightMentions(text: string) {
    const parts = text.split(/(@\w+)/g);

    return parts.map((part, i) => {
      if (part.startsWith("@")) {
        return (
          <span key={i} className="text-blue-500 font-medium">
            {part}
          </span>
        );
      }

      return part;
    });
  }

  const userInitial = comment.author.fullName
    ? comment.author.fullName
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : comment.author.id.slice(0, 2).toUpperCase();

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-xs font-semibold text-white">
        {comment.author.avatarUrl ? (
          <img
            src={comment.author.avatarUrl}
            alt={`Avatar of ${comment.author.fullName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{userInitial}</span>
        )}
      </div>

      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium text-gray-700">
              {comment.author.fullName}
            </span>

            <span>{dayjs(comment.createdAt).fromNow()}</span>
          </div>

          <p className="text-sm">{highlightMentions(comment.content)}</p>
        </div>

        <div className="flex gap-3 text-xs mt-1 text-gray-500">
          <button onClick={() => onReply(comment.id,comment.author.fullName)}>Reply</button>
          <button onClick={() => onDelete(comment.id)}>Delete</button>
        </div>

        {replies.length > 0 && (
          <div className="ml-6 mt-3 space-y-3 border-l pl-3">
            {replies.map(r => (
              <CommentItem
                key={r.id}
                comment={r}
                replies={[]}
                onReply={onReply}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}