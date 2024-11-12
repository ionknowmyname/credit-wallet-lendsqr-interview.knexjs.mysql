import { Knex } from "knex";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// exports.up = function(knex) {

// };

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("wallets", (table) => {
    // table.uuid("id").primary().defaultTo(knex.raw("UUID()"));
    table.string("id", 36).primary();
    table
      .uuid("user_id")
      .unique()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.decimal("balance", 15, 2).notNullable().defaultTo(0.0);
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
// exports.down = function(knex) {

// };

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("wallets");
}
