import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { useState, useEffect } from "react";
import "./index.css";
import UserHeader from "./UserHeader.tsx";
import Home from "./Home.tsx";
import Venue from "./Venue.tsx";
import Event from "./Event.tsx";
import EditEvent from "./EditEvent.tsx";
import User from "./User.tsx";
import CreateVenue from "./CreateVenue.tsx";
import CreateEvent from "./CreateEvent.tsx";
import About from "./About.tsx";
import Contact from "./Contact.tsx";
import Instructions from "./Instructions.tsx";
import Venues from "./Venues.tsx";
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

            if (oldEvent) {
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
    const draftEvents = prepareEvents(timeline, user, true);

    return (
        <BrowserRouter>
            <UserHeader user={user} setUser={setUser} />
            <Routes>
                <Route path="/" element={<Home venues={venues} events={events} user={user} />} />
                <Route path="/venue">
                    <Route path="new" element={<CreateVenue venues={venues} loadEvents={loadEvents} user={user} />} />
                    <Route path=":id" element={<Venue venues={venues} user={user} isAdmin={isAdmin} />} />
                </Route>
                <Route path="/event">
                    <Route path=":id" element={<Event events={events} user={user} isAdmin={isAdmin} />} />
                    <Route
                        path=":id/edit"
                        element={
                            <EditEvent
                                venues={venues}
                                existingEvents={draftEvents}
                                user={user}
                                isAdmin={isAdmin}
                                loadEvents={loadEvents}
                            />
                        }
                    />
                    <Route
                        path="new"
                        element={
                            <CreateEvent
                                venues={venues}
                                existingEvents={draftEvents}
                                loadEvents={loadEvents}
                                user={user}
                            />
                        }
                    />
                </Route>
                <Route path="/user/:id" element={<User events={events} />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="venues" element={<Venues venues={venues} user={user} isAdmin={isAdmin} />} />
                <Route path="instructions" element={<Instructions />} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
