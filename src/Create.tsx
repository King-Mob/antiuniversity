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
    const [capacity, setCapacity] = useState(0);
    const [slotsAvailable, setSlotsAvailable] = useState<number[]>([]);
    const [created, setCreated] = useState(false);

    async function create() {
        if (user) {
            const response = await postVenue(
                {
                    name,
                    description,
                    address,
                    creator: user.name,
                    capacity,
                    slotsAvailable,
                },
                user.access_token
            );
            if (response) {
                setCreated(true);
                setName("");
                setDescription("");
                setAddress("");
                setCapacity(0);
                setSlotsAvailable([]);
                loadEvents();
            }
        }
    }

    function toggleSlot(slot: Date) {
        const slotIndex = slotsAvailable.findIndex((slotAvailable) => slotAvailable === slot.getTime());
        if (slotIndex >= 0) {
            const newSlotsAvailable = slotsAvailable.slice(0, slotIndex).concat(slotsAvailable.slice(slotIndex + 1));
            setSlotsAvailable(newSlotsAvailable);
        } else {
            const newSlotsAvailable = slotsAvailable.concat(slot.getTime());
            setSlotsAvailable(newSlotsAvailable);
        }
    }

    const midnight13thUTC = 1760310000000;

    const slots: Date[] = [];

    for (let i = 0; i < 336; i++) {
        slots.push(new Date(midnight13thUTC + i * 1000 * 60 * 30));
    }

    console.log(slotsAvailable);

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
                    <input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(parseInt(e.target.value))}
                    ></input>
                    <div className="slots-grid">
                        <p>13th</p>
                        <p>14th</p>
                        <p>15th</p>
                        <p>16th</p>
                        <p>17th</p>
                        <p>18th</p>
                        <p>19th</p>
                        {slots.map((slot) => (
                            <div className="slot-container">
                                <button
                                    className={`slot-toggle ${
                                        slotsAvailable.includes(slot.getTime()) ? "slot-selected" : ""
                                    }`}
                                    onClick={() => toggleSlot(slot)}
                                >
                                    {slot.toTimeString().slice(0, 5)}
                                </button>
                            </div>
                        ))}
                    </div>
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
    const [slotsUsed, setSlotsUsed] = useState([]);
    const [created, setCreated] = useState(false);
    const [published, setPublished] = useState(false);

    async function create() {
        if (user) {
            const response = await postEvent(
                {
                    name,
                    description,
                    venueId,
                    slotsUsed,
                    creator: user.name,
                    published,
                    approved: false,
                },
                user.access_token
            );
            if (response) {
                setName("");
                setDescription("");
                setVenueId("");
                setSlotsUsed([]);
                setCreated(true);
                loadEvents();
            }
        }
    }

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
                    <p>Select time slot </p>

                    <input
                        id="published"
                        type="checkbox"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                    ></input>
                    <label htmlFor="published">Ready to publish (leave unchecked to save as draft)</label>
                    <br />
                    <button onClick={create}>Create</button>
                </>
            )}
        </div>
    );
}
