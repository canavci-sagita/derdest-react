import { useEffect, useRef } from "react";
import { eventBus, EventMap } from "../eventBus";

export const useSubscription = <TEvent extends keyof EventMap>(
  eventName: TEvent,
  callback: (...args: EventMap[TEvent]) => void
) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handler = (...args: EventMap[TEvent]) => {
      callbackRef.current(...args);
    };

    eventBus.on(eventName, handler);
    return () => eventBus.off(eventName, handler);
  }, [eventName]);
};
