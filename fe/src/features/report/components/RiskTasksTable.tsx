import { RiskRow } from "./RiskRow";
import type { RiskRowProps } from "./RiskRow";

interface RiskTasksTableProps {
  riskRows: RiskRowProps[];
  shadow: any;
}

export function RiskTasksTable({ riskRows, shadow }: RiskTasksTableProps) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      style={shadow}
    >
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h4 className="text-xs font-black uppercase tracking-[0.12em] text-gray-500">
          At-Risk Tasks
        </h4>
        <span className="px-2.5 py-1 bg-red-100 text-red-600 text-[10px] font-black rounded-lg uppercase tracking-wide">
          Needs Review
        </span>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/70">
            {["Task Name", "Assignee", "Deadline", "Status", ""].map(
              (h, i) => (
                <th
                  key={i}
                  className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {riskRows.map((row, i) => (
            <RiskRow key={i} {...row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
