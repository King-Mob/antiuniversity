import { useState, useEffect } from "react";
import { Link } from "react-router";
import "./App.css";
import { type venue, type event, type user, type day } from "./types";
import { getImage, putEvent, redactEvent } from "./requests";

export function Venue({ venue }: { venue: venue }) {
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
            <Link to={`/venue/${venue.id}`}>
                <h3>{venue.name}</h3>
            </Link>
            <p>
                Created by <Link to={`/user/${venue.creator}`}>{venue.creator}</Link>
            </p>

            {imageSrc && <img src={imageSrc} />}
            <p>Address: {venue.address}</p>
            <p>Capacity: {venue.capacity}</p>

            <p>Other Information: {venue.otherInformation}</p>
        </div>
    );
}

function Event({
    event,
    user,
    isAdmin,
    venues,
    loadEvents,
}: {
    event: event;
    user: user | undefined;
    isAdmin: boolean;
    venues: venue[];
    loadEvents: () => void;
}) {
    const [editMode, setEditMode] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const [venueId, setVenueId] = useState(event.venueId);
    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description);
    const [picture, setPicture] = useState(event.picture);
    const [slotsUsed, setSlotsUsed] = useState(event.slotsUsed);
    const [published, setPublished] = useState(event.published);
    const [approved, setApproved] = useState(event.approved);
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

    async function deleteEvent() {
        if (user) {
            await redactEvent(event.id, user.access_token);
            loadEvents();
        }
    }

    async function saveEvent() {
        if (user) {
            await putEvent(
                {
                    venueId,
                    name,
                    description,
                    picture,
                    slotsUsed,
                    creator: event.creator,
                    published,
                    approved,
                    organiserName: event.organiserName,
                    organiserEmail: event.organiserEmail,
                },
                event.id,
                user.access_token
            );
            setEditMode(false);
            setSlotsUsed([]);
            setPicture(event.picture);
        }
    }

    const venue = venues.find((venue) => venue.id === venueId);
    const time = slotsUsed?.[0] ? new Date(slotsUsed[0]).toLocaleString() : "";

    return (
        <div className="event">
            {editMode ? (
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
            ) : (
                <Link to={`/event/${event.id}`}>
                    <h3>{name}</h3>
                </Link>
            )}
            <p>
                Created by <Link to={`/user/${event.creator}`}>{event.creator}</Link>
            </p>
            {venue &&
                (editMode ? (
                    <select value={venueId} onChange={(e) => setVenueId(e.target.value)} name="venues">
                        <option value={""}>Choose venue</option>
                        {venues.map((venue) => (
                            <option value={venue.id}>{venue.name}</option>
                        ))}
                    </select>
                ) : (
                    <Link to={`/venue/${venue.id}`}>
                        <p>{venue.name}</p>
                    </Link>
                ))}
            {editMode ? (
                <>
                    <p>Time: {time}</p>{" "}
                </>
            ) : (
                <p>Time: {time}</p>
            )}
            {editMode ? (
                <>
                    {" "}
                    <br />{" "}
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}></input>
                </>
            ) : (
                <p>Description: {description}</p>
            )}
            {imageSrc && <img src={imageSrc} />}
            {editMode ? (
                <>
                    <input
                        id="published"
                        type="checkbox"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                    ></input>
                    <label htmlFor="published">Published</label>
                </>
            ) : (
                <>{!published && <p>Not yet published</p>}</>
            )}

            {isAdmin ? (
                editMode ? (
                    <>
                        <input
                            id="approved"
                            type="checkbox"
                            checked={approved}
                            onChange={(e) => setApproved(e.target.checked)}
                        ></input>
                        <label htmlFor="approved">Approved</label>
                    </>
                ) : (
                    <p>{approved ? "Event approved" : "This event has not been approved"}</p>
                )
            ) : (
                <>
                    <p>{approved ? "Event approved" : "This event has not been approved"}</p>
                </>
            )}

            {editMode && (
                <div>
                    <button onClick={saveEvent}>Save</button>
                </div>
            )}
            {deleteMode && (
                <div>
                    <p>Are you sure you want to delete this event?</p>
                    <button onClick={() => setDeleteMode(false)}>Cancel</button>
                    <button onClick={deleteEvent}>Delete event</button>{" "}
                </div>
            )}
            {user && (isAdmin || event.creator === user.name) && (
                <>
                    <Link to={`/event/${event.id}/edit`}>
                        <p>Edit event</p>
                    </Link>
                    <button onClick={() => setDeleteMode(true)}>delete event</button>
                </>
            )}
        </div>
    );
}

function Home({
    venues,
    events,
    user,
    isAdmin,
    loadEvents,
}: {
    venues: venue[];
    events: event[];
    user: user | undefined;
    isAdmin: boolean;
    loadEvents: () => void;
}) {
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
        const eventStartSlot = event.slotsUsed && event.slotsUsed[0];

        if (eventStartSlot) {
            const eventStartTime = new Date(eventStartSlot);
            const eventDay = days.find((day) => day.date.getDate() === eventStartTime.getDate());
            eventDay?.events.push(event);
        }
    });

    return VITE_SUBMISSIONS_OPEN === "true" ? (
        <>
            <h1>Antiuniversity Festival 2025</h1>
            <h2>13th - 19th October</h2>
            <p>Event submissions open: 20th July - 31st August</p>
            <p>
                View the schedule of events below, and go to <Link to="/instructions">Instructions</Link> to find out
                how to register your own event!
            </p>
            <div>
                {days.map((day, dayIndex) =>
                    dayIndex === dayActive ? (
                        <div>
                            <button onClick={() => setDayActive(-1)}>
                                <h2>{day.name}</h2>
                            </button>
                            {day.events.map((event) => (
                                <Event
                                    event={event}
                                    user={user}
                                    isAdmin={isAdmin}
                                    venues={venues}
                                    loadEvents={loadEvents}
                                    key={event.id}
                                />
                            ))}
                            {day.events.length === 0 && <p>No events on this day</p>}
                        </div>
                    ) : (
                        <div>
                            <button onClick={() => setDayActive(dayIndex)}>
                                <h2>{day.name}</h2>
                            </button>
                        </div>
                    )
                )}
                {user && (
                    <Link to="/new/event">
                        <h2>Create event</h2>
                    </Link>
                )}
            </div>
        </>
    ) : (
        <div id="coming-soon-container">
            <h1>Antiuniversity is coming soon!</h1>
            <p>13th - 19th October</p>
            <p>Event submissions open on the 20th July</p>
            <p>Watch this space, put the 13th-19th October in your calendar and start planning your event now!</p>
        </div>
    );
}

export default Home;
