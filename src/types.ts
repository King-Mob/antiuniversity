export type newVenue = {
    name: string;
    address: string;
    creator: string;
    capacity: number;
    accessibilityInformation: string;
    otherInformation: string;
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
    organiserName: string;
    organiserEmail: string;
    organiserPhone?: string;
    organiserWebsite?: string;
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

export type day = {
    name: string;
    date: Date;
    events: event[];
}

export const VENUE_EVENT = "antiuniversity.venue.event";
export const EVENT_EVENT = "antiuniversity.event.event";
export const EVENT_UPDATED_EVENT = "antiuniversity.event.updated_event";
export const VENUE_UPDATED_EVENT = "antiuniversity.venue.updated_event";