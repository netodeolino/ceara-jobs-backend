'use strict'

const Model = use('Model')

class Group extends Model {
  groupUser () {
    return this.hasMany('App/Models/UserGroup')
  }
}

module.exports = Group
