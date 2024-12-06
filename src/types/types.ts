export type Recurrence = '30' | '60' | '90' | 'no';

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

export type ReformedEvent = {
  color: string;
  value: number;
  recurrence: Recurrence;
  title: string;
  start: number;
  end: number;
  id: string;
  startPercentage: number;
  percent: number;
};
