import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { ENCODING_SALT } from '../../constants';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcryptjs';
config();

type Profile = {
  id: string,
  name: { familyName: string, givenName: string },
  emails: { value: string, verified: boolean }[],
  photos: { value: string }[],
}
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(private userService: UserService, private authService: AuthService) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:3030/auth/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    const { name, emails, photos } = profile
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken
    }

    const hashPassword = await bcrypt.hash("google", ENCODING_SALT);

    const candidate = { 
      name: name.givenName,
      email: emails[0].value,
      password: hashPassword,
      registered: true
    };
    if (! await this.userService.getUserByEmail(emails[0].value)) {
      await this.userService.createUser(candidate);
    }
    
    const token = await this.authService.login({
      name: name.givenName,
      email:  emails[0].value,
      password: "google",
      registered: true
    })

    done(null, token);
  }
}