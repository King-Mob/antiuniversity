import { useParams, Link } from "react-router";
import { type event } from "./types";

function User({ events }: { events: event[] }) {
    const { id } = useParams();

    const userEvents = events.filter((event) => event.creator === id);

    return (
        <div>
            <h1>User: {id}</h1>
            <h2>Events by user</h2>
            {userEvents.map((event) => (
                <div>
                    <Link to={`/event/${event.id}`}>
                        <h3>{event.name}</h3>
                    </Link>
                    <p>{event.description}</p>
                </div>
            ))}
        </div>
    );
}

export default User;
