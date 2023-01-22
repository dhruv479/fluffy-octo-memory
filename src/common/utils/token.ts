import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '../dto/base.dto';

export class TokenUtil {
  TOKEN_KEY: string;
  TOKEN_EXPIRY: string;
  constructor() {
    this.TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;
    this.TOKEN_KEY = process.env.TOKEN_KEY;
  }

  secretBuffer = (): Buffer => {
    return Buffer.from(this.TOKEN_KEY as string, 'base64');
  };

  // For generating access token
  generate(payload: TokenPayload): string {
    const secret = this.secretBuffer();

    return jwt.sign(payload, secret, {
      expiresIn: this.TOKEN_EXPIRY,
    });
  }

  verify(token: string): TokenPayload {
    const secret = this.secretBuffer();

    return jwt.verify(token, secret, {
      algorithms: ['HS256'],
    }) as TokenPayload;
  }
}
