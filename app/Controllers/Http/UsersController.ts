import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

export default class UsersController {
	/**
	 * Récupère les données de l'utilisateur
	 */
	public async read ({ auth, response }: HttpContextContract) {
		try {
			await auth.use('api').authenticate()

			const user = auth.user && await User.find(auth.user.id)
			if(!user) return

			await user.load('profile')
			await user.load('avatar')

			return user.serialize()
		} catch (e) {
			return response.status(401).json({ message: e.message })
		}
	}

	/**
	 * Récupère les données d'un profil utilisateur
	 */
	public async readProfile ({ params, auth, response }: HttpContextContract) {
		try {
			await auth.use('api').authenticate()

			const profile = await User.query().where(auth.user && params.user === auth.user.id ? 'id' : 'username', params.user).first()
			if(!profile) return { profile: null }

			await profile.load('profile')
			await profile.load('avatar')

			return profile.serialize()
		} catch (e) {
			return response.status(401).json({ message: e.message })
		}
	}

	/**
	 * Met à jour le profil de l'utilisateur
	 */
	public async update ({ request, auth, response }: HttpContextContract) {
		const name = request.input('name'), firstname = request.input('firstname'), email = request.input('email')
		let update = {}

		try {
			const user = await User.findOrFail(auth.user?.id)

			if(firstname) update = { firstname: firstname }
			if(name) update = { name: name }
			if(email) user.email = email

			user.related('profile').updateOrCreate({ userId: auth.user?.id }, update)
			await user.save()

			return response.status(200).json({ ok: true })
		} catch (e) {
			console.log(e)
		}
	}

	/**
	 * Met à jour l'username de l'utilisateur
	 * @param request
	 * @param auth
	 * @param response
	 */
	public async updateUsername ({ request, auth, response }: HttpContextContract) {
		const username = request.input('username')

		try {
			const user = await User.findOrFail(auth.user?.id)

			if(user) {
				user.username = username
				user.usernameChanged = true
				await user.save()
			}

			return response.status(200).json({ ok: true })
		} catch (e) {
			if(e.code === '23505') {
				return response.status(401).json({ message: e.code })
			} else console.log(e)
		}
	}

	/**
	 * Supprime le compte utilisateur
	 */
	public async delete ({ request, auth, response }: HttpContextContract) {
		const email = request.input('confirm_delete')

		try {
			if(email !== auth.user?.email) return

			const user = await User.findOrFail(auth.user?.id)
			if(user && auth.user) {
				await user.delete()
			}

			return response.status(200).json({ ok: user?.$isDeleted })
		} catch (e) {
			console.log(e)
		}
	}

	/**
	 * Retourne la liste des utilisateurs
	 * @param response
	 */
	public async listUsers ({ response }: HttpContextContract) {
		try {
			const listUsers = await Database.from('users')
				.leftJoin('profiles', 'users.id', '=', 'profiles.user_id')
				.leftJoin('avatars', 'users.id', '=', 'avatars.user_id')
				.select(['profiles.firstname', 'profiles.name', 'avatars.avatar_url', 'users.username', 'users.id', 'users.role'])
			if(!listUsers) return

			return response.status(200).json(listUsers)
		} catch (e) {
			console.log(e)
		}
	}
}