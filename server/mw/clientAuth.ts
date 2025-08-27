import { Request, Response, NextFunction } from 'express';

export function clientAuth(req: Request, res: Response, next: NextFunction) {
  const clientPassword = process.env.CLIENT_PASSWORD;
  
  if (!clientPassword) {
    return res.status(500).json({ 
      error: 'CLIENT_PASSWORD not configured on server' 
    });
  }

  const providedKey = req.headers['x-client-key'];
  
  if (!providedKey || providedKey !== clientPassword) {
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid client key' 
    });
  }

  next();
}