import { CookieOptions } from 'express';

export const ACCESS_COOKIE_OPTION: CookieOptions = {
  maxAge: 30 * 60 * 1000,
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
};

export const REFRESH_COOKIE_OPTION: CookieOptions = {
  maxAge: 60 * 60 * 24 * 7 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
};

function omar (){
  
}