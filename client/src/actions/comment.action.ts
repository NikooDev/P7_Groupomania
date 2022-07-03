import { checkClientToken } from '@Helper/checkToken'
import Request from '@Service/request'
import { ICommentCreate } from '@Type/newsfeed'

/**
 * Traitement du formulaire des commentaires
 * @param comment
 */
export const postComment = async (comment: ICommentCreate) => {
	const token = checkClientToken()
	let header

	header = { 'Content-Type': 'application/json' }

	try {
		const res = await Request({ method: 'POST', url: '/user/comment/post', token: token, header: header, data: JSON.stringify(comment) })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}

/**
 * Récupération des commentaires
 * @param url
 */
export const getComments = async (url: string) => {
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
 * Mise à jour des commentaires
 * @param comment
 */
export const updateComments = async (comment: ICommentCreate) => {
	const token = checkClientToken()
	let header

	header = { 'Content-Type': 'application/json' }

	try {
		const res = await Request({ method: 'POST', url: '/user/comment/update', token: token, header: header, data: JSON.stringify(comment) })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}

/**
 * Suppression des commentaires
 * @param id
 */
export const deleteComment = async (id: string) => {
	const token = checkClientToken()

	try {
		const res = await Request({ method: 'POST', url: '/user/comment/delete/'+id, token: token })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}