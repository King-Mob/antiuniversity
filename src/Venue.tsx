import { useParams, Link } from "react-router";
import { type venue } from "./types";

function Venue({ venues }: { venues: venue[] }) {
    const { id } = useParams();

    const venue = venues.find((venue) => venue.id === id);

    return venue ? (
        <div>
            <h1>Venue: {venue.name}</h1>
            <h2>{venue.description}</h2>
            <p>
                Creator <Link to={`/user/${venue.creator}`}>{venue.creator}</Link>
            </p>
        </div>
    ) : (
        <div>
            <h2>No venue with that id</h2>
        </div>
    );
}

export default Venue;
