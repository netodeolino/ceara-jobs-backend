'use strict'

const Model = use('Model')
const Helpers = use('Helpers')
const Database = use('Database')
const Hash = use('Hash')
const Drive = use('Drive')

const fs = require('fs')

class User extends Model {
  static boot () {
    super.boot()
    
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  static async save(user) {
    try {
      return await this.create(user)
    } catch (error) {
      return false
    }
  }

  static async saveWithDatabase(user) {
    try {
      if (user.password) {
        user.password = await Hash.make(user.password)
      }
      return await Database.insert(user).into('users')
    } catch (error) {
      return false
    }
  }

  static async setAddressId(userId, AdressId) {
    try {
      let user = await this.find(userId)
      user.address_id = AdressId
      return await user.save()
    } catch (error) {
      return false
    }
  }

  static async setImagePath(userId, file) {
    try {
      let user = await this.find(userId)
      await file.move(Helpers.publicPath('uploads'), {
        name: `user-${user.id}.${file.subtype}`
      })
  
      if (!file.moved()) {
        return false
      }
  
      user.path_image = `user-${user.id}.${file.subtype}`
      return await user.save()
    } catch (error) {
      return false
    }
  }

  static async setImagePathS3(userId, file) {
    try {
      let user = await this.find(userId)

      let resp = null
      if (user) {
        resp = await Drive.disk('s3').put(`user/${user.id}.${file.subtype}`, fs.createReadStream(file.tmpPath))
      }
  
      if (!resp) {
        return false
      }
      
      user.path_image = resp
      return await user.save()
    } catch (error) {
      return false
    }
  }

  static async findByName(name) {
    try {
      return await Database
        .select('*')
        .from('users')
        .where('name', name)
        .first()
    } catch (error) {
      return false
    }
  }

  static async numberOfVacancies(userId) {
    try {
      let total = await Database
        .from('vacancies')
        .where('user_id', userId)
        .count('id')
      return total[0].count
    } catch (error) {
      return false
    }
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  vacancies () {
    return this.hasMany('App/Models/Vacancy')
  }

  userGroup () {
    return this.hasMany('App/Models/UserGroup')
  }

  address () {
    return this.hasOne('App/Models/Address')
  }
}

module.exports = User
