import { Request, Response, NextFunction } from 'express';

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Error en el servidor', details: error.message });
    });
};

export default asyncHandler;