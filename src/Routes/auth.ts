/* eslint-disable no-unused-vars */

import { Router, Request, Response } from 'express';
import { google } from 'googleapis';
import fetch from 'node-fetch';
import User from '../models/User';
import { GOOGLE_AUTH_CATCH } from '../messages';

interface IGProfile {
  id: string;
  email: string;
  verified_email: Boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

const router = Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID as string,
  process.env.GOOGLE_CLIENT_SECRET as string,
  process.env.GOOGLE_REDIRECT_URL as string
);

const url = oauth2Client.generateAuthUrl({
  // If you only need one scope you can pass it as a string
  scope: ['profile', 'email']
});

router.get('/google', (_: Request, res: Response) => {
  res.redirect(url);
});

router.get('/google/callback', async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code as string);

    const resp = await fetch(
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`
        }
      }
    );

    const profile: IGProfile = await resp.json();

    const user = User.findOne({ googleId: profile.id });

    if (user) {
      res.redirect(process.env.CLIENT_URL as string);
    } else {
      const newUser = User.create({
        name: profile.name,
        email: profile.email,
        imageUrl: profile.picture,
        googleId: profile.id
      });

      (await newUser).save();

      res.redirect(process.env.CLIENT_URL as string);
    }
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/e/${GOOGLE_AUTH_CATCH}`);
  }
});

export default router;
