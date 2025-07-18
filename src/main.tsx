import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { useState, useEffect } from "react";
import "./index.css";
import Home from "./Home.tsx";
import Venue from "./Venue.tsx";
import Event from "./Event.tsx";
import User from "./User.tsx";
import { CreateVenue, CreateEvent } from "./Create.tsx";
import { getEvents } from "./requests.ts";
import {
    VENUE_EVENT,
    EVENT_EVENT,
    EVENT_UPDATED_EVENT,
    type matrixEvent,
    type venue,
    type event,
    type user,
} from "./types.ts";

function justLocalPart(username: string) {
    return username.split("@")[1].split(":")[0];
}

function prepareVenues(timeline: matrixEvent[]) {
    return timeline
        .filter((event) => event.type === VENUE_EVENT)
        .map((event) => ({ ...event.content, id: event.event_id, creator: justLocalPart(event.sender) } as venue));
}

function prepareEvents(timeline: matrixEvent[], user: user | undefined, isAdmin: boolean) {
    let events: event[] = [];

    console.log(timeline);

    timeline.forEach((matrixEvent) => {
        if (matrixEvent.type === EVENT_EVENT && matrixEvent.content.name) {
            events.push({
                ...matrixEvent.content,
                id: matrixEvent.event_id,
                creator: justLocalPart(matrixEvent.sender),
            });
        }
        if (matrixEvent.type === EVENT_UPDATED_EVENT) {
            const eventToUpdatePosition = events.findIndex((event) => event.id === matrixEvent.content.old_event_id);
            const oldEvent = events[eventToUpdatePosition];

            if (eventToUpdatePosition) {
                events = events
                    .slice(0, eventToUpdatePosition)
                    .concat([
                        {
                            ...matrixEvent.content,
                            id: matrixEvent.content.old_event_id,
                            creator: oldEvent.creator,
                        },
                    ])
                    .concat(events.slice(eventToUpdatePosition + 1));
            }
        }
    });

    return events.filter(
        (event) => (event.published && (event.approved || isAdmin)) || (user && event.creator === user.name)
    );
}

function App() {
    const [timeline, setTimeline] = useState<matrixEvent[]>([]);
    const [user, setUser] = useState<user | undefined>();
    const isAdmin = false || user?.name === "antiuniversity.admin";

    function loadUser() {
        const loginDetails = localStorage.getItem("antiuniversity.login.details");
        if (loginDetails) {
            setUser(JSON.parse(loginDetails));
        }
    }

    async function loadEvents() {
        const events = await getEvents();
        setTimeline(events.chunk);
    }

    useEffect(() => {
        loadUser();
        loadEvents();
    }, []);

    const venues = prepareVenues(timeline);
    const events = prepareEvents(timeline, user, isAdmin);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            venues={venues}
                            events={events}
                            user={user}
                            setUser={setUser}
                            loadEvents={loadEvents}
                            isAdmin={isAdmin}
                        />
                    }
                />
                <Route path="/new">
                    <Route path="venue" element={<CreateVenue venues={venues} loadEvents={loadEvents} user={user} />} />
                    <Route
                        path="event"
                        element={<CreateEvent venues={venues} events={events} loadEvents={loadEvents} user={user} />}
                    />
                </Route>
                <Route path="/venue/:id" element={<Venue venues={venues} user={user} isAdmin={isAdmin} />} />
                <Route path="/event/:id" element={<Event events={events} user={user} isAdmin={isAdmin} />} />
                <Route path="/user/:id" element={<User events={events} />} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
