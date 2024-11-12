import { Router } from 'express'
import createWallet from '../handlers/walletHandler';


const walletRouter = Router();

walletRouter.post('/create', createWallet);




export default walletRouter;