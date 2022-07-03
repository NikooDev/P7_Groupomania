import Request from '@Service/request'
import { checkClientToken } from '@Helper/checkToken'

export const checkAdmin = async (url: string, token: string) => {
	try {
		const res = await Request({ method: 'GET', url: url, token: token })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}

interface IState {
	user_id?: string | null
	post_id?: string | null
}

export const deleteUser = async (user_id: IState) => {
	const token = checkClientToken()
	let header

	header = { 'Content-Type': 'application/json' }

	try {
		const res = await Request({ method: 'POST', url: '/user/admin/delete/user', token: token, header: header, data: JSON.stringify(user_id) })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}

export const deletePost = async (post_id: IState) => {
	const token = checkClientToken()
	let header

	header = { 'Content-Type': 'application/json' }

	try {
		const res = await Request({ method: 'POST', url: '/user/admin/delete/post', token: token, header: header, data: JSON.stringify(post_id) })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}