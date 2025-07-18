import Markdown from "react-markdown";
import { Link } from "react-router";
import { Venue } from "./Home";
import { type venue, type user } from "./types";

const content = `
**ANTIUNI 2025 VENUES**

Below is a list of all the venues that are available to host events, with time slots that you can book. If you have organised a place to hold your event yourself, you can register a new venue and even make your space available to other Antiuni organisers.

If you want to hold an event in a public place e.g. a park, feel free to add the place as a venue. Make sure the description of the location is specific enough so people can find you. 

If your event takes place online only, please choose the online Antiuni place as your venue and add the link to your digital session in your event description. Alternatively you can create your own online place especially for your events.

❗**Deleting your place will cause all events that have chosen your place to disappear**❗(please give us or the organisers of the event good warning if you wish to do so)

Use this [guide](festival.antiuniversity.org/instructions) if you need more information on registering an event or creating a venue.
`;

function Venues({ venues, user, isAdmin }: { venues: venue[]; user: user | undefined; isAdmin: boolean }) {
    return (
        <>
            <Markdown>{content}</Markdown>
            <h2>Venues</h2>
            {venues.map((venue) => (
                <Venue venue={venue} user={user} isAdmin={isAdmin} />
            ))}
            {user && (
                <Link to="/new/venue">
                    <h2>Create venue</h2>
                </Link>
            )}
        </>
    );
}

export default Venues;
