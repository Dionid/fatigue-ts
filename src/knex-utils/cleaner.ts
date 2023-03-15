import { Knex } from 'knex'

export const run = async (db: Knex, schemaname: string) => {
  const tableNameList = await db<{ tablename: string; schemaname: string }>('pg_catalog.pg_tables')
    .where({ schemaname })
    .select('tablename')

  await db.transaction(async (tx) => {
    await tx.raw('TRUNCATE TABLE ?? CASCADE;', [tableNameList.map((tn) => tn.tablename)])
  })
}

export const KnexCleaner = {
  run
}
