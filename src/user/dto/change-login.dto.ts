import { IsString, Length, IsEmail } from 'class-validator';
import { MUST_BE_STR, WRONG_EMAIL, MORE4LESS22 } from '../../constants';

export class ChangeLoginDto {
  readonly name: string;

  @IsString(MUST_BE_STR)
  @IsEmail({}, WRONG_EMAIL)
  readonly email: string;
}
