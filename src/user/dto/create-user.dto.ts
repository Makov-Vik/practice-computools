import { IsString, Length, IsEmail } from 'class-validator';
import { MUST_BE_STR, WRONG_EMAIL, MORE4LESS22 } from '../../constants';

export class CreateUserDto {
  readonly name: string;

  @IsString(MUST_BE_STR)
  @IsEmail({}, WRONG_EMAIL)
  readonly email: string;

  @IsString(MUST_BE_STR)
  @Length(4, 22, MORE4LESS22)
  readonly password: string;
}
