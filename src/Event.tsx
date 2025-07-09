import { useParams, Link } from "react-router";
import { type event, type user } from "./types";

function Event({ events, user, isAdmin }: { events: event[]; user: user | undefined; isAdmin: boolean }) {
    console.log(user, isAdmin);

    const { id } = useParams();

    const event = events.find((event) => event.id === id);

    return event ? (
        <div>
            <h1>Event: {event.name}</h1>
            <p>{event.description}</p>
            <p>
                Created by <Link to={`/user/${event.creator}`}>{event.creator}</Link>
            </p>
        </div>
    ) : (
        <div>
            <h2>No event found with that id</h2>
        </div>
    );
}

export default Event;
