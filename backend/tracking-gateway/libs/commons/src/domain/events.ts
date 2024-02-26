export const TrackingEvents = { CreateEvent: 'create_event' } as const;
export const AuthEvents = {
  IdentifyUser: 'identify_user',
  AliasUser: 'alias_user',
} as const;
export const Events = { ...TrackingEvents, ...AuthEvents } as const;

// export type EventPayloads = { [Events.CREATE_EVENT]: TrackingEventDto };
