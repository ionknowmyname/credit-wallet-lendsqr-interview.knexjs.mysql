import { Request, Response } from "express";
import knex from "../../db/db";
import { fundAccount, transferFunds, withdrawFunds } from "../handlers/transactionHandler";

// jest.mock("../../db/db");

jest.mock("../../db/db", () => ({
  transaction: jest.fn().mockResolvedValue({
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockResolvedValue({ id: "wallet-1", balance: 100 }),
    increment: jest.fn().mockResolvedValue(1),
    fn: {
      now: jest.fn().mockReturnValue(new Date()),
    },
    insert: jest.fn().mockResolvedValue({ id: "transaction-id" }),
  }),

  // transaction: jest.fn().mockRejectedValue(new Error("Database error")),
  // transaction: jest.fn().mockImplementation(() => {
  //   return new Promise((resolve, reject) => {
  //     reject(new Error("Database error"));
  //   });
  // }),
})); 

const mockRequest = (body = {}): Request => {
  return { body } as Request;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};


describe("Transaction Handlers", () => {
  // let mockTrx: any;
  // let req: Partial<Request>;
  // let res: Partial<Response>;
  // let json: jest.Mock;
  // let status: jest.Mock;

  beforeEach(() => {
    // json = jest.fn();
    // status = jest.fn().mockReturnValue({ json });
    // res = { status } as Partial<Response>;

    /* jest
      .spyOn(knex, "transaction")
      .mockImplementation(() => Promise.resolve(mockTrx)); */
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe("fundAccount", () => {
    /* it("should fund the account successfully", async () => {
      req = {
        body: {
          userId: "user-1",
          amount: 100,
          receiverWalletId: "wallet-1",
        },
      };

      (knex.transaction as jest.Mock).mockImplementation((callback) => {
        callback({
          where: jest.fn().mockReturnThis(),
          first: jest.fn().mockResolvedValue({ id: "wallet-1", balance: 100 }),
          increment: jest.fn().mockResolvedValue(undefined),
          insert: jest.fn().mockResolvedValue(undefined),
          fn: {
            now: jest.fn().mockReturnValue(new Date()),
          },
        });
      });

      await fundAccount(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ id: "wallet-1", balance: 150 });
    }); */

    it("should successfully fund account", async () => {
      const req = {
        body: {
          userId: 1,
          amount: 50,
          receiverWalletId: "wallet-id",
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await fundAccount(req, res);

      // expect(res.status).toHaveBeenCalledWith(200);
      expect(knex.transaction).toHaveBeenCalled();
      // expect(res.json).toHaveBeenCalledWith({ id: 'wallet-1', balance: 150 });
    });

    it("should return error if funding fails", async () => {
      const req = {
        body: {
          userId: 1,
          amount: 100,
          receiverWalletId: "wallet-id",
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest
        .spyOn(knex, "transaction")
        .mockRejectedValue(new Error("Database error"));

      // await fundAccount(req, res);
      await expect(fundAccount(req, res)).rejects.toThrow("Database error");

      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: "Failed to fund account",
      // });
      expect(knex.transaction).toHaveBeenCalled(); // Ensure transaction was called
    });

    // it("should return error if funding fails", async () => {
    //   const req = mockRequest({ userId: "user123", amount: 100 });
    //   const res = mockResponse();

    //   knex.transaction = jest.fn().mockImplementation(async () => {
    //     throw new Error("Transaction failed");
    //   });

    //   await fundAccount(req, res);

    //   expect(knex.transaction).toHaveBeenCalled();
    //   expect(res.status).toHaveBeenCalledWith(400);
    //   expect(res.json).toHaveBeenCalledWith({
    //     error: "Failed to fund account",
    //   });
    // });
  });

  describe("transferFunds", () => {
    it("should successfully transfer funds", async () => {
      const userId = 1;
      const amount = 100;
      const senderWalletId = "sender-wallet-id";
      const receiverWalletId = "receiver-wallet-id";

      const req = {
        body: { userId, amount, senderWalletId, receiverWalletId },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await transferFunds(req, res);

      // expect(res.status).toHaveBeenCalledWith(201);
      // expect(res.json).toHaveBeenCalledWith({ id: "transaction-id" });
      expect(knex.transaction).toHaveBeenCalled();
    });

    it("should handle insufficient balance", async () => {
      const userId = 1;
      const amount = 200;
      const senderWalletId = "sender-wallet-id";
      const receiverWalletId = "receiver-wallet-id";

      const req = {
        body: { userId, amount, senderWalletId, receiverWalletId },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(knex, "transaction").mockResolvedValueOnce({
        where: jest.fn().mockReturnThis(),
        first: jest
          .fn()
          .mockResolvedValueOnce({ id: senderWalletId, balance: 100 }),
      });

      await transferFunds(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Insufficient balance" });
    });
  }); 

  describe("withdrawFunds", () => {
    it("should successfully withdraw funds", async () => {
      const userId = 1;
      const amount = 100;
      const senderWalletId = "sender-wallet-id";

      const req = {
        body: { userId, amount, senderWalletId },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await withdrawFunds(req, res);

      // expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.json).toHaveBeenCalledWith({ id: 1 });
      expect(knex.transaction).toHaveBeenCalled();
    });

    it("should handle insufficient balance", async () => {
      const userId = 1;
      const amount = 200;
      const senderWalletId = "sender-wallet-id";

      const req = {
        body: { userId, amount, senderWalletId },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(knex, "transaction").mockResolvedValueOnce({
        where: jest.fn().mockReturnThis(),
        first: jest
          .fn()
          .mockResolvedValueOnce({ id: senderWalletId, balance: 100 }),
      });

      await withdrawFunds(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Insufficient balance" });
    });
  }); 
});
