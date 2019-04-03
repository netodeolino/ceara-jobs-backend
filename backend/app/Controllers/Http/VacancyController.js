'use strict'

const Vacancy = use('App/Models/Vacancy')
const Address = use('App/Models/Address')
const User = use('App/Models/User')
const Database = use('Database')
const Logger = use('Logger')

class VacancyController {
  
  async save({ request, auth, response }) {
    Logger.info('request url is %s', request.url())

    const user = await User.find(auth.user.id)
    const data = request.only(['data'])
    const file = request.file('image', { types: ['image'], size: '2mb' })

    const { address, title, email, path_image, description, type_hiring, level_experience, avg_salary, remote } = JSON.parse(data.data)
    const vacancy = { title, email, path_image, description, type_hiring, level_experience, avg_salary, remote }

    let vacancySave = null
    let addressSave = null
    try {
      const trx = await Database.beginTransaction()
      vacancySave = await Vacancy.save(vacancy)
      addressSave = await Address.save(address)

      if (vacancySave && addressSave) {
        await Vacancy.setAddressId(vacancySave, addressSave.id)
      }
      
      if (file && vacancySave) {
        await Vacancy.setImagePathS3(vacancySave, file)
      }
  
      if (user && vacancySave) {
        await Vacancy.setUserId(vacancySave, user.id)
      }
      trx.commit()
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Erro ao salvar vaga.',
        error: error.message
      })
    }

    return response.status(200).json({
      status: 'Sucesso',
      message: 'Cadastro realizado com sucesso.'
    })
  }

  async listAll({ request, response }) {
    Logger.info('request url is %s', request.url())
    
    try {
      return await Vacancy.listAllNotExpirated()
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao listar vagas.',
        error: error.message
      })
    }
  }

  async paginate({ params, request, response }) {
    Logger.info('request url is %s', request.url())

    try {
      return await Vacancy.paginateNotExpirated(params.page)
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro no paginar vagas.',
        error: error.message
      })
    }
  }

  async forPage({ params, request, response }) {
    Logger.info('request url is %s', request.url())
    
    try {
      return await Vacancy.forPageNotExpirated(params.page)
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro no forPage vagas.',
        error: error.message
      })
    }
  }

  async findOne({ params, request, response }) {
    Logger.info('request url is %s', request.url())
    try {
      await Vacancy.toIncreaseVisits(params.id)
      const vacancy = await Vacancy.find(params.id)
      vacancy.user = await User.find(vacancy.user_id)
      return vacancy
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao procurar vaga.',
        error: error.message
      })
    }
  }

  async listLength({ request, response }) {
    Logger.info('request url is %s', request.url())

    try {
      return await Vacancy.listLengthNotExpirated()
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao buscar quantidade de vagas não espiradas.',
        error: error.message
      })
    }
  }

  async listVacanciesByUser({ params, request, response }) {
    Logger.info('request url is %s', request.url())
    
    try {
      const user = await User.find(params.id)
      return await Vacancy
        .query()
        .where('user_id', user.id)
        .where('end_date', '>=', new Date())
        .fetch()
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao procurar vagas do usuário.',
        error: error.message
      })
    }
  }

  async delete({ params, request, response }) {
    Logger.info('request url is %s', request.url())

    try {
      const vacancy = await Vacancy.find(params.id);
      await vacancy.delete().then(() => {
        return response.status(200).json({
          status: 'Sucesso',
          message: 'Vaga excluída com sucesso.'
        })
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao apagar vaga.',
        error: error.message
      })
    }  
  }

  async findByTitle({ params, request, response }) {
    Logger.info('request url is %s', request.url())
    
    try {
      return await Vacancy.findByTitle(params.title)
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao procurar vagas por título.',
        error: error.message
      })
    }
  }
}

module.exports = VacancyController
