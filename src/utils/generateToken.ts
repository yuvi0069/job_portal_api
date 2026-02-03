import jwt from "jsonwebtoken";

export const generateToken = (userUuid: string): string => {
  const payload = {
    userUuid,
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string);
};
export const generateEmailtoken = (userUuid: string): string => {
  const payload = {
    userUuid,
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "2h",
  });
};
