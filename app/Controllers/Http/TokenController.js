'use strict'

const Logger = use('Logger')

class TokenController {

	async tokenValid ({ auth, request, response }) {
    Logger.info('request url is %s', request.url())
    
    try {
      return await auth.check()
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Tokén inválido.',
        error: error.message
      })
    }
  }
}

module.exports = TokenController
