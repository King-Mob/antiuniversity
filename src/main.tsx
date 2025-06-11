import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { useState, useEffect } from "react";
import "./index.css";
import Home from "./Home.tsx";
import { CreateVenue, CreateEvent } from "./Create.tsx";
import { getEvents } from "./requests.ts";
import { VENUE_EVENT, EVENT_EVENT, type matrixEvent, type venue, type event } from "./types.ts";

function App() {
    const [timeline, setTimeline] = useState<matrixEvent[]>([]);

    async function loadEvents() {
        const events = await getEvents();
        setTimeline(events.chunk);
    }

    useEffect(() => {
        loadEvents();
    }, []);

    const venues = timeline
        .filter((event) => event.type === VENUE_EVENT)
        .map((event) => ({ ...event.content, id: event.event_id } as venue));
    const events = timeline.filter((event) => event.type === EVENT_EVENT).map((event) => event.content as event);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home venues={venues} events={events} />} />
                <Route path="/new">
                    <Route path="venue" element={<CreateVenue venues={venues} loadEvents={loadEvents} />} />
                    <Route
                        path="event"
                        element={<CreateEvent venues={venues} events={events} loadEvents={loadEvents} />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
