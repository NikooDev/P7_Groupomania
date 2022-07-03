import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Post from 'App/Models/Post'

export default class AdminController {
	/**
	 * Vérifie si l'utilisateur est admin ou non
	 * @param auth
	 * @param response
	 */
	public async checkAdmin ({ auth, response }: HttpContextContract) {
		const isAdmin = auth.user && auth.user.role

		if(isAdmin !== 'admin') return response.status(200).json({ admin: false })

		return response.status(200).json({ admin: true })
	}

	/**
	 * Suppression d'un utilisateur
	 * @param request
	 * @param response
	 */
	public async deleteUser ({ request, response }: HttpContextContract) {
		const userId = request.input('user_id')

		try {
			const user = await User.findOrFail(userId)
			user && await user.delete()

			return response.status(200).json({ ok: user.$isDeleted })
		} catch (e) {
			console.log(e)
		}
	}

	/**
	 * Suppression d'une publication
	 * @param request
	 * @param response
	 */
	public async deletePost ({ request, response }: HttpContextContract) {
		const postId = request.input('post_id')

		try {
			const post = await Post.findOrFail(postId)
			post && await post.delete()

			return response.status(200).json({ ok: post.$isDeleted })
		} catch (e) {
			console.log(e)
		}
	}
}
