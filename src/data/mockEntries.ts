export interface Entry {
  id: string;
  title: string;
  date: string; // human readable
  weekday: string;
  body: string;
}

const sampleBody = `The light came in at an angle this morning that I haven't seen since last spring. Slow, gold, almost reluctant — the way a candle behaves when you've forgotten about it for an hour.

I made coffee in the small pot, the one with the chipped handle. I keep meaning to replace it and never do. There is something stubborn in the way I love broken, working things.

Later, walking to the river, I passed the bookseller and thought of Dad. He would have stopped, of course. He always stopped. I think I am beginning to understand that the things we inherit are not objects but pauses — the small, unhurried places we choose to linger.`;

export const mockEntries: Record<string, Entry> = {
  default: {
    id: "default",
    title: "On the slowness of mornings",
    date: "May 5, 2026",
    weekday: "Tuesday",
    body: sampleBody,
  },
};

export function getEntry(id: string): Entry {
  return mockEntries[id] ?? { ...mockEntries.default, id };
}