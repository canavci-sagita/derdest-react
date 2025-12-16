import { ChatNotification, ProgressNotification } from "@/types/signalr.types";

export type EventMap = {
  progress: [ProgressNotification];
  chat: [ChatNotification];
};

type EventCallback<T extends unknown[]> = (...args: T) => void;

type Events = {
  [K in keyof EventMap]?: EventCallback<EventMap[K]>[];
};

const events: Events = {};

export const eventBus = {
  on<K extends keyof EventMap>(
    eventName: K,
    callback: EventCallback<EventMap[K]>
  ) {
    const list = (events[eventName] ??
      (events[eventName] = [])) as EventCallback<EventMap[K]>[];

    list.push(callback);
  },

  off<K extends keyof EventMap>(
    eventName: K,
    callback: EventCallback<EventMap[K]>
  ) {
    const list = events[eventName] as EventCallback<EventMap[K]>[] | undefined;

    if (!list) return;

    (events as Record<K, EventCallback<EventMap[K]>[]>)[eventName] =
      list.filter((cb) => cb !== callback);
  },

  emit<K extends keyof EventMap>(eventName: K, ...data: EventMap[K]) {
    const list = events[eventName] as EventCallback<EventMap[K]>[] | undefined;

    list?.forEach((cb) => cb(...data));
  },
};
