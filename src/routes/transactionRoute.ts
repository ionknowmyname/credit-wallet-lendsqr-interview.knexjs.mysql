import { Router } from 'express'
import { fundAccount, transferFunds, withdrawFunds } from '../handlers/transactionHandler';


const transactionRouter = Router();

transactionRouter.post("/fund", fundAccount);

transactionRouter.post("/transfer", transferFunds);

transactionRouter.post("/withdraw", withdrawFunds);

export default transactionRouter;