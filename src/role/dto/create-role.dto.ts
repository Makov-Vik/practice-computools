import { MUST_BE_STR } from 'src/constants';
import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString(MUST_BE_STR)
  readonly value: string;

  @IsString(MUST_BE_STR)
  readonly description: string;
}
