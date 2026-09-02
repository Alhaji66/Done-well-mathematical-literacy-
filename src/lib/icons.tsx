import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export function IconFinance(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.5 9.5c0-1.1 1.1-2 2.5-2s2.5.9 2.5 2c0 2.5-5 1.8-5 4.2 0 1.1 1.1 2 2.5 2s2.5-.9 2.5-2" />
    </svg>
  );
}

export function IconData(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}

export function IconMaps(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 4l-6 2.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4z" />
      <path d="M9 4v14M15 6.5V20" />
    </svg>
  );
}

export function IconMeasurement(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="9" width="18" height="6" rx="1" />
      <path d="M7 9v3M11 9v3M15 9v3M19 9v3" />
    </svg>
  );
}

export function IconProbability(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
      <circle cx="7.5" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTariffs(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 21V10l8-6 8 6v11" />
      <path d="M9 21v-6h6v6M4 10h16" />
    </svg>
  );
}

export function IconProfit(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 17l5-5 4 4 8-9" />
      <path d="M15 7h5v5" />
    </svg>
  );
}

export const topicIconMap = {
  finance: IconFinance,
  data: IconData,
  maps: IconMaps,
  measurement: IconMeasurement,
  probability: IconProbability,
  tariffs: IconTariffs,
  profit: IconProfit,
} as const;

export function IconLearner(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" />
      <path d="M6.5 9.7V15c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3V9.7" />
    </svg>
  );
}

export function IconParent(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M3.5 20c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2M14.7 20c0-2-1.2-3.7-3-4.5" />
    </svg>
  );
}

export function IconTeacher(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M7 20h10M9 16v4M15 16v4" />
    </svg>
  );
}

export function IconSchool(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 10.5L12 5l9 5.5-9 5.5-9-5.5z" />
      <path d="M6.5 12.6V18c0 1 2.5 2.2 5.5 2.2s5.5-1.2 5.5-2.2v-5.4M20 10.5V16" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function IconWhatsapp(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={24} height={24} {...props}>
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.45 1.33 4.95L2 22l5.24-1.37a9.9 9.9 0 004.8 1.23h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2zm0 18.17c-1.5 0-2.96-.4-4.24-1.16l-.3-.18-3.11.82.83-3.03-.2-.31a8.16 8.16 0 01-1.26-4.35c0-4.52 3.68-8.19 8.28-8.19 4.6 0 8.28 3.67 8.28 8.19 0 4.52-3.68 8.21-8.28 8.21zm4.53-6.13c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.24-.63.8-.78.97-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.21-.73-.65-1.23-1.45-1.37-1.7-.14-.24-.02-.37.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.56-1.34-.76-1.83-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}
