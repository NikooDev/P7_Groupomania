import { IUpdateUser, IUser } from '@Type/user'
import { checkClientToken } from '@Helper/checkToken'
import Request from '@Service/request'

/**
 * Récupère les données de l'utilisateur
 */
export const getUser = async (url: string): Promise<IUser | undefined> => {
	await new Promise(resolve => setTimeout(resolve, 800))
	const token = checkClientToken()

	try {
		const res = await Request({ method: 'GET', url: url, token: token })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}

/**
 * Mise à jour des données de l'utilisateur
 */
export const updateUser = async (user: IUpdateUser) => {
	const token = checkClientToken()
	let header

	header = { 'Content-Type': 'application/json' }

	try {
		const res = await Request({ method: 'POST', url: '/user/update', header: header, token: token, data: JSON.stringify(user) })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}

/**
 * Suppression de l'utilisateur
 */
export const deleteUser = async (user: IUpdateUser) => {
	const token = checkClientToken()
	let header

	header = { 'Content-Type': 'application/json' }

	try {
		const res = await Request({ method: 'POST', url: '/user/delete', header: header, token: token, data: JSON.stringify(user) })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}

/**
 * Récupération des données de la page profil
 * @param url
 * @param token
 */
export const getProfile = async (url: string, token: string) => {
	try {
		const res = await Request({ method: 'GET', url: url, token: token })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}

interface IPostUsername {
	username: string
}

/**
 * Traitement de l'username
 * @param username
 */
export const postUsername = async (username: IPostUsername) => {
	const token = checkClientToken()
	let header

	header = { 'Content-Type': 'application/json' }

	try {
		const res = await Request({ method: 'POST', url: '/user/username/post', header: header, token: token, data: JSON.stringify(username) })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}

export const listUsers = async () => {
	const token = checkClientToken()

	try {
		const res = await Request({ method: 'GET', url: '/user/get/users/list', token: token })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}