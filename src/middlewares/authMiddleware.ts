import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwtPayloadWithUser } from '../types/JwtPayloadWithUser';
import { Adminuser } from '../entities/admin';
import { AppDataSource } from '../config/database';
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {

  if (!req.header('x-auth-token') || !req.header('x-auth-token')?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }
  else{
  const token = req.header('x-auth-token')?.split(' ')[1];
  if(!token){
    throw new Error('Invalid auth token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayloadWithUser;
    if (decoded && decoded.userUuid) {
      req.user = { userUuid: decoded.userUuid };
      next(); 
    } else {
      res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}
};
export const authadminMiddleware = async(req: Request, res: Response, next: NextFunction):Promise<void> => {

  if (!req.header('x-auth-token') || !req.header('x-auth-token')?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }
  else{
  const token = req.header('x-auth-token')?.split(' ')[1];
  if(!token){
    throw new Error('Invalid auth token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayloadWithUser;
    if (decoded && decoded.userUuid) {
      const AdminRepository=AppDataSource.getRepository(Adminuser);
              const admin=await AdminRepository.findOne({where:{uuid:decoded.userUuid}})
              if(!admin){
                  res.status(400).json({status:false,message:'Unauthorized'})  
                  return;
              } 
      
      req.user = { userUuid: decoded.userUuid };
      
      next(); 
    } else {
      res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}
};
