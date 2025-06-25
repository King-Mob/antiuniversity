export type venue = {
    id: string;
    name: string;
    description: string;
    address: string;
    creator: string;
};

export type newVenue = {
    name: string;
    description: string;
    address: string;
    creator: string;
};

export type event = {
    id: string;
    venueId: string;
    name: string;
    description: string;
    startTime: Date;
    endTime: Date;
    creator: string;
};

export type newEvent = {
    venueId: string;
    name: string;
    description: string;
    startTime: Date;
    endTime: Date;
    creator: string;
};

export type matrixEvent = {
    type: string;
    event_id: string;
    content: any;
    sender: string;
};

export type user = {
    name: string;
    access_token: string;
};

export const VENUE_EVENT = "antiuniversity.venue.event";
export const EVENT_EVENT = "antiuniversity.event.event";
export const EVENT_UPDATED_EVENT = "antiuniversity.event.updated_event";
