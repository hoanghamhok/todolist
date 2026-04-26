import { Icon } from "./Icon";

export interface StatCardProps {
  iconName: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeClass: string;
  label: string;
  value: number | string;
  valueClass?: string;
  subIcon: string;
  subText: string;
  subClass: string;
}

const shadow = {
  boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
} as const;

export function StatCard({
  iconName, iconBg, iconColor, badge, badgeClass,
  label, value, valueClass = "text-gray-900",
  subIcon, subText, subClass,
}: StatCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-6 flex flex-col border border-gray-100"
      style={shadow}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon name={iconName} className={iconColor} size={20} filled />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${badgeClass}`}>
          {badge}
        </span>
      </div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-4xl font-black leading-none mt-1 ${valueClass}`}>{value}</p>
      <div className={`mt-4 flex items-center gap-1 text-xs font-bold ${subClass}`}>
        <Icon name={subIcon} size={14} />
        <span>{subText}</span>
      </div>
    </div>
  );
}
