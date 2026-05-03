const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ShelfHeader() {
  const d = new Date();
  const today = `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return (
    <header className="px-6 pt-16 pb-10 text-center">
      <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--ink-tertiary)]">
        Memoir
      </div>
      <h1 className="mt-4 font-serif text-4xl font-medium leading-tight text-foreground sm:text-5xl">
        Your life,
        <br />
        <span className="italic">beautifully remembered.</span>
      </h1>
      <p className="mt-6 font-serif italic text-base text-[color:var(--ink-tertiary)]">
        Good evening, Anna.
      </p>
      <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
        {today}
      </p>
    </header>
  );
}