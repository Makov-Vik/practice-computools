import { IsString, IsEmail } from 'class-validator';
import * as Response from '../../response.messages';

export class ChangeLoginDto {
  readonly name: string;

  @IsString(Response.MUST_BE_STR)
  @IsEmail({}, Response.WRONG_EMAIL)
  readonly email: string;
}
