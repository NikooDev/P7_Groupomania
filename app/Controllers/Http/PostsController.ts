import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuid } from 'uuid'
import Post from 'App/Models/Post'
import Application from '@ioc:Adonis/Core/Application'
import Database from '@ioc:Adonis/Lucid/Database'
import fs from 'fs'
import Photo from 'App/Models/Photo'

export default class PostsController {
	private perPage = 10

	/**
	 * Création d'un post
	 * @param request
	 * @param response
	 * @param auth
	 */
	public async create ({ request, response, auth }: HttpContextContract) {
		const text = request.input('post_text'), title = request.input('photo_title')
		const file = request.file('photo', {
			extnames: ['jpg', 'png', 'jpeg']
		})
		let newPost, newPhoto, postId = uuid()

		if(!text && !file) {
			return response.json({ message: 'Vous devriez ajouter du texte ou une photo' })
		}

		try {
			const uploadPath = Application.tmpPath('static/photos/'+auth.user?.id+'/')

			// Si texte uniquement
			if(auth.user) {
				newPost = {
					id: postId,
					userId: auth.user.id,
					postText: text,
					usersLiked: []
				}
			}
			const post = await Post.create(file ? { ...newPost, withPicture: true } : newPost)

			// Si photo avec ou sans texte / title
			if(file && auth.user) {
				newPhoto = {
					userId: auth.user.id,
					postId: postId,
					photoUrl: file.clientName,
					photoTitle: title
				}
				post.related('photos').create(newPhoto)

				await post.save()
				await file.move(uploadPath)
			}

			return response.status(200).json({ ok: post.$isPersisted })
		} catch (e) {
			console.log(e)
		}
	}

	/**
	 * Récupération des posts
	 * @param params
	 * @param response
	 */
	public async read ({ params, response }: HttpContextContract) {
		const page = params.page

		try {
			const posts = await this.requestPagePost(parseInt(page))

			response.status(200).json(posts)
		} catch (e) {
			console.log(e)
		}
	}

	/**
	 * Mise à jour d'un post
	 * @param request
	 * @param response
	 * @param params
	 * @param auth
	 */
	public async update ({ request, response, params, auth }: HttpContextContract) {
		const text = request.input('post_text'), title = request.input('photo_title'),
			imgDeleted = request.input('imgDeleted')
		const file = request.file('photo', {
			extnames: ['jpg', 'png', 'jpeg']
		})
		const post_id = params.id

		if(!text && !file) {
			return response.json({ message: 'Vous devriez ajouter du texte ou une photo' })
		}

		try {
			const uploadPath = Application.tmpPath('static/photos/'+auth.user?.id+'/')
			const postExist = await Post.findBy('id', post_id)
			if(postExist) await postExist.load('photos')
			const post = postExist && postExist.serialize()
			let updatePhoto

			if(postExist && post) {
				let photoExist = post.photos.length !== 0

				if(photoExist) {
					const photoUrl = post.photos.map((photo) => photo.photo_url).toString()
					const photoExistFile = fs.existsSync(uploadPath+photoUrl)

					if(photoExistFile && file) {
						//Si un fichier existe déjà et qu'un autre fichier le remplace

						fs.unlinkSync(uploadPath+photoUrl)
						updatePhoto = {
							photoUrl: file.clientName
						}
						await file.move(uploadPath)
					} else if(photoExistFile && imgDeleted === 'true') {
						//Si un fichier existe déjà et est supprimé et qu'aucun fichier le remplace

						fs.unlinkSync(uploadPath + photoUrl)
						const delPhoto = await Photo.findBy('postId', post_id)
						delPhoto && await delPhoto.delete()
						photoExist = false
					}
				} else if(file) {
					updatePhoto = {
						userId: auth.user?.id,
						postId: post_id,
						photoUrl: file.clientName,
					}
					await file.move(uploadPath)
					photoExist = true
				}

				postExist.postText = text
				postExist.withPicture = photoExist

				updatePhoto = { ...updatePhoto, photoTitle: title }
				photoExist && postExist.related('photos').updateOrCreate({ postId: post_id }, { ...updatePhoto })

				await postExist.save()
			}

			return response.status(200).json({ ok: true })
		} catch (e) {
			console.log(e)
		}
	}

	/**
	 * Suppression d'un post
	 * @param params
	 * @param response
	 * @param auth
	 */
	public async delete ({ params, response, auth }: HttpContextContract) {
		const post_id = params.id

		try {
			const uploadPath = Application.tmpPath('static/photos/'+auth.user?.id+'/')
			const postDeleted = await Post.findBy('id', post_id)
			const photoExist = await Photo.findBy('postId', post_id)

			if(postDeleted) {
				if(photoExist) fs.unlinkSync(uploadPath + photoExist.photoUrl)

				await postDeleted.delete()
			}

			return response.status(200).json({ ok: true, message: 'Publication supprimée' })
		} catch (e) {
			console.log(e)
		}
	}

	/**
	 * Requête de récupération des posts
	 * @param page
	 */
	public async requestPagePost (page: number) {
		const req = await Database.from('posts')
			.leftJoin('users', 'posts.user_id', '=', 'users.id')
			.leftJoin('photos', 'posts.id', '=', 'photos.post_id')
			.leftJoin('profiles', 'posts.user_id', '=', 'profiles.user_id')
			.leftJoin('avatars', 'posts.user_id', '=', 'avatars.user_id')
			.select(['profiles.firstname', 'profiles.name', 'photos.photo_url', 'photos.photo_title', 'avatars.avatar_url', 'users.username', 'posts.*'])
			.orderBy('posts.created_at', 'desc').paginate(page, this.perPage)
		return req.toJSON()
	}

	/**
	 * Like / Dislike
	 * @param request
	 * @param auth
	 * @param response
	 */
	public async like ({ request, auth, response }: HttpContextContract) {
		const postId = request.input('post_id')

		try {
			const postLiked = await Post.findBy('id', postId)

			if(postLiked && auth.user) {
				if(postLiked.usersLiked.includes(auth.user.id)) {
					postLiked.usersLiked = postLiked.usersLiked.filter((f) => f !== auth.user?.id)
				} else {
					const usersExist = postLiked.usersLiked.length !== 0
					postLiked.usersLiked = usersExist ? [...postLiked.usersLiked, auth.user.id] : [auth.user.id]
				}

				await postLiked.save()

				return response.status(200).json({ ok: true })
			}
		} catch (e) {
			console.log(e)
		}
	}
}