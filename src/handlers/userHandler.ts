import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import knex from "../../db/db";
import axios from "axios";
const lendsqrBaseUrl = process.env.LENDSQR_BASE_URL;
const lendsqrAPIKey = process.env.LENDSQR_APP_SECRET;

export const isBlacklisted = async (email: string): Promise<boolean> => {
  const config = {
    headers: {
      Authorization: `Bearer ${lendsqrAPIKey}`,
    },
  };
  let res: any;
  try {
    res = await axios.get(
      `${lendsqrBaseUrl}/verification/karma/${email}`,
      config
    );
    // console.log('res.data --> ', res.data);
  } catch (error: any) {
    // console.log(error);
    if (
      error?.response?.data?.message.includes(
        "Identity not found in karma ecosystem"
      )
    ) {
      return false;
    }
    return true; // hack, don't try this at home
  }
  return res.data.data?.karma_identity ? true : false;
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { first_name, last_name, email, phone_number, password, bvn } =
      req.body;
    // const payload = req.body;
    if (await isBlacklisted(email)) throw new Error("Invalid User Credentials");

    // check user does not exist
    const existingUser = await knex("users").where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    const toCreate = {
      id,
      first_name,
      last_name,
      email,
      phone_number,
      password: passwordHash,
      bvn,
      updated_at: knex.fn.now(),
    };

    await knex("users").insert({ ...toCreate });

    const createdUser = await knex("users").where({ id }).first();

    return res.status(201).json(createdUser);
  } catch (error: any) {
    // console.error("Error creating user:", error);
    return res.status(400).json({ error: "Failed to create user" });
  }
};
