import * as Response from '../../response.messages';
import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString(Response.MUST_BE_STR)
  readonly role: string;

  @IsString(Response.MUST_BE_STR)
  readonly description: string;
}
