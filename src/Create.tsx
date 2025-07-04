import { useState } from "react";
import { Link } from "react-router";
import { postVenue, postEvent } from "./requests";
import { type venue, type event, type user } from "./types";

export function CreateVenue({
    venues,
    loadEvents,
    user,
}: {
    venues: venue[];
    loadEvents: () => void;
    user: user | undefined;
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [created, setCreated] = useState(false);

    async function create() {
        if (user) {
            const response = await postVenue(
                {
                    name,
                    description,
                    address,
                    creator: user.name,
                },
                user.access_token
            );
            if (response) {
                setCreated(true);
                setName("");
                setDescription("");
                setAddress("");
                loadEvents();
            }
        }
    }

    return (
        <div>
            <Link to="/">
                <h2>Back</h2>
            </Link>
            <h1>New Venue</h1>
            {created ? (
                <>
                    <h2>Venue created!</h2>
                    <h2>Venue list</h2>
                    {venues.map((venue) => (
                        <div className="venue">
                            <h2>{venue.name}</h2>
                            <h2>Description {venue.description}</h2>
                            <h2>Address {venue.address}</h2>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="name"
                    ></input>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="description"
                    ></input>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="address"
                    ></input>
                    <button onClick={create}>Create</button>
                </>
            )}
        </div>
    );
}

export function CreateEvent({
    venues,
    events,
    loadEvents,
    user,
}: {
    venues: venue[];
    events: event[];
    loadEvents: () => void;
    user: user | undefined;
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [venueId, setVenueId] = useState("");
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [created, setCreated] = useState(false);

    async function create() {
        if (user) {
            const response = await postEvent(
                {
                    name,
                    description,
                    venueId,
                    startTime,
                    endTime,
                    creator: user.name,
                },
                user.access_token
            );
            if (response) {
                setName("");
                setDescription("");
                setVenueId("");
                setStartTime(new Date());
                setEndTime(new Date());
                setCreated(true);
                loadEvents();
            }
        }
    }

    const time = new Date()
        .toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
        .replace(" ", "T");
    console.log(time);

    return (
        <div>
            <Link to="/">
                <h2>Back</h2>
            </Link>
            <h1>New Event</h1>
            {created ? (
                <>
                    <h2>Event created!</h2>
                    <h3>Events list:</h3>
                    {events.map((event) => (
                        <div>
                            <p>{event.name}</p>
                            <p>{event.description}</p>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="name"
                    ></input>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="description"
                    ></input>
                    <select value={venueId} onChange={(e) => setVenueId(e.target.value)} name="venues">
                        <option value={""}>Choose venue</option>
                        {venues.map((venue) => (
                            <option value={venue.id}>{venue.name}</option>
                        ))}
                    </select>
                    {/**
                     * <input
                        type="datetime-local"
                        value={startTime.toString()}
                        onChange={(e) => {
                            console.log(e.target.value);

                            // add one hour when setting start time
                            // not quite sure what the issue is, suspect its time zone related
                            // which means BST problem
                            setStartTime(new Date(e.target.value));
                        }}
                    ></input>
                    <input
                        type="datetime-local"
                        value={endTime.toString()}
                        onChange={(e) => setEndTime(new Date(e.target.value))}
                    ></input>
                     * 
                     */}
                    <p>Start time and end time to come, just fixing timezone bug </p>
                    <button onClick={create}>Create</button>
                </>
            )}
        </div>
    );
}
