import { eventDetails } from "@/lib/event";

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="mt-0.5 h-4 w-4 shrink-0 text-gold"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="mt-0.5 h-4 w-4 shrink-0 text-gold"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="mt-0.5 h-4 w-4 shrink-0 text-gold"
      aria-hidden
    >
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

export function EventDetails() {
  return (
    <section className="glass-panel glow-gold mx-auto w-full max-w-lg rounded-2xl px-5 py-6 sm:px-8">
      <h2 className="text-center font-serif text-sm uppercase tracking-[0.2em] text-gold-bright sm:text-base">
        Event Details
      </h2>

      <ul className="mt-5 flex flex-col gap-4">
        <li className="flex gap-3">
          <CalendarIcon />
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dim">
              Date
            </p>
            <p className="mt-1 text-sm text-foreground/85">
              {eventDetails.dates}
            </p>
          </div>
        </li>

        <li className="flex gap-3">
          <ClockIcon />
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dim">
              Time
            </p>
            <p className="mt-1 text-sm text-foreground/85">
              {eventDetails.morningSlot}
            </p>
            <p className="mt-1 text-sm text-foreground/85">
              {eventDetails.eveningSlot}
            </p>
          </div>
        </li>

        <li className="flex gap-3">
          <MapPinIcon />
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dim">
              Venue
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/85">
              {eventDetails.venue}
            </p>
          </div>
        </li>
      </ul>

      <p className="mt-5 text-center text-xs leading-relaxed text-foreground/55">
        {eventDetails.tagline}
      </p>
    </section>
  );
}
