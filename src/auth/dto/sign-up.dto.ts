import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
} from 'class-validator';
import { IsUserAlreadyExist } from '../../user/validators/is-user-already-exist.validator';
import { Match } from '../decorators/match.decorator';

export class SignUpDto {
  @IsDefined()
  @IsNotEmpty()
  readonly name: string;

  @IsDefined()
  @IsEmail()
  @Validate(IsUserAlreadyExist)
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @Match('password', { message: "Password confirmation didn't match" })
  @IsNotEmpty()
  readonly password_confirmation: string;
}
