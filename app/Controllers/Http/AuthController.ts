import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import UserValidator from 'App/Validators/UserValidator'
import ProfileValidator from 'App/Validators/ProfileValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
	/**
	 * Inscription des utilisateurs
	 * @param request
	 * @param response
	 */
	public async signup ({ request, response }: HttpContextContract) {
		try {
			const validUser = await request.validate(UserValidator), validProfile = await request.validate(ProfileValidator)

			validProfile.firstname.toLowerCase()
			validProfile.name.toLowerCase()

			const user = await User.create({ email: validUser.reg_email.toLowerCase(), password: validUser.reg_password })
			user.username = user.id
			user.related('profile').create({ userId: user.id, ...validProfile })

			return {
				ok: user.$isPersisted
			}
		} catch (e) {
			for(let k in e.messages.errors) {
				if(e.messages.errors.hasOwnProperty(k)){
					return response.json({ ok: false, error: e.messages.errors[k] })
				}
			}
			return response.status(500).json({ ok: false, message: 'Erreur serveur' })
		}
	}

	/**
	 * Connexion des utilisateurs
	 * @param request
	 * @param response
	 * @param auth
	 */
	public async login ({ request, response, auth }: HttpContextContract) {
		const email = request.input('email'), password = request.input('password')

		try {
			const token = await auth.use('api').attempt(email, password, {
				expiresIn: '30days',
				name: 'authToken'
			})
			const user = auth.user && await Database.from('users')
				.leftJoin('profiles', 'users.id', '=', 'profiles.user_id')
				.leftJoin('avatars', 'users.id', '=', 'avatars.user_id')
				.select(['users.id', 'profiles.firstname', 'profiles.name', 'avatars.avatar_url'])
				.where('users.id', '=', auth.user.id).first()
			if(!user) return

			return {
				ok: true,
				user: token.toJSON()
			}
		} catch (e) {
			let errorMsg: string, field: string | undefined

			switch (e.code) {
				case 'E_INVALID_AUTH_UID':
					errorMsg = 'Aucun compte ne correspond à cette adresse e-mail'
					field = 'email'
					break
				case 'E_INVALID_AUTH_PASSWORD':
					errorMsg = 'Votre mot de passe est incorrect'
					field = 'password'
					break
				default:
					errorMsg = 'Erreur serveur'
			}

			return response.json({ ok: false, error: true, message: errorMsg, field: field })
		}
	}

	/**
	 * Déconnexion
	 * @param auth
	 * @param response
	 */
	public async logout ({ auth, response }: HttpContextContract) {
		try {
			await auth.use('api').revoke()

			return response.status(200).json({ revoked: true })
		} catch (e) {
			console.log('Erreur logout', e)
		}
	}
}
