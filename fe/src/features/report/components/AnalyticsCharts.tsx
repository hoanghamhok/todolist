import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CustomDot = (props: any) => {
  const { cx, cy } = props;
  return <circle cx={cx} cy={cy} r={4} fill="#004ac6" stroke="#fff" strokeWidth={2} />;
};

interface AnalyticsChartsProps {
  lineData: any[];
  pieData: any[];
  PIE_COLORS: string[];
  stats: any;
  shadow: any;
}

export function AnalyticsCharts({
  lineData,
  pieData,
  PIE_COLORS,
  stats,
  shadow
}: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Line Chart */}
      <div
        className="col-span-12 md:col-span-8 bg-white rounded-2xl p-7 border border-gray-100"
        style={shadow}
      >
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-black uppercase tracking-[0.12em] text-gray-500">
            Task Completion Trend
          </h4>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            Tasks Done
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={lineData}
            margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
          >
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#004ac6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fontWeight: 700, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fontWeight: 600, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
              itemStyle={{ color: "#004ac6" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#lineGrad)"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: "#004ac6", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div
        className="col-span-12 md:col-span-4 bg-white rounded-2xl p-7 border border-gray-100 flex flex-col"
        style={shadow}
      >
        <h4 className="text-xs font-black uppercase tracking-[0.12em] text-gray-500 text-center mb-4">
          Status Distribution
        </h4>
        <div className="flex-1 flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={56}
                outerRadius={78}
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-gray-900">
              {stats?.totalTasks ?? "—"}
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-0.5">
              Items
            </span>
          </div>
        </div>
        <div className="space-y-2 mt-3">
          {[
            {
              label: "Done",
              pct: stats
                ? Math.round((stats.completedTasks / (stats.totalTasks || 1)) * 100)
                : 52,
              color: PIE_COLORS[0],
            },
            {
              label: "In Progress",
              pct: stats
                ? Math.round((stats.inProgressTasks / (stats.totalTasks || 1)) * 100)
                : 28,
              color: PIE_COLORS[1],
            },
            {
              label: "Overdue",
              pct: stats
                ? Math.round((stats.overdueTasks / (stats.totalTasks || 1)) * 100)
                : 7,
              color: PIE_COLORS[2],
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                  style={{ background: item.color }}
                />
                <span className="text-gray-600">{item.label}</span>
              </div>
              <span className="text-gray-400">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
