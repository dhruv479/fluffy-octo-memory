import { hash, compare } from 'bcrypt';
import { Constants } from '../constants';

const saltRounds = Constants.SALT_ROUNDS;

export class PasswordUtils {
  comparePassword(inputPassword: string, savedPassword: string): boolean {
    return compare(inputPassword, savedPassword);
  }

  generateHash(inputPassword: string): string {
    return hash(inputPassword, saltRounds);
  }
}
