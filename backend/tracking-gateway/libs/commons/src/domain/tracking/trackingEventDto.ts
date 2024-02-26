export interface TrackingEventDto {
  action: string;
  sessionId: string;
  identityId: string;
  category: string;
  label: string;
  value?: number;
  data?: { [key: string]: string | number | boolean | any };
}
