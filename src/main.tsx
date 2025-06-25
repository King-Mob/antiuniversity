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
import { VENUE_EVENT, EVENT_EVENT, type matrixEvent, type venue, type event, type user } from "./types.ts";

function App() {
    const [timeline, setTimeline] = useState<matrixEvent[]>([]);
    const [user, setUser] = useState<user | undefined>();

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

    const justLocalPart = (username: string) => username.split("@")[1].split(":")[0];

    const venues = timeline
        .filter((event) => event.type === VENUE_EVENT)
        .map((event) => ({ ...event.content, id: event.event_id, creator: justLocalPart(event.sender) } as venue));
    const events = timeline
        .filter((event) => event.type === EVENT_EVENT && event.content.name)
        .map((event) => ({ ...event.content, id: event.event_id, creator: justLocalPart(event.sender) } as event));

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home venues={venues} events={events} user={user} setUser={setUser} loadEvents={loadEvents} />
                    }
                />
                <Route path="/new">
                    <Route path="venue" element={<CreateVenue venues={venues} loadEvents={loadEvents} user={user} />} />
                    <Route
                        path="event"
                        element={<CreateEvent venues={venues} events={events} loadEvents={loadEvents} user={user} />}
                    />
                </Route>
                <Route path="/venue/:id" element={<Venue venues={venues} />} />
                <Route path="/event/:id" element={<Event events={events} />} />
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
