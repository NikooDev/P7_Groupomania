import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Database from '@ioc:Adonis/Lucid/Database'

export default class CommentsController {
	/**
	 * Création d'un commentaire
	 * @param request
	 * @param response
	 * @param auth
	 */
	public async create ({ request, response, auth }: HttpContextContract) {
		const text = request.input('comment_text'), postId = request.input('post_id')

		try {
			const comment = await Comment.create({
				postId: postId,
				userId: auth.user?.id,
				commentText: text
			})

			await comment.save()

			return response.status(200).json({ ok: comment.$isPersisted })
		} catch (e) {
			console.log(e)
		}
	}

	/**
	 * Récupération des commentaires
	 * @param response
	 */
	public async read ({ response }: HttpContextContract) {
		try {
			const comments = await Database.from('comments')
				.leftJoin('users', 'comments.user_id', '=', 'users.id')
				.leftJoin('avatars', 'comments.user_id', '=', 'avatars.user_id')
				.leftJoin('profiles', 'comments.user_id', '=', 'profiles.user_id')
				.select(['profiles.firstname', 'profiles.name', 'avatars.avatar_url', 'users.role', 'comments.*'])
				.orderBy('comments.created_at', 'asc')

			return response.status(200).json(comments)
		} catch (e) {
			console.log(e)
		}
	}

	/**
	 * Mise à jour d'un commentaire
	 * @param request
	 * @param response
	 */
	public async update ({ request, response }: HttpContextContract) {
		const text = request.input('comment_text'), commentId = request.input('comment_id')

		try {
			const comment = await Comment.findOrFail(commentId)

			comment.commentText = text

			await comment.save()

			return response.status(200).json({ ok: true })
		} catch (e) {
			console.log(e)
		}
	}

	/**
	 * Suppression d'un commentaire
	 * @param params
	 * @param response
	 */
	public async delete ({ params, response }: HttpContextContract) {
		const postId = params.id

		try {
			const comment = await Comment.findBy('id', postId)

			comment && await comment.delete()

			return response.status(200).json({ ok: true })
		} catch (e) {
			console.log(e)
		}
	}
}
