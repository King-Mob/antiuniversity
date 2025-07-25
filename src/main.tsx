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
import EditVenue from "./EditVenue.tsx";
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
    VENUE_UPDATED_EVENT,
} from "./types.ts";

function justLocalPart(username: string) {
    return username.split("@")[1].split(":")[0];
}

function prepareVenues(timeline: matrixEvent[]) {
    let venues: venue[] = [];

    timeline.forEach((matrixEvent) => {
        if (matrixEvent.type === VENUE_EVENT && matrixEvent.content.name) {
            venues.push({
                ...matrixEvent.content,
                id: matrixEvent.event_id,
                creator: justLocalPart(matrixEvent.sender),
            } as venue);
        }
        if (matrixEvent.type === VENUE_UPDATED_EVENT) {
            const venueToUpdatePosition = venues.findIndex((event) => event.id === matrixEvent.content.old_venue_id);
            const oldVenue = venues[venueToUpdatePosition];

            if (oldVenue) {
                venues = venues
                    .slice(0, venueToUpdatePosition)
                    .concat([
                        {
                            ...matrixEvent.content,
                            id: matrixEvent.content.old_venue_id,
                            creator: oldVenue.creator,
                        },
                    ])
                    .concat(venues.slice(venueToUpdatePosition + 1));
            }
        }
    });

    return venues;
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
                    <Route path="new" element={<CreateVenue loadEvents={loadEvents} user={user} />} />
                    <Route
                        path=":id"
                        element={<Venue venues={venues} existingEvents={draftEvents} user={user} isAdmin={isAdmin} />}
                    />
                    <Route
                        path=":id/edit"
                        element={<EditVenue venues={venues} loadEvents={loadEvents} user={user} isAdmin={isAdmin} />}
                    />
                </Route>
                <Route path="/event">
                    <Route
                        path=":id"
                        element={<Event events={events} venues={venues} user={user} isAdmin={isAdmin} />}
                    />
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
                <Route path="venues" element={<Venues venues={venues} user={user} />} />
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
