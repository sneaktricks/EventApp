"use server";

import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "./definitions";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export const encryptEvent = async (payload: SessionPayload) => {
  return new SignJWT({ eventId: payload.eventId, adminCode: payload.adminCode })
    .setSubject(payload.eventId)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(encodedKey);
};

export const decryptEvent = async (session: string) => {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (e) {
    console.log("Failed to verify session");
  }
};
