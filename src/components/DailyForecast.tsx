import type { DailyWeather } from "@/types/open-meteo";
import { getWeatherInfo } from "@/lib/weather-codes";
import { RAIN_VIGILANCE, rainVigilanceDays } from "@/lib/rain-vigilance";
import { WeatherIcon } from "./WeatherIcon";

function dayLabel(iso: string, index: number) {
  if (index === 0) return "Aujourd'hui";
  if (index === 1) return "Demain";
  return new Date(`${iso}T12:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric" });
}

const mm = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

function WarningIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function VigilanceBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-warning px-2 py-0.5 text-xs font-semibold text-white">
      <WarningIcon className="size-3.5" />
      Vigilance pluie
    </span>
  );
}

const COLS = "sm:grid-cols-[11rem_1fr_9rem_7rem]";

export function DailyForecast({ daily }: { daily: DailyWeather }) {
  const vigilance = rainVigilanceDays(daily);

  return (
    <section aria-labelledby="daily-title">
      <h2 id="daily-title" className="mb-4 text-lg font-semibold tracking-tight">
        Prévisions sur 7 jours
      </h2>

      {vigilance.length > 0 && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border-2 border-warning bg-warning-soft px-4 py-3 text-sm text-warning">
          <WarningIcon className="mt-0.5 size-5" />
          <p>
            <strong className="font-semibold">Vigilance pluie</strong> :{" "}
            {vigilance.map((i) => dayLabel(daily.time[i], i).toLowerCase()).join(", ")}.{" "}
            <span className="text-warning/90">
              Cumul prévu d’au moins {RAIN_VIGILANCE.minPrecipitationMm} mm ou probabilité de pluie
              d’au moins {RAIN_VIGILANCE.minProbabilityPercent} %.
            </span>
          </p>
        </div>
      )}

      {/* En-têtes de colonnes (écrans larges). Chaque cellule porte aussi son libellé pour les lecteurs d'écran. */}
      <div aria-hidden className={`hidden border-b border-border-strong pb-2 text-xs font-medium text-muted sm:grid ${COLS} sm:gap-4 sm:px-3`}>
        <span>Jour</span>
        <span>Conditions</span>
        <span>Pluie</span>
        <span className="text-right">Max / Min</span>
      </div>

      <ul>
        {daily.time.map((day, i) => {
          const isVigilance = vigilance.includes(i);
          const code = daily.weather_code[i];
          const rainProb = daily.precipitation_probability_max[i];
          const rainSum = daily.precipitation_sum[i];
          return (
            <li
              key={day}
              className={`grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 border-b border-border px-3 py-4 ${COLS} ${
                isVigilance ? "rounded-md border-b-transparent bg-warning-soft ring-2 ring-inset ring-warning" : ""
              }`}
            >
              {/* Jour (+ badge) */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium capitalize">{dayLabel(day, i)}</span>
                {isVigilance && <VigilanceBadge />}
              </div>

              {/* Températures : à droite sur mobile, dernière colonne sur écran large */}
              <p className="text-right tabular-nums sm:order-4">
                <span className="sr-only">Maximum </span>
                <span className="font-semibold">{Math.round(daily.temperature_2m_max[i])}°</span>
                <span aria-hidden className="text-muted"> / </span>
                <span className="sr-only">, minimum </span>
                <span className="text-muted">{Math.round(daily.temperature_2m_min[i])}°</span>
              </p>

              {/* Conditions */}
              <p className="flex items-center gap-2 text-sm sm:order-2 sm:text-base">
                <WeatherIcon code={code} size="sm" />
                <span aria-hidden>{getWeatherInfo(code).label}</span>
              </p>

              {/* Pluie : probabilité + cumul */}
              <p className="text-right text-sm tabular-nums text-muted sm:order-3 sm:text-left">
                <span className="sr-only">Probabilité de pluie </span>
                <span className={isVigilance ? "font-semibold text-warning" : "text-foreground"}>{rainProb ?? 0} %</span>
                <span aria-hidden> · </span>
                <span className="sr-only">, cumul </span>
                {mm.format(rainSum ?? 0)} mm
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
