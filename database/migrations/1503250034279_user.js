'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('last_name', 80)
      table.string('email', 80).notNullable().unique()
      table.string('password', 255).notNullable()
      table.string('path_image', 100)
      table.string('description', 250)
      table.string('site', 250)
      table.boolean('is_company').notNullable().default(false)
      table.integer('address_id').unsigned().references('id').inTable('addresses')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
