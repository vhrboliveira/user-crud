const { Router } = require('express');

const swaggerUi = require('swagger-ui-express');
const doc = require('./doc/doc');

const routes = Router();

const UserController = require('./controllers/UserController');

const userController = new UserController();

routes.use('/doc', swaggerUi.serve, swaggerUi.setup(doc));

routes.get('/', userController.show);

routes.get('/user/:id', userController.get);
routes.delete('/user/:id', userController.delete);
routes.patch('/user/:id', userController.patch);

routes.get('/user', userController.search);
routes.post('/user', userController.create);

module.exports = {
  routes,
};
