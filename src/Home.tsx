import { Link } from "react-router";
import "./App.css";
import { type venue, type event } from "./types";

function Home({ venues, events }: { venues: venue[]; events: event[] }) {
    const { VITE_SUBMISSIONS_OPEN } = import.meta.env;

    return (
        <>
            <h1>AntiUniversity Submissions</h1>
            {VITE_SUBMISSIONS_OPEN ? (
                <div>
                    <h2>Venues:</h2>
                    {venues.map((venue) => (
                        <div className="venue">
                            <h3>{venue.name}</h3>
                            <p>Description: {venue.description}</p>
                            <p>Address: {venue.address}</p>
                        </div>
                    ))}
                    <Link to="/new/venue">
                        <h2>Create venue</h2>
                    </Link>
                    <h2>Events:</h2>
                    {events.map((event) => (
                        <div className="event">
                            <h3>{event.name}</h3>
                            <p>Description: {event.description}</p>
                        </div>
                    ))}
                    <Link to="/new/event">
                        <h2>Create event</h2>
                    </Link>
                </div>
            ) : (
                <h2>Coming soon!</h2>
            )}
        </>
    );
}

export default Home;
