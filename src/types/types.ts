export type Recurrence = "30" | "60" | "90" | "";

export type Event = {
  start: number;
  end: number;
  recurrence: Recurrence;
  id: string;
  color: string;
  value: number;
  title: string;
};

export type EventDate = {
  date: string;
  event: Event[];
};
