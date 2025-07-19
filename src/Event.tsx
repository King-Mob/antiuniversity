import { useParams, Link } from "react-router";
import { type event, type venue, type user } from "./types";
import { useState, useEffect } from "react";
import { getImage } from "./requests";

export function formatTime(event: event) {
    if (!event.slotsUsed[0]) return "no time scheduled";

    const startTimeOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };

    const endTimeOptions: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
    };

    const startTime = new Date(event.slotsUsed[0]);

    const lastSlot = event.slotsUsed[event.slotsUsed.length - 1];

    const endTime = new Date(lastSlot);
    endTime.setTime(lastSlot + 30 * 60 * 1000);

    return `${startTime.toLocaleDateString("en-GB", startTimeOptions)} - ${endTime.toLocaleTimeString(
        "en-GB",
        endTimeOptions
    )}`;
}

function Event({
    events,
    venues,
    user,
    isAdmin,
}: {
    events: event[];
    venues: venue[];
    user: user | undefined;
    isAdmin: boolean;
}) {
    const [imageSrc, setImageSrc] = useState("");
    const { id } = useParams();

    const event = events.find((event) => event.id === id);
    const venue = venues.find((venue) => venue.id === event?.venueId);

    async function loadImage() {
        if (event && event.picture) {
            const pictureResponse = await getImage(event.picture.replace("mxc://", ""));
            const pictureResult = await pictureResponse.blob();
            const imageUrl = window.URL.createObjectURL(pictureResult);
            setImageSrc(imageUrl);
        }
    }

    useEffect(() => {
        loadImage();
    }, [event]);

    const time = event && formatTime(event);

    return event ? (
        <div className="event-container">
            <img src={imageSrc || "/reader.svg"} className="event-image" />
            <h1>{event.name}</h1>
            <p>Venue: {venue && venue.name}</p>
            <p>Date/Time: {time}</p>
            <p>Organiser: {event.organiserName}</p>
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
