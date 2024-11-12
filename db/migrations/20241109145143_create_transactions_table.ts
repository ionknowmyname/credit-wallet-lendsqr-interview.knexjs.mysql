import { Knex } from "knex";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// exports.up = function(knex) {

// };

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    // table.uuid("id").primary().defaultTo(knex.raw("UUID()"));
    table.string("id", 36).primary();
    table
      .uuid("sender_wallet_id")
      .references("id")
      .inTable("wallets");
      // .onDelete("SET NULL");
    table.uuid("receiver_wallet_id").notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table.enum("transaction_type", ["fund", "transfer", "withdraw"]).notNullable();
    // .defaultTo("transfer");
    table
      .enum("status", ["pending", "completed", "failed"])
      .notNullable()
      .defaultTo("pending");
    table.string("external_ref");
    // table.timestamps(true, true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at");
      // .defaultTo(knex.fn.now())
      // .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// exports.down = function(knex) {

// };
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");
}
