interface IconProps {
  name: string;
  className?: string;
  size?: number;
  filled?: boolean;
}

export function Icon({
  name,
  className = "",
  size = 20,
  filled = false,
}: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
        display: "inline-flex",
        alignItems: "center",
        lineHeight: 1,
      }}
    >
      {name}
    </span>
  );
}
