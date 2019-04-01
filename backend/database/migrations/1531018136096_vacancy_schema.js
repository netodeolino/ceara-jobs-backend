'use strict'

const Schema = use('Schema')

class VacancySchema extends Schema {
  up () {
    this.create('vacancies', (table) => {
      table.increments()
      table.string('title', 120).notNullable()
      table.string('description', 3000).notNullable()
      table.dateTime('begin_date').notNullable()
      table.dateTime('end_date').notNullable()
      table.integer('visits').notNullable().default(0)
      table.string('email', 80).notNullable()
      table.string('path_image', 100)
      table.string('type_hiring', 50)
      table.string('level_experience', 50)
      table.float('avg_salary')
      table.boolean('remote').notNullable().default(false)
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('address_id').unsigned().references('id').inTable('addresses')
      table.timestamps()
    })
  }

  down () {
    this.drop('vacancies')
  }
}

module.exports = VacancySchema