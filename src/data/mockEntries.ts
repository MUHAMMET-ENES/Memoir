export interface Entry {
  id: string;
  title: string;
  date: string; // human readable
  weekday: string;
  body: string;
  isoDate: string; // YYYY-MM-DD
}

const sampleBody = `The light came in at an angle this morning that I haven't seen since last spring. Slow, gold, almost reluctant — the way a candle behaves when you've forgotten about it for an hour.

I made coffee in the small pot, the one with the chipped handle. I keep meaning to replace it and never do. There is something stubborn in the way I love broken, working things.

Later, walking to the river, I passed the bookseller and thought of Dad. He would have stopped, of course. He always stopped. I think I am beginning to understand that the things we inherit are not objects but pauses — the small, unhurried places we choose to linger.`;

const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function fmt(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return {
    weekday: WEEKDAYS[d.getDay()],
    date: `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
    year: d.getFullYear(),
    month: d.getMonth() + 1,
  };
}

type Seed = { id: string; isoDate: string; title: string; body: string };

const seeds: Seed[] = [
  { id: "2026-05-05", isoDate: "2026-05-05", title: "On the slowness of mornings", body: sampleBody },
  { id: "2026-04-18", isoDate: "2026-04-18", title: "A walk before the rain", body: "The clouds gathered like an unfinished thought. I walked to the bridge and watched the first drops freckle the river. There is nothing as honest as weather." },
  { id: "2026-03-02", isoDate: "2026-03-02", title: "Tulips, again", body: "Bought tulips on the way home. They lean toward the window the way people lean toward news. Beautiful, urgent, brief." },
  { id: "2026-02-14", isoDate: "2026-02-14", title: "Letter I didn't send", body: "Wrote three pages and folded them into the back of a book I will not read again until summer. Some things are meant to be written, not delivered." },
  { id: "2026-01-09", isoDate: "2026-01-09", title: "First snow of the year", body: "Quiet woke me before the light did. The world outside had been re-upholstered overnight." },
  { id: "2025-12-24", isoDate: "2025-12-24", title: "The kitchen at dusk", body: "Mom hummed a song she swears she invented. The oven ticked. Everything smelled like patience." },
  { id: "2025-11-11", isoDate: "2025-11-11", title: "On finishing things", body: "Closed the book I'd been reading since August. Sat for a long time without opening another one." },
  { id: "2025-10-03", isoDate: "2025-10-03", title: "Train to nowhere in particular", body: "Got off two stops early and walked. The afternoon had that varnished gold light October keeps for itself." },
  { id: "2025-09-15", isoDate: "2025-09-15", title: "Returning", body: "The apartment seemed smaller, the way familiar rooms always do after a trip. I unpacked slowly, on purpose." },
  { id: "2025-08-21", isoDate: "2025-08-21", title: "Sea, salt, and silence", body: "Swam out past the rocks. Floated. The sky was an enormous, uncomplicated blue." },
  { id: "2025-07-04", isoDate: "2025-07-04", title: "Small fireworks", body: "We watched from the balcony with the lights off. The dog hid under the table. The city sounded like a celebration that didn't quite know what for." },
  { id: "2025-06-12", isoDate: "2025-06-12", title: "Long evenings", body: "It didn't get dark until almost ten. I cooked badly and didn't mind." },
  { id: "2025-05-20", isoDate: "2025-05-20", title: "Garden notes", body: "The basil is leggy. The mint, of course, is thriving. There's a lesson in there I'm choosing to ignore." },
  { id: "2025-04-02", isoDate: "2025-04-02", title: "A sentence I overheard", body: "'I keep mistaking nostalgia for love.' Then the bus pulled away." },
  { id: "2025-03-17", isoDate: "2025-03-17", title: "First warm day", body: "Took my coffee outside. The cat blinked slowly at the sun like an old believer." },
  { id: "2025-02-08", isoDate: "2025-02-08", title: "An afternoon of nothing", body: "Read a little. Slept a little. Felt almost guilty until I remembered I am not a machine." },
  { id: "2025-01-01", isoDate: "2025-01-01", title: "A clean page", body: "I don't make resolutions anymore. I write the year on the top of a page and try to mean it." },
  { id: "2024-11-23", isoDate: "2024-11-23", title: "Thanksgiving, quiet edition", body: "Just the three of us. The pie was imperfect, which is to say, perfect." },
  { id: "2024-09-09", isoDate: "2024-09-09", title: "Back to school weather", body: "Even years later, September still smells like new notebooks and the small, hopeful fear of beginnings." },
  { id: "2024-06-21", isoDate: "2024-06-21", title: "Solstice", body: "Stayed up to watch the light refuse to leave. It was generous and a little embarrassing, like an over-long goodbye." },
  { id: "2024-03-30", isoDate: "2024-03-30", title: "An hour at the museum", body: "Stood in front of one painting for far longer than I planned. I think it was looking back." },
];

export const mockEntries: Record<string, Entry> = Object.fromEntries(
  seeds.map((s) => {
    const f = fmt(s.isoDate);
    return [s.id, { id: s.id, title: s.title, body: s.body, isoDate: s.isoDate, date: f.date, weekday: f.weekday }];
  }),
);

export const allEntries: Entry[] = Object.values(mockEntries).sort((a, b) =>
  b.isoDate.localeCompare(a.isoDate),
);

export function getEntry(id: string): Entry {
  return mockEntries[id] ?? allEntries[0];
}

export function entriesForYear(year: number): Entry[] {
  return allEntries.filter((e) => e.isoDate.startsWith(String(year)));
}

export function entriesForMonth(year: number, month: number): Entry[] {
  const m = String(month).padStart(2, "0");
  return allEntries.filter((e) => e.isoDate.startsWith(`${year}-${m}`));
}

export function getYears(): number[] {
  return Array.from(new Set(allEntries.map((e) => Number(e.isoDate.slice(0, 4))))).sort(
    (a, b) => b - a,
  );
}

export function getMonthsForYear(year: number): number[] {
  return Array.from(
    new Set(entriesForYear(year).map((e) => Number(e.isoDate.slice(5, 7)))),
  ).sort((a, b) => b - a);
}

export const MONTH_NAMES = MONTHS;