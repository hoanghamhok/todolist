import React from "react";
import { BarCol } from "./BarCol";

interface TeamPerformanceProps {
  barData: any[];
  maxBar: number;
  shadow: any;
}

export function TeamPerformance({ barData, maxBar, shadow }: TeamPerformanceProps) {
  return (
    <div
      className="bg-white rounded-2xl p-7 border border-gray-100"
      style={shadow}
    >
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xs font-black uppercase tracking-[0.12em] text-gray-500">
          Team Performance
        </h4>
      </div>

      <div
        className="w-full"
        style={{ height: 160 }}
      >
        <div
          className="h-full"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${barData.length}, 1fr)`,
            gap: "20px",
            alignItems: "end",
          }}
        >
          {barData.map((b, i) => {
            const pct = Math.round((b.completedTasks / maxBar) * 100);
            const firstName = b.fullName.split(" ")[0];
            const lastName = b.fullName.split(" ")[1];
            const label = lastName
              ? `${firstName} ${lastName[0]}.`
              : firstName;
            return (
              <BarCol key={i} pct={pct} name={label} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
