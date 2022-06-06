import { IsString, Length, IsEmail } from 'class-validator';
import * as Response from '../../response.messages';

export class CreateUserDto {
  readonly name: string;

  readonly registered: boolean;

  @IsString(Response.MUST_BE_STR)
  @IsEmail({}, Response.WRONG_EMAIL)
  readonly email: string;

  @IsString(Response.MUST_BE_STR)
  @Length(4, 22, Response.MORE4LESS22)
  readonly password: string;
}
