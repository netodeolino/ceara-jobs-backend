'use strict'

const Schema = use('Schema')

class UserGroupSchema extends Schema {
  up () {
    this.create('user_groups', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('group_id').unsigned().references('id').inTable('groups')
      table.timestamps()
    })
  }

  down () {
    this.drop('user_groups')
  }
}

module.exports = UserGroupSchema
