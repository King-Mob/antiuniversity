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
                    <div>
                        <h2>Venues:</h2>
                        {venues.map((venue) => (
                            <div className="venue">
                                <h3>{venue.name}</h3>
                                <p>Description: {venue.description}</p>
                                <p>Address: {venue.address}</p>
                            </div>
                        ))}
                        <h2>Events:</h2>
                        {events.map((event) => (
                            <div>
                                <h3>{event.name}</h3>
                                <p>Description: {event.description}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <Link to="/new/venue">
                            <h2>Create venue</h2>
                        </Link>
                        <Link to="/new/event">
                            <h2>Create event</h2>
                        </Link>
                    </div>
                </div>
            ) : (
                <h2>Coming soon!</h2>
            )}
        </>
    );
}

export default Home;
