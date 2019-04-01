'use strict'

const Model = use('Model')
const Helpers = use('Helpers')
const Database = use('Database')
const DAYS_TO_EXPIRATION = 7

class Vacancy extends Model {

  static async save(vacancy) {
    try {
      let dateExpirate = new Date()
      let dateBegin = new Date()
      dateExpirate.setDate(dateExpirate.getDate() + DAYS_TO_EXPIRATION)
      
      vacancy.end_date = dateExpirate
      vacancy.begin_date = dateBegin

      return await this.create(vacancy)
    } catch (error) {
      return error
    }
  }

  static async setAddressId(vacancy, id) {
    try {
      vacancy.address_id = id
      return await vacancy.save()
    } catch (error) {
      return error
    }
  }

  static async setImagePath(vacancy, file) {
    try {
      await file.move(Helpers.publicPath('uploads'), {
        name: `vacancy-${vacancy.id}.${file.subtype}`
      })
  
      if (!file.moved()) {
        return false
      }
  
      vacancy.path_image = `vacancy-${vacancy.id}.${file.subtype}`
      return await vacancy.save()
    } catch (error) {
      return error
    }
  }

  static async setUserId(vacancy, id) {
    try {
      vacancy.user_id = id
      return await vacancy.save()
    } catch (error) {
      return error
    }
  }

  static async listAllNotExpirated() {
    try {
      return await Database
        .select('*')
        .where('end_date', '>=', new Date())
        .from('vacancies')
    } catch (error) {
      return error
    }
  }

  static async paginateNotExpirated(page) {
    try {
      return await Database
        .from('vacancies')
        .where('end_date', '>=', new Date())
        .paginate(page, 5)
    } catch (error) {
      return error
    }
  }

  static async forPageNotExpirated(page) {
    try {
      return await Database
        .from('vacancies')
        .where('end_date', '>=', new Date())
        .forPage(page, 5)
    } catch (error) {
      return error
    }
  }

  static async listLengthNotExpirated() {
    try {
      return await Database
        .from('vacancies')
        .where('end_date', '>=', new Date())
        .getCount()
    } catch (error) {
      return error
    }
  }

  static async toIncreaseVisits(id) {
    try {
      const vacancy = await this.find(id)
      vacancy.visits = vacancy.visits + 1
      await vacancy.save()
    } catch (error) {
      return error
    }
  }

  static async findByTitle(title) {
    try {
      return await Database
        .from('vacancies')
        .whereRaw(`title ilike '%${title}%'`)
        .where('end_date', '>=', new Date())
    } catch (error) {
      console.log(error)
      return error
    }
  }
}

module.exports = Vacancy