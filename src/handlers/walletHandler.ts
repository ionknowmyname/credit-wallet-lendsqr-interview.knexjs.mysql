import { Request, Response } from 'express'
import knex from "../../db/db";
import { v4 as uuidv4 } from "uuid";

const createWallet = async (req: Request, res: Response): Promise<any> => { 
    // const currentUserEmail =  (<any>req).user;

    try {
      const { userId } = req.body;

      // check user does exist
      const existingUser = await knex("users").where({ id: userId }).first();
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const existingWallet = await knex("wallets")
        .where({ user_id: userId })
        .first();
      if (existingWallet) {
        return res.status(400).json({ message: "User already has a wallet." });
      }

      const id = uuidv4();
      const toCreate = {
        id,
        user_id: userId,
        balance: 0.0,
        updated_at: knex.fn.now(),
      };

      await knex("wallets").insert({ ...toCreate });
      const newWallet = await knex("wallets").where({ id }).first();
      return res.status(201).json(newWallet);
    } catch (error) {
        // console.log(error);
        return res.status(400).json({ error: "Failed to create wallet" });
    }
  
      
}

export default createWallet;