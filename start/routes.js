'use strict'

const Route = use('Route')

Route.get('/', () => {
  return { iic: 'Hello world to Idea In Code' }
})

Route.group(() => {
  Route.post('/save', 'VacancyController.save')
  Route.delete('/:id', 'VacancyController.delete')
}).prefix('vacancy').middleware(['auth'])

Route.group(() => {
  Route.get('/', 'VacancyController.listAll')
  Route.get('/:id', 'VacancyController.findOne')
  Route.get('/paginate/:page', 'VacancyController.paginate')
  Route.get('/forpage/:page', 'VacancyController.forPage')
  Route.get('/list-by-user/:id', 'VacancyController.listVacanciesByUser')
  Route.get('/list-by-title/:title', 'VacancyController.findByTitle')
}).prefix('vacancy')

Route.get('/listlength', 'VacancyController.listLength')
Route.post('/available-email', 'UserController.availableEmail')
Route.post('/available-name', 'UserController.availableName')

Route.group(() => {
  Route.post('/login', 'UserController.login')
  Route.post('/save', 'UserController.save')

  Route.get('/:id', 'UserController.findOne')
}).prefix('user')

Route.group(() => {
  Route.get('/valid', 'TokenController.tokenValid')
}).prefix('token')