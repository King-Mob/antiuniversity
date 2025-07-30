import { useParams, Link } from "react-router";
import { useState, useEffect, type ReactElement } from "react";
import { type venue, type event, type user } from "./types";
import { getImage } from "./requests";
import Markdown from "react-markdown";

function Venue({
    venues,
    existingEvents,
    user,
    isAdmin,
}: {
    venues: venue[];
    existingEvents: event[];
    user: user | undefined;
    isAdmin: boolean;
}) {
    const { id } = useParams();
    const [imageSrc, setImageSrc] = useState("");

    const venue = venues.find((venue) => venue.id === id);

    async function loadImage() {
        if (venue && venue.picture) {
            const pictureResponse = await getImage(venue.picture.replace("mxc://", ""));
            const pictureResult = await pictureResponse.blob();
            const imageUrl = window.URL.createObjectURL(pictureResult);
            setImageSrc(imageUrl);
        }
    }

    useEffect(() => {
        loadImage();
    }, [venue]);

    //this needs to filter for events that have the same venue id

    const slotsAvailable =
        venue &&
        venue.slotsAvailable &&
        venue.slotsAvailable.filter(
            (slot) => !existingEvents.find((event) => event.venueId === venue.id && event.slotsUsed?.includes(slot))
        );

    const days: ReactElement[][] = [
        [<p className="day-heading">Monday</p>, <p className="day-heading">13th</p>],
        [<p className="day-heading">Tuesday</p>, <p className="day-heading">14th</p>],
        [<p className="day-heading">Wednesday</p>, <p className="day-heading">15th</p>],
        [<p className="day-heading">Thursday</p>, <p className="day-heading">16th</p>],
        [<p className="day-heading">Friday</p>, <p className="day-heading">17th</p>],
        [<p className="day-heading">Saturday</p>, <p className="day-heading">18th</p>],
        [<p className="day-heading">Sunday</p>, <p className="day-heading">19th</p>],
    ];

    if (slotsAvailable)
        days.forEach((day, dayIndex) => {
            slotsAvailable.sort().forEach((slotTime) => {
                const slot = new Date(slotTime);

                if (dayIndex === (slot.getDay() + 6) % 7)
                    day.push(
                        <div className="slot-container">
                            <p className="slot-text">{slot.toTimeString().slice(0, 5)}</p>
                        </div>
                    );
            });
        });

    return venue ? (
        <div className="venue-container">
            <img src={imageSrc || "/reader.svg"} className="venue-image" />
            <h1>Venue: {venue.name}</h1>
            <p>Address: {venue.address}</p>
            <p>Capacity: {venue.capacity}</p>
            <p>Accessibility: {venue.accessibilityInformation}</p>
            <Markdown>{venue.otherInformation}</Markdown>
            <p>Times available:</p>
            <div className="days-container">
                {days.map((day) => (
                    <div>{day}</div>
                ))}
            </div>
            <p>
                Created by <Link to={`/user/${venue.creator}`}>{venue.creator}</Link>
            </p>
            {(isAdmin || (user && user.name === venue.creator)) && (
                <Link to={`/venue/${id}/edit`}>
                    <p>Edit venue</p>
                </Link>
            )}
        </div>
    ) : (
        <div>
            <h2>No venue with that id</h2>
        </div>
    );
}

export default Venue;
