import { IsNotEmpty } from 'class-validator';

export class PostTrackingEventDto {
  @IsNotEmpty()
  action: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  label: string;

  value?: number;

  data?: { [key: string]: string | number | boolean | any };

  @IsNotEmpty()
  sessionId: string;

  @IsNotEmpty()
  identityId: string;
}
