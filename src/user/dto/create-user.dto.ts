import { IsString, Length, IsEmail } from 'class-validator';
import { MUST_BE_STR, WRONG_EMAIL } from 'src/constants';

export class CreateUserDto {
  readonly name: string;

  @IsString(MUST_BE_STR)
  @IsEmail({}, WRONG_EMAIL)
  readonly email: string;

  @IsString(MUST_BE_STR)
  @Length(4, 22, { message: 'more than 4 but less than 22' })
  readonly password: string;
}
