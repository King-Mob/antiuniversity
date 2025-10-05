import { type event, type venue } from "./types";
import { Event } from "./Home";

export default function List({
  events,
  deletedEvents,
  venues,
}: {
  events: event[];
  deletedEvents: event[];
  venues: venue[];
}) {
  // console.log(events);

  return (
    <div className="day-container">
      <h1>List</h1>
      <h2>Deleted Events</h2>
      {deletedEvents.map((event) => (
        <Event event={event} venues={venues} key={event.id} />
      ))}
      <h2>Events</h2>
      {events.map((event) => (
        <Event event={event} venues={venues} key={event.id} />
      ))}
    </div>
  );
}
