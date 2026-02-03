import { JwtPayloadWithUser } from '../middlewares/authMiddleware'; // Adjust path to your JwtPayloadWithUser type

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadWithUser;  // Add the user property to the Request interface
    }
  }
}
