import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'photos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id')
      table.uuid('user_id').references('users.id').onDelete('CASCADE')
      //table.uuid('album_id').references('albums.id')
      table.uuid('post_id').references('posts.id').onDelete('CASCADE')
      table.string('photo_url').notNullable()
      table.string('photo_title', 30).nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
