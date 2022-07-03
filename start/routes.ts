/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
	return { hello: 'world' }
})

Route.group(() => {
	// Authentification
	Route.post('/signup', 'AuthController.signup')
	Route.post('/login', 'AuthController.login')
	Route.post('/logout', 'AuthController.logout')
}).prefix('/auth').middleware(['checkDB'])

Route.group(() => {
	// Utilisateurs
	Route.get('/get', 'UsersController.read')
	Route.get('/get/:user', 'UsersController.readProfile')
	Route.get('/get/users/list', 'UsersController.listUsers')
	Route.post('/update', 'UsersController.update')
	Route.post('/username/post', 'UsersController.updateUsername')
	Route.post('/delete', 'UsersController.delete')

	// Publications
	Route.post('/newsfeed/post', 'PostsController.create')
	Route.get('/newsfeed/get/:page', 'PostsController.read')
	Route.post('/newsfeed/update/:id', 'PostsController.update')
	Route.post('/newsfeed/delete/:id', 'PostsController.delete')
	Route.post('/newsfeed/like', 'PostsController.like')

	// Commentaires
	Route.post('/comment/post', 'CommentsController.create')
	Route.get('/comment/get', 'CommentsController.read')
	Route.post('/comment/update', 'CommentsController.update')
	Route.post('/comment/delete/:id', 'CommentsController.delete')

	// Uploads
	Route.post('/avatar/post', 'UploadsController.postAvatar')
	Route.post('/avatar/delete', 'UploadsController.deleteAvatar')

	// Administrateur
	Route.get('/admin/check', 'AdminController.checkAdmin')
	Route.post('/admin/delete/user', 'AdminController.deleteUser')
	Route.post('/admin/delete/post', 'AdminController.deletePost')
}).prefix('/user').middleware(['checkDB', 'auth'])
