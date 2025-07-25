import { Response } from "express";

export const setCookie = (res: Response, type: string, token: string) => {

  res.cookie(type, token, {
    httpOnly: true,
    secure: true, // true only in production
    sameSite: 'none', // allow cookies in cross-origin dev
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // res.cookie(type, token, {
  //   httpOnly: true,
  //   secure:true,
  //   sameSite: "strict",
  //   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  // });
};
