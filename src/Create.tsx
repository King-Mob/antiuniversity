import { useState, type ReactElement } from "react";
import { Link } from "react-router";
import { postVenue, postEvent, postImage } from "./requests";
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
    const [pictureFile, setPictureFile] = useState<File>();
    const [address, setAddress] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [slotsAvailable, setSlotsAvailable] = useState<number[]>([]);
    const [created, setCreated] = useState(false);

    async function uploadImage() {
        if (pictureFile && user) {
            const imageBuffer = await pictureFile.arrayBuffer();
            const imageResponse = await postImage(pictureFile.name, imageBuffer, user.access_token);
            const imageResult = await imageResponse.json();
            return imageResult.content_uri;
        }
        return "";
    }

    async function create() {
        if (user) {
            const picture = await uploadImage();

            const response = await postVenue(
                {
                    name,
                    description,
                    picture,
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

    const days: ReactElement[][] = [
        [<p className="day-heading">Monday 13th</p>],
        [<p className="day-heading">Tuesday 14th</p>],
        [<p className="day-heading">Wed 15th</p>],
        [<p className="day-heading">Thursday 16th</p>],
        [<p className="day-heading">Friday 17th</p>],
        [<p className="day-heading">Saturday 18th</p>],
        [<p className="day-heading">Sunday 19th</p>],
    ];

    days.forEach((day, dayIndex) => {
        for (let halfHourIndex = 0; halfHourIndex < 48; halfHourIndex++) {
            const slot = new Date(midnight13thUTC + halfHourIndex * 1000 * 60 * 30 + dayIndex * 1000 * 60 * 60 * 24);
            const slotOn = slotsAvailable.includes(slot.getTime());

            day.push(
                <div className="slot-container">
                    <button
                        className={`slot-toggle ${slotOn ? "slot-selected" : "slot-unselected"}`}
                        onClick={() => toggleSlot(slot)}
                    >
                        {slot.toTimeString().slice(0, 5)}
                    </button>
                </div>
            );
        }
    });

    const pictureUrl = pictureFile ? URL.createObjectURL(pictureFile) : "";

    return (
        <div className="creation-container">
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
                    <p>Picture:</p>
                    {pictureFile && (
                        <>
                            <img src={pictureUrl} className="create-image" />
                            <br />
                        </>
                    )}
                    <input
                        type="file"
                        onChange={(e) => setPictureFile(e.target.files ? e.target.files[0] : undefined)}
                        accept="image/png, image/jpeg, image/gif"
                    />
                    <br />
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
                    <div className="days-container">
                        {days.map((day) => (
                            <div>{day}</div>
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
    const [pictureFile, setPictureFile] = useState<File>();
    const [slotsUsed, setSlotsUsed] = useState<number[]>([]);
    const [created, setCreated] = useState(false);
    const [published, setPublished] = useState(false);

    async function uploadImage() {
        if (pictureFile && user) {
            const imageBuffer = await pictureFile.arrayBuffer();
            const imageResponse = await postImage(pictureFile.name, imageBuffer, user.access_token);
            const imageResult = await imageResponse.json();
            return imageResult.content_uri;
        }
        return "";
    }

    async function create() {
        if (user) {
            const picture = await uploadImage();

            const response = await postEvent(
                {
                    name,
                    description,
                    venueId,
                    picture,
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

    function toggleSlot(slot: Date) {
        const slotIndex = slotsUsed.findIndex((slotUsed) => slotUsed === slot.getTime());
        if (slotIndex >= 0) {
            const newSlotsUsed = slotsUsed.slice(0, slotIndex).concat(slotsUsed.slice(slotIndex + 1));
            setSlotsUsed(newSlotsUsed);
        } else {
            const newSlotsUsed = slotsUsed.concat(slot.getTime());
            setSlotsUsed(newSlotsUsed);
        }
    }

    const venue = venueId && venues.find((venue) => venue.id === venueId);

    const slotsAvailable =
        venue && venue.slotsAvailable.filter((slot) => !events.find((event) => event.slotsUsed?.includes(slot)));

    console.log(slotsAvailable);

    const days: ReactElement[][] = [
        [<p className="day-heading">Monday 13th</p>],
        [<p className="day-heading">Tuesday 14th</p>],
        [<p className="day-heading">Wed 15th</p>],
        [<p className="day-heading">Thursday 16th</p>],
        [<p className="day-heading">Friday 17th</p>],
        [<p className="day-heading">Saturday 18th</p>],
        [<p className="day-heading">Sunday 19th</p>],
    ];

    if (slotsAvailable)
        days.forEach((day, dayIndex) => {
            slotsAvailable.forEach((slotTime) => {
                const slot = new Date(slotTime);
                const slotOn = slotsUsed.includes(slotTime);

                console.log();
                if (dayIndex === slot.getDay() - (1 % 7))
                    day.push(
                        <div className="slot-container">
                            <button
                                className={`slot-toggle ${slotOn ? "slot-selected" : "slot-unselected"}`}
                                onClick={() => toggleSlot(slot)}
                            >
                                {slot.toTimeString().slice(0, 5)}
                            </button>
                        </div>
                    );
            });
        });

    const pictureUrl = pictureFile ? URL.createObjectURL(pictureFile) : "";

    return (
        <div className="creation-container">
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
                    <p>Picture:</p>
                    {pictureFile && (
                        <>
                            <img src={pictureUrl} className="create-image" />
                            <br />
                        </>
                    )}
                    <input
                        type="file"
                        onChange={(e) => setPictureFile(e.target.files ? e.target.files[0] : undefined)}
                        accept="image/png, image/jpeg, image/gif"
                    />
                    <br />
                    <select value={venueId} onChange={(e) => setVenueId(e.target.value)} name="venues">
                        <option value={""}>Choose venue</option>
                        {venues.map((venue) => (
                            <option value={venue.id}>{venue.name}</option>
                        ))}
                    </select>
                    <p>Select time slot </p>
                    <div className="days-container">
                        {days.map((day) => (
                            <div>{day}</div>
                        ))}
                    </div>
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
