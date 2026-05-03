export function ShelfHeader() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
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