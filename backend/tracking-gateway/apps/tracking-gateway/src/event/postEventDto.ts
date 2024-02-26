import { IsNotEmpty } from 'class-validator';

export class PostEventDto {
  @IsNotEmpty()
  action: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  label: string;

  value?: number;

  data?: { [key: string]: string | number | boolean | any };
}
