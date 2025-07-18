export type newVenue = {
    name: string;
    description: string;
    address: string;
    creator: string;
    capacity: number;
    slotsAvailable: number[];
    picture: string;
};

export type venue = newVenue & {
    id: string;
};

export type newEvent = {
    venueId: string;
    name: string;
    description: string;
    slotsUsed: number[];
    creator: string;
    published: boolean;
    approved: boolean;
    picture: string;
};

export type event = newEvent & {
    id: string;
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
