import Markdown from "react-markdown";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { getImage } from "./requests";
import { type venue, type user } from "./types";

function Venue({ venue }: { venue: venue }) {
    const [imageSrc, setImageSrc] = useState("");

    async function loadImage() {
        if (venue.picture) {
            const pictureResponse = await getImage(venue.picture.replace("mxc://", ""));
            const pictureResult = await pictureResponse.blob();
            const imageUrl = window.URL.createObjectURL(pictureResult);
            setImageSrc(imageUrl);
        }
    }

    useEffect(() => {
        loadImage();
    }, []);

    return (
        <div className="venue">
            <img src={imageSrc || "/reader.svg"} className="event-image" />
            <div className="venue-right">
                <Link to={`/venue/${venue.id}`}>
                    <h3>{venue.name}</h3>
                </Link>
                <p>Address: {venue.address}</p>
            </div>
        </div>
    );
}

const content = `
**ANTIUNI 2025 VENUES**

Below is a list of all the venues that are available to host events, with time slots that you can book. If you have organised a place to hold your event yourself, you can register a new venue and even make your space available to other Antiuni organisers.

If you want to hold an event in a public place e.g. a park, feel free to add the place as a venue. Make sure the description of the location is specific enough so people can find you. 

If your event takes place online only, please choose the online Antiuni place as your venue and add the link to your digital session in your event description. Alternatively you can create your own online place especially for your events.

❗**Deleting your place will cause all events that have chosen your place to disappear**❗(please give us or the organisers of the event good warning if you wish to do so)

Use this [guide](festival.antiuniversity.org/instructions) if you need more information on registering an event or creating a venue.
`;

function Venues({ venues, user }: { venues: venue[]; user: user | undefined }) {
    return (
        <div className="venues-container">
            <h1>Venues</h1>
            <div className="markdown-content">
                <Markdown>{content}</Markdown>
            </div>
            {venues.map((venue) => (
                <Venue venue={venue} />
            ))}
            {user && (
                <Link to="/new/venue">
                    <h2>Create venue</h2>
                </Link>
            )}
        </div>
    );
}

export default Venues;
