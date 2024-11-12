import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("transactions", (table) => {
    table
      .uuid("user_id")
      .notNullable()
      .references("user_id")
      .inTable("wallets");
    table.string("external_ref").unique();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("transactions", (table) => {
    table.dropColumn("user_id");
    table.dropColumn("external_ref");
  });
}

