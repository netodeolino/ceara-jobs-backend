'use strict'

const Model = use('Model')

class Address extends Model {
  static async save(address) {
    try {
      return await this.create(address)
    } catch (error) {
      return false
    }
  }
}

module.exports = Address
