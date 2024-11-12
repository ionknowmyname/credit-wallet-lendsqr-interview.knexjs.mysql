import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import knex from "../../db/db";

export const fundAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
    try {
        const { userId, amount, receiverWalletId } = req.body;

        knex.transaction(async (trx) => {

            const existingWallet = await trx("wallets")
                .where({ user_id: userId })
                .first();

            await trx("wallets")
              .where({ user_id: userId })
              .increment("balance", amount);

            // call payment provider

            const id = uuidv4();
            const external_ref = uuidv4();  // replace with ref from payment provider
            const toCreate = {
              id,
              user_id: userId,
              amount,
              // sender_wallet_id: '',
              receiver_wallet_id: existingWallet.id, //receiverWalletId,
              transaction_type: "fund",
              status: "pending",
              external_ref,
              updated_at: trx.fn.now(),
            };
            await trx("transactions").insert({ ...toCreate });

            const updatedWallet = await trx("wallets")
                .where({ user_id: userId })
                .first();

            return res.status(200).json(updatedWallet);
        });
        
    } catch (error) {
        return res.status(400).json({ error: "Failed to fund account" });
    }
};

export const transferFunds = async (
  req: Request,
  res: Response
): Promise<any> => {
    try {
        const { userId, amount, senderWalletId, receiverWalletId } = req.body;
        
        knex.transaction(async (trx) => {
            const senderWallet = await trx("wallets")
                .where({ user_id: userId })
                .first();
            if (senderWallet.balance < amount)
                throw new Error("Insufficient balance");

            await trx("wallets")
              .where({ user_id: userId })  // id: senderWalletId
              .decrement("balance", amount);
            await trx("wallets")
                .where({ id: receiverWalletId })
                .increment("balance", amount);

            const id = uuidv4();
            const toCreate = {
              id,
              user_id: userId,
              amount,
              sender_wallet_id: senderWalletId,
              receiver_wallet_id: receiverWalletId,
              transaction_type: "transfer",
              status: "completed",
              updated_at: trx.fn.now(),
            };
            await trx("transactions").insert({ ...toCreate });

            const newTransaction = await trx("transactions")
              .where({ id })
              .first();
            return res.status(201).json(newTransaction);
        });
    } catch (error) {
        return res.status(400).json({ error: "Failed to transfer funds" });
    }
};

export const withdrawFunds = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, amount, senderWalletId } = req.body;

    knex.transaction(async (trx) => {
      const existingWallet = await trx("wallets")
        .where({ user_id: userId })
        .first();

      if (existingWallet.balance < amount)
        throw new Error("Insufficient balance");

      await trx("wallets")
        .where({ user_id: userId })
        .decrement("balance", amount)
        .update({ updated_at: trx.fn.now() });

      // call payment provider to transfer to bank account

      const id = uuidv4();
      const external_ref = uuidv4();  // replace with ref from payment provider
      const toCreate = {
        id,
        user_id: userId,
        amount,
        sender_wallet_id: existingWallet.id, // senderWalletId,
        // receiver_wallet_id: '' ,
        transaction_type: "withdraw",
        status: "pending",
        external_ref,
        updated_at: trx.fn.now(),
      };
      await trx("transactions").insert({ ...toCreate });

      const updatedWallet = await trx("wallets")
        .where({ user_id: userId })
        .first();

      return res.status(200).json(updatedWallet);
    });
  } catch (error) {
    return res.status(400).json({ error: "Failed to withdraw funds" });
  }
};
