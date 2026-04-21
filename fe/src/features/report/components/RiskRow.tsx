import React from "react";
import { Icon } from "./Icon";

export interface RiskRowProps {
  taskName: string;
  category: string;
  assigneeImg: string;
  assigneeName: string;
  deadline: string;
  deadlineSub: string;
  deadlineColor: string;
  deadlineSubColor: string;
  statusLabel: string;
  statusBg: string;
  statusColor: string;
}

const shadow = {
  boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
} as const;

export function RiskRow({
  taskName, category, assigneeImg, assigneeName,
  deadline, deadlineSub, deadlineColor, deadlineSubColor,
  statusLabel, statusBg, statusColor,
}: RiskRowProps) {
  return (
    <tr className="hover:bg-gray-50/60 transition-colors group border-t border-gray-100">
      <td className="px-6 py-5">
        <div className="font-bold text-sm text-gray-900">{taskName}</div>
        <div className="text-xs text-gray-400 mt-0.5">{category}</div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <img
            src={assigneeImg}
            className="w-8 h-8 rounded-full object-cover border-2 border-white flex-shrink-0"
            style={shadow}
            alt={assigneeName}
          />
          <span className="text-sm font-semibold text-gray-700">{assigneeName}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className={`text-sm font-bold ${deadlineColor}`}>{deadline}</div>
        <div className={`text-[10px] font-bold uppercase tracking-wide mt-0.5 ${deadlineSubColor}`}>
          {deadlineSub}
        </div>
      </td>
      <td className="px-6 py-5">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${statusBg} ${statusColor}`}>
          {statusLabel}
        </span>
      </td>
      <td className="px-6 py-5 text-right">
        <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-gray-100">
          <Icon name="more_horiz" className="text-gray-400" size={20} />
        </button>
      </td>
    </tr>
  );
}
