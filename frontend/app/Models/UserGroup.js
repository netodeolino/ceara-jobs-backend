'use strict'

const Model = use('Model')

class UserGroup extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }
  
  group () {
    return this.belongsTo('App/Models/Group')
  }
}

module.exports = UserGroup
