import { useParams, Link } from "react-router";
import { type venue, type user } from "./types";

function Venue({ venues, user, isAdmin }: { venues: venue[]; user: user | undefined; isAdmin: boolean }) {
    const { id } = useParams();

    const venue = venues.find((venue) => venue.id === id);

    return venue ? (
        <div>
            <h1>Venue: {venue.name}</h1>
            <h2>{venue.description}</h2>
            <p>
                Creator <Link to={`/user/${venue.creator}`}>{venue.creator}</Link>
            </p>
            <p>Capacity: {venue.capacity}</p>
        </div>
    ) : (
        <div>
            <h2>No venue with that id</h2>
        </div>
    );
}

export default Venue;
