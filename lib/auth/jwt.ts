import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ||
    "your-secret-key-min-32-chars-required-here-1234567890",
);

export async function createToken(
  userId: string,
  email: string,
): Promise<string> {
  return await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyToken(
  token: string,
): Promise<{ userId: string; email: string } | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as { userId: string; email: string };
  } catch (err) {
    return null;
  }
}
