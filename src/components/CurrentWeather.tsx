import type { CurrentWeather as Current } from "@/types/open-meteo";
import { getWeatherInfo } from "@/lib/weather-codes";
import { WeatherIcon } from "./WeatherIcon";

export function CurrentWeather({ current }: { current: Current }) {
  const { label } = getWeatherInfo(current.weather_code);
  // Heure locale du Bénin renvoyée par l'API (ex. "2026-11-18T17:45")
  const time = current.time.slice(11, 16).replace(":", " h ");

  const stats = [
    { label: "Ressenti", value: `${Math.round(current.apparent_temperature)}°` },
    { label: "Humidité", value: `${current.relative_humidity_2m} %` },
    { label: "Vent", value: `${Math.round(current.wind_speed_10m)} km/h` },
  ];

  return (
    <section aria-labelledby="now-title" className="flex flex-col rounded-xl border border-border p-6 sm:p-8">
      <h2 id="now-title" className="text-sm text-muted">
        Maintenant · {time}
      </h2>

      <div className="mt-4 flex items-center gap-5">
        <WeatherIcon code={current.weather_code} size="lg" />
        <div>
          <p className="text-6xl font-light tracking-tight tabular-nums sm:text-7xl">
            {Math.round(current.temperature_2m)}°
          </p>
          <p className="mt-1 text-muted">{label}</p>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-3 divide-x divide-border border-t border-border pt-5 lg:mt-auto">
        {stats.map((s) => (
          <div key={s.label} className="px-3 first:pl-0">
            <dt className="text-xs text-muted">{s.label}</dt>
            <dd className="mt-0.5 font-medium tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
