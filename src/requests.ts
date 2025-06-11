import { type newVenue, type event, VENUE_EVENT, EVENT_EVENT } from "./types";

const { VITE_MATRIX_TOKEN, VITE_HOMESERVER, VITE_ROOM_ID } = import.meta.env;

export const getEvents = async () => {
    const eventsResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/messages?limit=10000&dir=b`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${VITE_MATRIX_TOKEN}`,
            },
        }
    );
    const events = await eventsResponse.json();
    return events;
};

export const postVenue = async (venue: newVenue) => {
    const postResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/send/${VENUE_EVENT}`, {
        method: "POST",
        body: JSON.stringify(venue),
        headers: {
            Authorization: `Bearer ${VITE_MATRIX_TOKEN}`,
        },
    });
    const postResult = await postResponse.json();
    return postResult;
};

export const postEvent = async (event: event) => {
    const postResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/send/${EVENT_EVENT}`, {
        method: "POST",
        body: JSON.stringify(event),
        headers: {
            Authorization: `Bearer ${VITE_MATRIX_TOKEN}`,
        },
    });
    const postResult = await postResponse.json();
    return postResult;
};
