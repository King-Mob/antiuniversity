import { useParams, Link } from "react-router";
import { type event, type venue, type user, ALL_DAY_SLOTS } from "./types";
import { useState, useEffect } from "react";
import { getImage } from "./requests";
import Markdown from "react-markdown";

export function breakIntoDays(slots: number[]) {
    const timesByDay: number[][] = [];
    slots.forEach(slot => {
        const difference = slot - slots[0];
        const days = [0, 1, 2, 3, 4, 5, 6];
        days.forEach(day => {
            if (difference >= day * 24 * 60 * 60 * 1000 && difference < (day + 1) * 24 * 60 * 60 * 1000) {
                if (timesByDay[day]) {
                    timesByDay[day].push(slot);
                }
                else {
                    timesByDay[day] = [slot]
                }
            }
        })
    })
    return timesByDay;
}

export function formatTime(slots: number[]) {
    if (!slots[0]) return "no time scheduled";

    if (Object.values(ALL_DAY_SLOTS).includes(slots[0])) {
        const allDayOptions: Intl.DateTimeFormatOptions = {
            weekday: "long",
            month: "long",
            day: "numeric",
        }

        const allDayTime = new Date(slots[0]);

        return `${allDayTime.toLocaleDateString("en-GB", allDayOptions)} - All day`;
    }

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

    const startTime = new Date(slots[0]);

    const lastSlot = slots[slots.length - 1];

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

    const time = event && breakIntoDays(event.slotsUsed).map(day => formatTime(day)).join(", ");

    return event ? (
        <div className="event-container">
            <img src={imageSrc || "/reader.svg"} className="event-image" />
            <h1>{event.name}</h1>
            <p>Venue: {venue && <Link to={`/venue/${venue.id}`}>{venue.name}</Link>}</p>
            <p>Date/Time: {time}</p>
            <p>Organiser: {event.organiserName}</p>
            <Markdown>{event.description}</Markdown>
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
