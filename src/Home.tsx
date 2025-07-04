import { useState } from "react";
import { Link } from "react-router";
import "./App.css";
import UserHeader from "./UserHeader";
import { type venue, type event, type user } from "./types";
import { putEvent, redactEvent } from "./requests";

function Event({
  event,
  user,
  venues,
  loadEvents,
}: {
  event: event;
  user: user | undefined;
  venues: venue[];
  loadEvents: () => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [venueId, setVenueId] = useState(event.venueId);
  const [name, setName] = useState(event.name);
  const [description, setDescription] = useState(event.description);

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
          startTime: event.startTime,
          endTime: event.endTime,
          creator: event.creator,
        },
        event.id,
        user.access_token
      );
      setEditMode(false);
    }
  }

  const venue = venues.find((venue) => venue.id === venueId);

  return (
    <div className="event">
      {editMode ? (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
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
        ) : (
          <Link to={`/venue/${venue.id}`}>
            <p>{venue.name}</p>
          </Link>
        ))}
      {editMode ? (
        <>
          {" "}
          <br />{" "}
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></input>
        </>
      ) : (
        <p>Description: {description}</p>
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
      {user && event.creator === user.name && (
        <>
          <button onClick={() => setEditMode(true)}>edit event</button>
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
  setUser,
  loadEvents,
}: {
  venues: venue[];
  events: event[];
  user: user | undefined;
  setUser: (user: user | undefined) => void;
  loadEvents: () => void;
}) {
  const { VITE_SUBMISSIONS_OPEN } = import.meta.env;

  return (
    <>
      <h1>Antiuniversity Venues & Events</h1>
      <UserHeader user={user} setUser={setUser} />
      {VITE_SUBMISSIONS_OPEN ? (
        <div>
          <h2>Venues:</h2>
          {venues.map((venue) => (
            <div className="venue">
              <Link to={`/venue/${venue.id}`}>
                <h3>{venue.name}</h3>
              </Link>
              <p>
                Created by{" "}
                <Link to={`/user/${venue.creator}`}>{venue.creator}</Link>
              </p>
              <p>Description: {venue.description}</p>
              <p>Address: {venue.address}</p>
              {user && venue.creator === user.name && false && (
                <>
                  <button>edit venue</button>
                  <button>delete venue</button>
                </>
              )}
            </div>
          ))}
          {user && (
            <Link to="/new/venue">
              <h2>Create venue</h2>
            </Link>
          )}

          <h2>Events:</h2>
          {events.map((event) => (
            <Event
              event={event}
              user={user}
              venues={venues}
              loadEvents={loadEvents}
              key={event.id}
            />
          ))}
          {user && (
            <Link to="/new/event">
              <h2>Create event</h2>
            </Link>
          )}
        </div>
      ) : (
        <h2>Coming soon!</h2>
      )}
    </>
  );
}

export default Home;
