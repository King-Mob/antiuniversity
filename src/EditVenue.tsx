import { useState, useEffect, type ReactElement } from "react";
import { useNavigate, useParams } from "react-router";
import { putVenue, postImage, getImage } from "./requests";
import { type user, type venue } from "./types";

function EditVenue({ venues, loadEvents, user }: { venues: venue[]; loadEvents: () => void; user: user | undefined }) {
    const [name, setName] = useState("");
    const [creator, setCreator] = useState("");
    const [otherInformation, setOtherInformation] = useState("");
    const [accessibilityInformation, setAccessibilityInformation] = useState("");
    const [imageSrc, setImageSrc] = useState("");
    const [picture, setPicture] = useState("");
    const [pictureFile, setPictureFile] = useState<File>();
    const [address, setAddress] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [slotsAvailable, setSlotsAvailable] = useState<number[]>([]);
    const navigate = useNavigate();
    const { id } = useParams();

    async function loadImage(url: string) {
        const pictureResponse = await getImage(url.replace("mxc://", ""));
        const pictureResult = await pictureResponse.blob();
        const imageUrl = window.URL.createObjectURL(pictureResult);
        setImageSrc(imageUrl);
    }

    function loadVenue() {
        const venue = venues.find((venue) => venue.id === id);
        if (venue) {
            setName(venue.name);
            setCreator(venue.creator);
            setOtherInformation(venue.otherInformation);
            setAccessibilityInformation(venue.accessibilityInformation);
            setAddress(venue.address);
            setCapacity(venue.capacity);
            setSlotsAvailable(venue.slotsAvailable);
            setPicture(venue.picture);
            loadImage(venue.picture);
        }
    }

    useEffect(() => {
        loadVenue();
    }, [venues]);

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
        if (user && id) {
            const pictureUrl = pictureFile ? await uploadImage() : picture;

            const response = await putVenue(
                {
                    name,
                    otherInformation,
                    accessibilityInformation,
                    picture: pictureUrl,
                    address,
                    creator,
                    capacity,
                    slotsAvailable,
                },
                id,
                user.access_token
            );
            if (response) {
                navigate(`/venue/${id}`);
                setName("");
                setOtherInformation("");
                setAccessibilityInformation("");
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
            <h1>Editing Venue</h1>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="name"></input>
            <input
                type="text"
                value={otherInformation}
                onChange={(e) => setOtherInformation(e.target.value)}
                placeholder="other information"
            ></input>
            <input
                type="text"
                value={accessibilityInformation}
                onChange={(e) => setAccessibilityInformation(e.target.value)}
                placeholder="accessibility information"
            ></input>
            <p>Picture:</p>
            <img src={pictureUrl || imageSrc} className="create-image" />
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
                placeholder="address (include postcode)"
            ></input>
            <input type="number" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value))}></input>
            <p>Time slots available [choose half hour slots within the week 13th-19th October]</p>
            <div className="days-container">
                {days.map((day) => (
                    <div>{day}</div>
                ))}
            </div>
            <button onClick={create}>Save</button>
        </div>
    );
}

export default EditVenue;
