import { useParams, Link } from "react-router";
import { type event, type user } from "./types";

function Event({ events, user, isAdmin }: { events: event[]; user: user | undefined; isAdmin: boolean }) {
    const { id } = useParams();

    const event = events.find((event) => event.id === id);

    return event ? (
        <div>
            <h1>Event: {event.name}</h1>
            <p>{event.description}</p>
            <p>
                Created by <Link to={`/user/${event.creator}`}>{event.creator}</Link>
            </p>
            {(isAdmin || (user && user.name === event.creator)) && (
                <Link to={`/event/${event.id}/edit`}>
                    <p>Edit event</p>
                </Link>
            )}
        </div>
    ) : (
        <div>
            <h2>No event found with that id</h2>
        </div>
    );
}

export default Event;
