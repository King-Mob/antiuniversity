import { useState } from "react";
import { postVenue, postEvent } from "./requests";
import { type venue, type event } from "./types";

export function CreateVenue({ venues, loadEvents }: { venues: venue[]; loadEvents: () => void }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [created, setCreated] = useState(false);

    async function create() {
        const response = await postVenue({
            name,
            description,
            address,
        });
        if (response) {
            setCreated(true);
            setName("");
            setDescription("");
            setAddress("");
            loadEvents();
        }
    }

    return (
        <div>
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
}: {
    venues: venue[];
    events: event[];
    loadEvents: () => void;
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [venueId, setVenueId] = useState("");
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [created, setCreated] = useState(false);

    async function create() {
        const response = await postEvent({
            name,
            description,
            venueId,
            startTime,
            endTime,
        });
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

    return (
        <div>
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
                    <input
                        type="datetime-local"
                        value={startTime.toISOString().replace("Z", "")}
                        onChange={(e) => {
                            console.log(e.target.value);
                            // add one hour when setting start time
                            setStartTime(new Date(e.target.value));
                        }}
                    ></input>
                    <input
                        type="datetime-local"
                        value={endTime.toISOString().replace("Z", "")}
                        onChange={(e) => setEndTime(new Date(e.target.value))}
                    ></input>
                    <button onClick={create}>Create</button>
                </>
            )}
        </div>
    );
}
