import { type newVenue, type newEvent, VENUE_EVENT, EVENT_EVENT, EVENT_UPDATED_EVENT, VENUE_UPDATED_EVENT } from "./types";
import { timelineStart } from "./main";

const { VITE_MATRIX_TOKEN, VITE_HOMESERVER, VITE_ROOM_ID, VITE_REGISTRATION_TOKEN } = import.meta.env;

export const getEvents = async (from: string = timelineStart) => {
    const eventsResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/messages?limit=10000&dir=f&from=${from}`,
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

export const putVenue = async (venue: newVenue, old_venue_id: string, token: string) => {
    const putResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/send/${VENUE_UPDATED_EVENT}/${Math.random()}`,
        {
            method: "PUT",
            body: JSON.stringify({
                ...venue,
                old_venue_id,
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

export const getUsernameAvailable = async (username: string) => {
    const availableResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/register/available?username=${username}`
    );

    const availableResult = await availableResponse.json();
    return availableResult;
};

export const postRegister = async (username: string, password: string) => {
    const sessionResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/register?kind=user`, {
        method: "POST",
        body: JSON.stringify({}),
    });
    const sessionResult = await sessionResponse.json();

    await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/register?kind=user`, {
        method: "POST",
        body: JSON.stringify({
            auth: {
                type: "m.login.registration_token",
                token: VITE_REGISTRATION_TOKEN,
                session: sessionResult.session,
            },
        }),
    });

    const dummyResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/register?kind=user`, {
        method: "POST",
        body: JSON.stringify({
            device_id: "web-client" + Math.random(),
            initial_device_display_name: "Booking website",
            password: password,
            username: username,
            auth: {
                type: "m.login.dummy",
                session: sessionResult.session,
            },
        }),
    });
    const dummyResult = await dummyResponse.json();
    return dummyResult;
};

export const joinRoom = async (username: string, access_token: string) => {
    await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/invite`, {
        method: "POST",
        body: JSON.stringify({
            user_id: `@${username}:spacetu.be`,
        }),
        headers: {
            Authorization: `Bearer ${VITE_MATRIX_TOKEN}`,
        },
    });

    await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/join/${VITE_ROOM_ID}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

export const postImage = async (fileName: string, image: ArrayBuffer, access_token: string) => {
    const fileExtension = fileName.split(".")[1];

    return fetch(`${VITE_HOMESERVER}/_matrix/media/v3/upload?filename=${fileName}`, {
        method: "POST",
        body: image,
        headers: {
            "Content-Type": `image/${fileExtension}`,
            Authorization: `Bearer ${access_token}`,
        },
    });
};

export const getImage = async (mxc: string) => {
    return fetch(`${VITE_HOMESERVER}/_matrix/client/v1/media/download/${mxc}`, {
        headers: {
            Authorization: `Bearer ${VITE_MATRIX_TOKEN}`,
        },
    });
};
