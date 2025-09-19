import { useState, type ReactElement } from "react";
import { useNavigate } from "react-router";
import { postVenue, postImage } from "./requests";
import { type user, MIDNIGHT13THUTC, ALL_DAY_SLOTS } from "./types";

export function SlotButton({
  slotOn,
  slot,
  toggleSlot,
}: {
  slotOn: boolean;
  slot: Date;
  toggleSlot: (slot: Date) => void;
}) {
  return (
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
}

const { VITE_SUBMISSIONS_OPEN } = import.meta.env;

function CreateVenue({
  loadEvents,
  user,
  isAdmin,
}: {
  loadEvents: () => void;
  user: user | undefined;
  isAdmin: boolean;
}) {
  const [name, setName] = useState("");
  const [otherInformation, setOtherInformation] = useState("");
  const [accessibilityInformation, setAccessibilityInformation] = useState("");
  const [pictureFile, setPictureFile] = useState<File>();
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [slotsAvailable, setSlotsAvailable] = useState<number[]>([]);
  const navigate = useNavigate();

  if (VITE_SUBMISSIONS_OPEN !== "true" && !isAdmin) {
    navigate("/venues");
  }

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
    if (user) {
      const picture = await uploadImage();

      const response = await postVenue(
        {
          name,
          otherInformation,
          accessibilityInformation,
          picture,
          address,
          creator: user.name,
          capacity,
          slotsAvailable,
        },
        user.access_token
      );
      if (response) {
        navigate(`/venue/${response.event_id}`);
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
    const slotIndex = slotsAvailable.findIndex(
      (slotAvailable) => slotAvailable === slot.getTime()
    );
    if (slotIndex >= 0) {
      const newSlotsAvailable = slotsAvailable
        .slice(0, slotIndex)
        .concat(slotsAvailable.slice(slotIndex + 1));
      setSlotsAvailable(newSlotsAvailable);
    } else {
      const newSlotsAvailable = slotsAvailable.concat(slot.getTime());
      setSlotsAvailable(newSlotsAvailable);
    }
  }

  const days: ReactElement[][] = [
    [
      <p className="day-heading">Monday 13th</p>,
      <SlotButton
        slotOn={slotsAvailable.includes(ALL_DAY_SLOTS.MONDAY)}
        slot={new Date(ALL_DAY_SLOTS.MONDAY)}
        toggleSlot={toggleSlot}
      />,
    ],
    [
      <p className="day-heading">Tuesday 14th</p>,
      <SlotButton
        slotOn={slotsAvailable.includes(ALL_DAY_SLOTS.TUESDAY)}
        slot={new Date(ALL_DAY_SLOTS.TUESDAY)}
        toggleSlot={toggleSlot}
      />,
    ],
    [
      <p className="day-heading">Wednesday 15th</p>,
      <SlotButton
        slotOn={slotsAvailable.includes(ALL_DAY_SLOTS.WEDNESDAY)}
        slot={new Date(ALL_DAY_SLOTS.WEDNESDAY)}
        toggleSlot={toggleSlot}
      />,
    ],
    [
      <p className="day-heading">Thursday 16th</p>,
      <SlotButton
        slotOn={slotsAvailable.includes(ALL_DAY_SLOTS.THURSDAY)}
        slot={new Date(ALL_DAY_SLOTS.THURSDAY)}
        toggleSlot={toggleSlot}
      />,
    ],
    [
      <p className="day-heading">Friday 17th</p>,
      <SlotButton
        slotOn={slotsAvailable.includes(ALL_DAY_SLOTS.FRIDAY)}
        slot={new Date(ALL_DAY_SLOTS.FRIDAY)}
        toggleSlot={toggleSlot}
      />,
    ],
    [
      <p className="day-heading">Saturday 18th</p>,
      <SlotButton
        slotOn={slotsAvailable.includes(ALL_DAY_SLOTS.SATURDAY)}
        slot={new Date(ALL_DAY_SLOTS.SATURDAY)}
        toggleSlot={toggleSlot}
      />,
    ],
    [
      <p className="day-heading">Sunday 19th</p>,
      <SlotButton
        slotOn={slotsAvailable.includes(ALL_DAY_SLOTS.SUNDAY)}
        slot={new Date(ALL_DAY_SLOTS.SUNDAY)}
        toggleSlot={toggleSlot}
      />,
    ],
  ];

  days.forEach((day, dayIndex) => {
    for (let halfHourIndex = 0; halfHourIndex < 48; halfHourIndex++) {
      const slot = new Date(
        MIDNIGHT13THUTC +
          halfHourIndex * 1000 * 60 * 30 +
          dayIndex * 1000 * 60 * 60 * 24
      );
      const slotOn = slotsAvailable.includes(slot.getTime());

      day.push(
        <SlotButton slotOn={slotOn} slot={slot} toggleSlot={toggleSlot} />
      );
    }
  });

  const pictureUrl = pictureFile ? URL.createObjectURL(pictureFile) : "";

  return (
    <div className="creation-container">
      <h1>New Venue</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="name"
      ></input>
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
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="address (include postcode)"
      ></input>
      <br />
      <label htmlFor="capacity">Capacity: </label>
      <input
        id="capacity"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(parseInt(e.target.value))}
      ></input>
      <p>
        Time slots available [choose half hour slots within the week 13th-19th
        October]
      </p>
      <div className="days-container">
        {days.map((day) => (
          <div>{day}</div>
        ))}
      </div>
      <button onClick={create}>Create</button>
    </div>
  );
}

export default CreateVenue;
