import { getWeatherInfo, type WeatherKind } from "@/lib/weather-codes";

const SIZES = { sm: "size-6", md: "size-10", lg: "size-16" } as const;

// Icônes au trait (monochromes), cohérentes avec un thème sobre.
const SUN = (
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>
);
const CLOUD = <path d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.2 11.1 3.5 3.5 0 0 0 7 18Z" />;
const CLOUD_HIGH = <path d="M7 14h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.2 7.1 3.5 3.5 0 0 0 7 14Z" />;

const PATHS: Record<WeatherKind, React.ReactNode> = {
  clear: SUN,
  partly: (
    <>
      <path d="M8 2.5v1.2M3.2 7.5H2M4.4 3.9l.9.9M12.6 3.9l-.9.9" />
      <path d="M5.3 9.4A3.5 3.5 0 0 1 11.4 6" />
      <path d="M9 20h8.5a3.5 3.5 0 0 0 .5-6.97A5 5 0 0 0 8.4 13.6 3.2 3.2 0 0 0 9 20Z" />
    </>
  ),
  cloudy: CLOUD,
  fog: (
    <>
      {CLOUD_HIGH}
      <path d="M4 18h16M6 21h12" />
    </>
  ),
  drizzle: (
    <>
      {CLOUD_HIGH}
      <path d="M8 18v1M12 18v1M16 18v1M10 21v1M14 21v1" />
    </>
  ),
  rain: (
    <>
      {CLOUD_HIGH}
      <path d="m8 17-1 3M12 17l-1 3M16 17l-1 3" />
    </>
  ),
  snow: (
    <>
      {CLOUD_HIGH}
      <path d="M8 18h.01M12 18h.01M16 18h.01M10 21h.01M14 21h.01" strokeWidth={2.5} />
    </>
  ),
  storm: (
    <>
      {CLOUD_HIGH}
      <path d="m12.5 15-2.5 4h4l-2.5 4" />
    </>
  ),
};

export function WeatherIcon({ code, size = "md" }: { code: number; size?: keyof typeof SIZES }) {
  const { kind, label } = getWeatherInfo(code);
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${SIZES[size]} shrink-0`}
    >
      {PATHS[kind]}
    </svg>
  );
}
