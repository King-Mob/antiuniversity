import { useState, type ReactElement } from "react";
import { Link, useNavigate } from "react-router";
import { postEvent, postImage } from "./requests";
import { type venue, type event, type user, ALL_DAY_SLOTS } from "./types";

const { VITE_SUBMISSIONS_OPEN } = import.meta.env;

function CreateEvent({
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
  const [organiserName, setOrganiserName] = useState("");
  const [organiserEmail, setOrganiserEmail] = useState("");
  const [organiserPhone, setOrganiserPhone] = useState<string | undefined>();
  const [organiserWebsite, setOrganiserWebsite] = useState<
    string | undefined
  >();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [venueId, setVenueId] = useState("");
  const [pictureFile, setPictureFile] = useState<File>();
  const [slotsUsed, setSlotsUsed] = useState<number[]>([]);
  const [published, setPublished] = useState(false);
  const navigate = useNavigate();

  if (VITE_SUBMISSIONS_OPEN !== "true" && !isAdmin) {
    navigate("/");
  }

  const isValid =
    organiserName &&
    organiserEmail &&
    name &&
    description &&
    venueId &&
    slotsUsed;

  async function uploadImage() {
    if (pictureFile && user) {
      const imageBuffer = await pictureFile.arrayBuffer();
      const imageResponse = await postImage(
        pictureFile.name,
        imageBuffer,
        user.access_token
      );
      const imageResult = await imageResponse.json();
      return imageResult.content_uri;
    }
    return "";
  }

  async function create() {
    if (user && isValid) {
      const picture = await uploadImage();

      const response = await postEvent(
        {
          organiserName,
          organiserEmail,
          organiserPhone,
          organiserWebsite,
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
        loadEvents();
        navigate(`/event/${response.event_id}`);
      }
    }
  }

  function toggleSlot(slot: Date) {
    const slotIndex = slotsUsed.findIndex(
      (slotUsed) => slotUsed === slot.getTime()
    );
    if (slotIndex >= 0) {
      const newSlotsUsed = slotsUsed
        .slice(0, slotIndex)
        .concat(slotsUsed.slice(slotIndex + 1));
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
        !existingEvents.find(
          (event) =>
            event.venueId === venue.id && event.slotsUsed?.includes(slot)
        )
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
      slotsAvailable.sort().forEach((slotTime) => {
        const slot = new Date(slotTime);
        const slotOn = slotsUsed.includes(slotTime);

        if (dayIndex === (slot.getDay() + 6) % 7)
          day.push(
            <div className="slot-container">
              <button
                className={`slot-toggle ${
                  slotOn ? "slot-selected" : "slot-unselected"
                }`}
                onClick={() => toggleSlot(slot)}
              >
                {Object.values(ALL_DAY_SLOTS).includes(slot.getTime())
                  ? "ALL DAY"
                  : slot.toTimeString().slice(0, 5)}
              </button>
            </div>
          );
      });
    });

  const pictureUrl = pictureFile ? URL.createObjectURL(pictureFile) : "";

  return (
    <div className="creation-container">
      <h1>Create New Event</h1>
      <>
        <div>
          <p>This is where you register your Antiuniversity event.</p>
          <p>
            {" "}
            Please read and follow these{" "}
            <Link to="/instructions">instructions</Link> before creating your
            event.{" "}
          </p>
          <p>
            When describing your event, please be as detailed as possible so
            people know what to expect. (max 300 words)
          </p>
          <p>
            Please include information about you or your group/organisation (max
            100 words).
          </p>
          <p>
            Make sure you have included a valid contact, so we can be in touch
            about your event.
          </p>
          <p>
            Is your event taking place online? Choose the online Antiuni place
            as your venue and add the link to your digital session in your event
            description. Alternatively you can create your own online place
            especially for your events.
          </p>
          <p>
            To register a physical space, go to VENUES before creating your
            event.
          </p>
          <p>
            Save your event as a draft if it is not ready to be publically
            visible. Your event will immediately go into the programme when you
            submit it. (Don't worry, you can still edit it later if you make a
            mistake).
          </p>
          <p> Please get in touch if you have any questions.</p>
        </div>
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
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
        ></input>
        <br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={3}
          cols={33}
        ></textarea>
        <p>Picture:</p>
        {pictureFile && (
          <>
            <img src={pictureUrl} className="create-image" />
            <br />
          </>
        )}
        <input
          type="file"
          onChange={(e) =>
            setPictureFile(e.target.files ? e.target.files[0] : undefined)
          }
          accept="image/png, image/jpeg, image/gif"
        />
        <br />
        <select
          value={venueId}
          onChange={(e) => setVenueId(e.target.value)}
          name="venues"
        >
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
        <label htmlFor="published">
          Ready to publish (leave unchecked to save as draft)
        </label>
        <br />
        <button onClick={create} disabled={!isValid}>
          Create
        </button>
      </>
    </div>
  );
}

export default CreateEvent;
