export class EventDto {
  action: string;
  session_id: string;
  category: string;
  label: string;
  value?: number;
  data?: { [key: string]: string | number | boolean | any };
}
