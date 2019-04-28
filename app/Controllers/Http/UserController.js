'use strict'

const User = use('App/Models/User')
const Address = use('App/Models/Address')
const Database = use('Database')
const Logger = use('Logger')
const Hash = use('Hash')

class UserController {

  async login({ request, auth, response }) {
    Logger.info('request url is %s', request.url())

    const { email, password } = request.all()
    try {
      let user = await User.findBy({ email })
      let token = null

      if (user) {
        const valido = await Hash.verify(password, user.password)
        if (valido) {
          token = await auth.attempt(email, password)
        } else {
          throw 'Senha inválida.'
        }
      }

      if (token) {
        user.token = token.token;
        user.address = await Address.find(user.address_id);
        user.total_vacancies = await User.numberOfVacancies(user.id);

        return response.status(200).json({
          status: 'Sucesso',
          message: 'Login realizado com sucesso.',
          user,
        })
      } else {
        throw 'Token inválido.'
      }
    } catch (error) {
      return response.status(401).json({
        status: 'Não autorizado',
        message: 'Erro na tentativa de login.',
        error: error.message
      })
    }
  }

  async save({ request, response }) {
    Logger.info('request url is %s', request.url())

    const data = request.only(['data'])
    const file = request.file('image', { types: ['image'], size: '2mb' })

    const { address, name, last_name, email, password, description, path_image, is_company, site } = JSON.parse(data.data)
    const user = { name, last_name, email, password, description, path_image, is_company, site }

    let userSave = null
    let addressSave = null
    try {
      const trx = await Database.beginTransaction()
      
      userSave = await User.save(user)
      if (!userSave) {
        throw 'Erro ao salvar usuário.'
      }
      
      addressSave = await Address.save(address)
      if (!addressSave) {
        throw 'Erro ao salvar endereço do usuário.'
      }

      if (userSave && addressSave) {
        await User.setAddressId(userSave.id, addressSave.id)
      }
  
      if (file && userSave) {
        await User.setImagePathS3(userSave.id, file)
      }
      
      trx.commit()

      return response.status(200).json({
        status: 'Sucesso',
        message: 'Cadastro realizado com sucesso.'
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Erro ao salvar usuário.',
        error: error.message
      })
    }
  }

  async findOne({ params, request, response }) {
    Logger.info('request url is %s', request.url())

    try {
      const user = await User.find(params.id)
      user.address = await Address.find(user.address_id)
      user.total_vacancies = await User.numberOfVacancies(user.id)
      return user
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao buscar usuário.',
        error: error.message
      })
    }
  }

  async availableEmail({ request, response }) {
    Logger.info('request url is %s', request.url())
    
    const { email } = request.all()
    try {
      return await User.findBy({ email }) == null
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao verificar email disponível.',
        error: error.message
      })
    }
  }

  async availableName({ request, response }) {
    Logger.info('request url is %s', request.url())

    const { name } = request.all()
    try {
      return await User.findByName(name) == null
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao verificar nome disponível.',
        error: error.message
      })
    }
  }
}

module.exports = UserController
