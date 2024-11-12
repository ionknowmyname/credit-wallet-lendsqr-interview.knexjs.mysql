// const knex = require("knex");
// const knexFile = require("../knexfile");
import Knex from "knex";
import knexConfig from "../knexfile";

const environment = process.env.NODE_ENV || "development";

const knex = Knex(knexConfig[environment]);

// module.exports = knex(knexFile[environment]);
export default knex;