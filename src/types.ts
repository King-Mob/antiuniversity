export type venue = {
    id: string;
    name: string;
    description: string;
    address: string;
};

export type newVenue = {
    name: string;
    description: string;
    address: string;
};

export type event = {
    venueId: string;
    name: string;
    description: string;
    startTime: Date;
    endTime: Date;
};

export type matrixEvent = {
    type: string;
    event_id: string;
    content: any;
};

export const VENUE_EVENT = "antiuniversity.venue.event";
export const EVENT_EVENT = "antiuniversity.event.event";
