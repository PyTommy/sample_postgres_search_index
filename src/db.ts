import Knex from 'knex';

const config: Knex.Knex.Config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'sample_db',
  },
  pool: {
    min: 0,
    max: 10,
    idleTimeoutMillis: 10000,
  },
  acquireConnectionTimeout: 2000,
};

export async function getKnex() {
  const knex = Knex(config);

  try {
    await knex.raw('SELECT now()');

    return knex;
  } catch (error) {
    throw new Error(
      'Unable to connect to Postgres via Knex. Ensure a valid connection.'
    );
  }
}
