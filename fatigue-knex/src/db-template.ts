import { knex, Knex } from 'knex'
import { knexSnakeCaseMappers } from './snake-case'

const DEFAULT_DB_NAME = 'db_for_int_tests'

const createTemplate = (db: Knex, dbName: string) => {
  return db.raw(`ALTER DATABASE "${dbName}" WITH is_template TRUE;`)
}

const createConnection = (connection: string, fromDb: string, toDB = DEFAULT_DB_NAME) => {
  return knex({
    client: 'pg',
    connection: connection.replace(fromDb, toDB),
    ...knexSnakeCaseMappers()
  })
}

const createDbFromTemplate = (db: Knex, dbName: string = DEFAULT_DB_NAME, templateName: string) => {
  return db.raw(`CREATE DATABASE "${dbName}" TEMPLATE "${templateName}";`)
}

const createDbFromTemplateAndConnection = async (
  db: Knex,
  connection: string,
  dbName: string = DEFAULT_DB_NAME,
  templateName: string
) => {
  await createDbFromTemplate(db, dbName, templateName)
  return createConnection(connection, templateName, dbName)
}

const dropDb = (db: Knex, dbName: string = DEFAULT_DB_NAME) => {
  return db.raw(`DROP DATABASE "${dbName}";`)
}

const dropDbAndDestroyConnection = async (mainDb: Knex, templateDb: Knex, dbName: string = DEFAULT_DB_NAME) => {
  await templateDb.destroy()
  await mainDb.raw(`DROP DATABASE ${dbName};`)
}

export const KnexDbTemplate = {
  createTemplate,
  createConnection,
  createDbFromTemplate,
  createDbFromTemplateAndConnection,
  dropDb,
  dropDbAndDestroyConnection
}
