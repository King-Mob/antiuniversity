import { useState, useEffect, type ReactElement } from "react";
import { useNavigate, useParams } from "react-router";
import { putEvent, postImage, getImage, redactEvent } from "./requests";
import { type venue, type event, type user } from "./types";

function EditEvent({
    venues,
    existingEvents,
    loadEvents,
    user,
    isAdmin,
}: {
    venues: venue[];
    existingEvents: event[];
    loadEvents: () => void;
    user: user | undefined;
    isAdmin: boolean;
}) {
    const { id } = useParams();
    const [organiserName, setOrganiserName] = useState("");
    const [organiserEmail, setOrganiserEmail] = useState("");
    const [organiserPhone, setOrganiserPhone] = useState<string | undefined>();
    const [organiserWebsite, setOrganiserWebsite] = useState<string | undefined>();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [venueId, setVenueId] = useState("");
    const [imageSrc, setImageSrc] = useState("");
    const [picture, setPicture] = useState("");
    const [pictureFile, setPictureFile] = useState<File>();
    const [slotsUsed, setSlotsUsed] = useState<number[]>([]);
    const [published, setPublished] = useState(false);
    const [approved, setApproved] = useState(false);
    const [creator, setCreator] = useState("");
    const [deleteMode, setDeleteMode] = useState(false);
    const navigate = useNavigate();

    async function loadImage(url: string) {
        const pictureResponse = await getImage(url.replace("mxc://", ""));
        const pictureResult = await pictureResponse.blob();
        const imageUrl = window.URL.createObjectURL(pictureResult);
        setImageSrc(imageUrl);
    }

    function loadEvent() {
        const existingEvent = existingEvents.find((event) => event.id === id);
        if (existingEvent) {
            setOrganiserName(existingEvent.organiserName);
            setOrganiserEmail(existingEvent.organiserEmail);
            setOrganiserPhone(existingEvent.organiserPhone);
            setOrganiserWebsite(existingEvent.organiserWebsite);
            setName(existingEvent.name);
            setDescription(existingEvent.description);
            setVenueId(existingEvent.venueId);
            setSlotsUsed(existingEvent.slotsUsed);
            setPublished(existingEvent.published);
            setApproved(existingEvent.approved);
            setCreator(existingEvent.creator);
            if (existingEvent.picture) {
                setPicture(existingEvent.picture);
                loadImage(existingEvent.picture);
            }
            if (!user || (user.name !== existingEvent.creator && !isAdmin)) {
                navigate(`/event/${id}`);
            }
        }
    }

    useEffect(() => {
        loadEvent();
    }, [existingEvents]);

    const isValid = organiserName && organiserEmail && name && description && venueId && slotsUsed;

    async function uploadImage() {
        if (pictureFile && user) {
            const imageBuffer = await pictureFile.arrayBuffer();
            const imageResponse = await postImage(pictureFile.name, imageBuffer, user.access_token);
            const imageResult = await imageResponse.json();
            return imageResult.content_uri;
        }
        return "";
    }

    async function save() {
        if (id && user && isValid) {
            const pictureUrl = pictureFile ? await uploadImage() : picture;

            const response = await putEvent(
                {
                    venueId,
                    name,
                    description,
                    picture: pictureUrl,
                    slotsUsed,
                    creator,
                    published,
                    approved,
                    organiserName,
                    organiserEmail,
                    organiserPhone,
                    organiserWebsite,
                },
                id,
                user.access_token
            );
            if (response) {
                loadEvents();
                navigate(`/event/${id}`);
            }
        }
    }

    async function deleteEvent() {
        if (user && id) {
            await redactEvent(id, user.access_token);
            loadEvents();
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
        venue &&
        venue.slotsAvailable.filter(
            (slot) =>
                !existingEvents
                    .filter((event) => event.id !== id)
                    .find((event) => event.venueId === venue.id && event.slotsUsed?.includes(slot))
        );

    const days: ReactElement[][] = [
        [<p className="day-heading">Monday 13th</p>],
        [<p className="day-heading">Tuesday 14th</p>],
        [<p className="day-heading">Wednesday 15th</p>],
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

                if (dayIndex === (slot.getDay() + 6) % 7)
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
            <h1>Editing Event</h1>
            <>
                <p> Please get in touch if you have any questions.</p>
                <h2>Organiser Information</h2>
                <input
                    type="text"
                    value={organiserName}
                    onChange={(e) => setOrganiserName(e.target.value)}
                    placeholder="Name (or group)"
                ></input>
                <input
                    type="text"
                    value={organiserEmail}
                    onChange={(e) => setOrganiserEmail(e.target.value)}
                    placeholder="Contact email"
                ></input>
                <input
                    type="text"
                    value={organiserPhone}
                    onChange={(e) => setOrganiserPhone(e.target.value)}
                    placeholder="Contact phone number"
                ></input>
                <input
                    type="text"
                    value={organiserWebsite}
                    onChange={(e) => setOrganiserWebsite(e.target.value)}
                    placeholder="Website or social media links"
                ></input>
                <h2>Event Information</h2>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="name"></input>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    rows={3}
                    cols={33}
                ></textarea>
                <p>Picture:</p>
                {pictureFile ? (
                    <>
                        <img src={pictureUrl} className="create-image" />
                        <br />
                    </>
                ) : (
                    imageSrc && (
                        <>
                            <img src={imageSrc} className="create-image" />
                            <br />
                        </>
                    )
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
                {venueId && (
                    <>
                        <p>Select time slot </p>
                        <div className="days-container">
                            {days.map((day) => (
                                <div>{day}</div>
                            ))}
                        </div>
                    </>
                )}
                <input
                    id="published"
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                ></input>
                <label htmlFor="published">Ready to publish (leave unchecked to save as draft)</label>
                <br />
                {!approved && <p>Event awaiting approval, will be publically visible soon</p>}
                {isAdmin &&
                    (approved ? (
                        <>
                            <button onClick={() => setApproved(false)}>Unapprove</button>
                            <p>Event will be approved when saved</p>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setApproved(true)}>Approve</button>
                            <p>Event will be unapproved when saved</p>
                        </>
                    ))}
                <button onClick={save} disabled={!isValid}>
                    Save
                </button>
                <br />
                {deleteMode ? (
                    <>
                        <button onClick={deleteEvent}>Delete</button>
                        <button onClick={() => setDeleteMode(false)}>Cancel</button>
                    </>
                ) : (
                    <button onClick={() => setDeleteMode(true)}>Delete Event</button>
                )}
            </>
        </div>
    );
}

export default EditEvent;
