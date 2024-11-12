import { Router, Request, Response, NextFunction } from 'express';
import { createUser } from '../handlers/userHandler';


const saltround = 10;
const userRouter = Router();

// userRouter.get('/', (req: Request, res: Response) => {
//     return res.json("OK");
// });

  
userRouter.post('/register', createUser);

export default userRouter;