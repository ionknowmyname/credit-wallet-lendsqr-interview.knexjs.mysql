import { Knex } from "knex";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// exports.up = function (knex) {};
export async function up(knex: Knex) {
  await knex.schema.createTable("users", (table) => {
    // table.uuid("id").primary().defaultTo(knex.raw("UUID()"));
    table.string("id", 36).primary();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("email").unique().notNullable();
    table.string("phone_number").notNullable();
    table.string("password").notNullable();
    table.string("bvn");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at");
      // .defaultTo(knex.fn.now())
      // .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    // table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// exports.down = function (knex) {};
export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists("users");
}
