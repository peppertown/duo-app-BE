import { Transform } from 'class-transformer';
import { IsIn } from 'class-validator';

const roleMap = {
  남자친구: 'bf',
  여자친구: 'gf',
} as const;

export class UserRoleDto {
  @IsIn(['남자친구', '여자친구'])
  @Transform(({ value }) => roleMap[value])
  role: 'bf' | 'gf';
}
