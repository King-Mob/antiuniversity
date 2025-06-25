import { type newVenue, type newEvent, VENUE_EVENT, EVENT_EVENT, EVENT_UPDATED_EVENT } from "./types";

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

export const postLogin = async (username: string, password: string) => {
    const loginResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/login`, {
        method: "POST",
        body: JSON.stringify({
            type: "m.login.password",
            identifier: {
                type: "m.id.user",
                user: username,
            },
            password: password,
        }),
    });
    const loginResult = await loginResponse.json();
    return loginResult;
};

export const postVenue = async (venue: newVenue, token: string) => {
    const postResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/send/${VENUE_EVENT}`, {
        method: "POST",
        body: JSON.stringify(venue),
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const postResult = await postResponse.json();
    return postResult;
};

export const postEvent = async (event: newEvent, token: string) => {
    const postResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/send/${EVENT_EVENT}`, {
        method: "POST",
        body: JSON.stringify(event),
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const postResult = await postResponse.json();
    return postResult;
};

export const putEvent = async (event: newEvent, old_event_id: string, token: string) => {
    const putResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/send/${EVENT_UPDATED_EVENT}/${Math.random()}`,
        {
            method: "PUT",
            body: JSON.stringify({
                ...event,
                old_event_id,
            }),
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const putResult = await putResponse.json();
    return putResult;
};

export const redactEvent = async (eventId: string, token: string, reason = "deleted by user") => {
    const redactResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/redact/${eventId}/${Math.random()}`,
        {
            method: "PUT",
            body: JSON.stringify({
                reason,
            }),
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const redactResult = await redactResponse.json();
    return redactResult;
};
