import { TActionInputs } from "@/ai/with-streamable/types";
import { format, parseISO } from "date-fns";

export function Events({ events }: TActionInputs["getEvents"]) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 overflow-scroll py-4 -mt-2">
      {events.map((event) => (
        <div
          key={event.date}
          className="flex flex-col p-4 bg-zinc-900 rounded-md max-w-96 flex-shrink-0"
        >
          <div className="text-zinc-400 text-sm">
            {format(parseISO(event.date), "dd LLL, yyyy")}
          </div>
          <div className="text-base font-bold text-zinc-200">
            {event.headline.slice(0, 30)}
          </div>
          <div className="text-zinc-500">
            {event.description.slice(0, 70)}...
          </div>
        </div>
      ))}
    </div>
  );
}
