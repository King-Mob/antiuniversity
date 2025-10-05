import { type event, type venue } from "./types";
import { Event } from "./Home";

export default function List({
  events,
  venues,
}: {
  events: event[];
  venues: venue[];
}) {
  console.log(events);

  return (
    <div className="day-container">
      <h1>List</h1>
      {events.map((event) => (
        <Event event={event} venues={venues} key={event.id} />
      ))}
    </div>
  );
}
