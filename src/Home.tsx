import { useState, useEffect } from "react";
import { Link } from "react-router";
import "./App.css";
import { type venue, type event, type user, type day } from "./types";
import { getImage } from "./requests";
import { breakIntoDays, formatTime } from "./Event";

function Event({ event, venues }: { event: event; venues: venue[] }) {
    const [imageSrc, setImageSrc] = useState("");

    async function loadImage() {
        if (event.picture) {
            const pictureResponse = await getImage(event.picture.replace("mxc://", ""));
            const pictureResult = await pictureResponse.blob();
            const imageUrl = window.URL.createObjectURL(pictureResult);
            setImageSrc(imageUrl);
        }
    }

    useEffect(() => {
        loadImage();
    }, []);

    const venue = venues.find((venue) => venue.id === event.venueId);
    const time = breakIntoDays(event.slotsUsed).map(day => formatTime(day)).join(", ");

    return (
        <div className="event">
            <img src={imageSrc || "/reader.svg"} className="event-image" />
            <div className="event-right">
                <Link to={`/event/${event.id}`}>
                    <h2>{event.name}</h2>
                </Link>
                {venue && (
                    <p>
                        Venue: <Link to={`/venue/${venue.id}`}>{venue.name}</Link>
                    </p>
                )}
                <p>Time: {time}</p>
            </div>
        </div>
    );
}

function Home({ venues, events, user }: { venues: venue[]; events: event[]; user: user | undefined }) {
    const { VITE_SUBMISSIONS_OPEN } = import.meta.env;

    const [dayActive, setDayActive] = useState(-1);

    const days: day[] = [
        { name: "Monday 13th October", date: new Date(1760310000000), events: [] },
        { name: "Tuesday 14th October", date: new Date(1760396400000), events: [] },
        { name: "Wednesday 15th October", date: new Date(1760482800000), events: [] },
        { name: "Thursday 16th October", date: new Date(1760569200000), events: [] },
        { name: "Friday 17th October", date: new Date(1760655600000), events: [] },
        { name: "Saturday 18th October", date: new Date(1760742000000), events: [] },
        { name: "Sunday 19th October", date: new Date(1760828400000), events: [] },
    ];

    events.forEach((event) => {
        const slots = event.slotsUsed;

        if (slots) {
            const eventDays = days.filter((day) => {
                const slotsOnThisDay = slots.filter(slot => {
                    const slotDate = new Date(slot);
                    return day.date.getDate() === slotDate.getDate();
                });
                return slotsOnThisDay.length > 0;
            });
            eventDays.forEach(eventDay => eventDay.events.push(event));
        }
    });

    return VITE_SUBMISSIONS_OPEN === "true" ? (
        <>
            <div className="backed-text-container">
                <p className="indent">Event submissions open: 20th July - 31st August</p>
                <p className="indent">
                    View the schedule of events below, and go to <Link to="/instructions">Instructions</Link> to find
                    out how to register your own event!
                </p>
            </div>
            <div className="day-container">
                {days.map((day, dayIndex) =>
                    dayIndex === dayActive ? (
                        <>
                            <button className="day-button" onClick={() => setDayActive(-1)}>
                                <h2>{day.name}</h2>
                            </button>
                            {day.events.map((event) => (
                                <Event event={event} venues={venues} key={event.id} />
                            ))}
                            {day.events.length === 0 && <p className="backed-text">No events on this day</p>}
                        </>
                    ) : (
                        <>
                            <button className="day-button" onClick={() => setDayActive(dayIndex)}>
                                <h2>{day.name}</h2>
                            </button>
                        </>
                    )
                )}
                {user && (
                    <Link to="/event/new">
                        <h2 className="create-link">Create event</h2>
                    </Link>
                )}
            </div>
        </>
    ) : (
        <div id="coming-soon-container">
            <h1>Antiuniversity is down for maintenance.</h1>
            <p>The festival is on the 13th - 19th October</p>
            <p>Sorry for the inconvenience, we're working hard to bring the site back</p>
        </div>
    );
}

export default Home;
