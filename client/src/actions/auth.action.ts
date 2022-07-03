import { ILogin, ISignup } from '@Type/auth'
import { removeCookie, setCookie } from '@Helper/cookie'
import { Notif } from '@Core/notifs'
import { toast } from 'react-hot-toast'
import Request from '@Service/request'

/**
 * Traitement des données d'inscription et de connexion
 * @param user
 * @param type
 * @constructor
 */
export const AuthAction = async (user: ISignup | ILogin, type: 'signup' | 'login') => {
	await new Promise(resolve => setTimeout(resolve, 2000))
	let url: string

	switch (type) {
		case 'signup':
			url = '/auth/signup'
			break
		case 'login':
			url = '/auth/login'
			break
		default:
			throw new Error('Type d\'action d\'authentification non défini')
	}

	try {
		const res = await Request({ method: 'POST', url: url, data: JSON.stringify(user), header: { 'Content-Type': 'application/json' } })
		if(!res) return

		if(!res.ok) {
			toast.dismiss()
			Notif({
				id: 'ErrorAuth',
				type: 'error',
				message: type === 'login' ? res.message : res.error.message
			})
		}

		if(type === 'login' && res.ok) {
			const token = res.user.token
			token && setCookie('user', token, 30, 'Lax')
		}

		return res
	} catch (e) {
		console.log('Erreur AuthAction', e)
	}
}

/**
 * Déconnexion des utilisateurs
 * @constructor
 */
export const LogoutAction = async () => {
	try {
		const res = await Request({ method: 'POST', url: '/auth/logout' })
		if(!res) return

		if(res.revoked) {
			removeCookie('user')
			window.location.replace('/')
		}
	} catch (e) {
		console.log('Erreur LogoutAction', e)
	}
}