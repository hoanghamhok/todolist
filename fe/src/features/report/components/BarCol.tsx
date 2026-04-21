import React from "react";

export function BarCol({ pct, name }: { pct: number; name: string }) {
  return (
    <div className="flex flex-col items-center justify-end gap-2 h-full">
      {/* Track */}
      <div className="w-full max-w-[48px] mx-auto flex-1 flex flex-col justify-end rounded-t-lg overflow-hidden"
        style={{ background: "rgba(37,99,235,0.10)" }}
      >
        {/* Fill */}
        <div
          className="w-full rounded-t-lg transition-all duration-500"
          style={{ height: `${pct}%`, background: "#2563eb" }}
        />
      </div>
      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 text-center leading-none">
        {name}
      </p>
    </div>
  );
}
